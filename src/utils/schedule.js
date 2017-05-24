import parseDate from 'date-fns/parse';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import startOfTomorrow from 'date-fns/start_of_tomorrow';
import getDay from 'date-fns/get_day';
import setHours from 'date-fns/set_hours';
import getHours from 'date-fns/get_hours';
import setMinutes from 'date-fns/set_minutes';
import getMinutes from 'date-fns/get_minutes';
import getSeconds from 'date-fns/get_seconds';
import subDays from 'date-fns/sub_days';
import addDays from 'date-fns/add_days';
import isBefore from 'date-fns/is_before';
import startOfToday from 'date-fns/start_of_today';
import endOfToday from 'date-fns/end_of_today';
import isWithinRange from 'date-fns/is_within_range';

const shiftedDates = [6, 0, 1, 2, 3, 4, 5];

function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':');

  let date = new Date();
  date = setHours(date, parseInt(hours, 10));
  date = setMinutes(date, parseInt(minutes, 10));

  return date;
}

function createAutomationSlot(show, startDate, endDate) {
  return {
    startDate,
    endDate,
    automation: true,
    show,
    duration: differenceInMinutes(endDate, startDate),
  };
}

export function chunkSlotsByDay(slots, automationShow) {
  const days = [[], [], [], [], [], [], []];
  let currentDate = startOfToday(new Date());
  let currentDay = 0;

  const sortedSlots = slots.map(slot => {
    return {
      ...slot,
      startDate: parseTime(slot.startTime),
      endDate: parseTime(slot.endTime),
    };
  });

  sortedSlots.sort((a, b) => {
    if (a.day < b.day) {
      return -1;
    }
    if (a.day > b.day) {
      return 1;
    }

    if (a.day === b.day) {
      return isBefore(a.startDate, b.startDate) ? -1 : 1;
    }
  });

  sortedSlots.forEach(slot => {
    if (currentDay !== slot.day) {
      currentDate = startOfToday(new Date());
      currentDay = slot.day;
    }
    // add automation show if there is a gap before this show
    if (currentDate !== slot.startDate) {
      days[slot.day].push(
        createAutomationSlot(automationShow, currentDate, slot.startDate)
      );
      currentDate = slot.startDate;
    }

    // add this show
    if (isBefore(slot.endDate, slot.startDate)) {
      const diffMins = differenceInMinutes(
        startOfTomorrow(slot.startDate),
        slot.startDate
      );
      days[slot.day].push(
        Object.assign({}, slot, {
          duration: diffMins,
          type: 'pre-overnight',
        })
      );

      if (slot.day !== 6) {
        const postMins = differenceInMinutes(slot.endDate, startOfTomorrow());
        days[slot.day + 1].push(
          Object.assign({}, slot, {
            duration: postMins,
            type: 'post-overnight',
          })
        );
      }
    } else {
      days[slot.day].push({
        ...slot,
        duration: differenceInMinutes(slot.endDate, slot.startDate),
      });
    }

    currentDate = slot.endDate;
  });

  const startDay = startOfToday();
  const endDay = endOfToday();
  days.forEach(daySlots => {
    if (daySlots.length <= 0) {
      daySlots.push(createAutomationSlot(automationShow, startDay, endDay));
    } else if (daySlots[daySlots.length - 1].endDate !== endDay) {
      const lastSlot = daySlots[daySlots.length - 1];
      daySlots.push(
        createAutomationSlot(automationShow, lastSlot.endDate, endDay)
      );
    }
  });

  return days;
}

export function calculateWidth(number, includeUnit = true) {
  const width = 3600;
  const totalMinutes = 24 * 60;
  const widthPerMinute = width / totalMinutes;

  if (!includeUnit) {
    return number * widthPerMinute;
  }

  return `${Math.floor(number * widthPerMinute)}px`;
}

export function getTodayDayMonday() {
  return shiftedDates[getDay(new Date())];
}

export function getOnAirSlot(slots) {
  const byDay = chunkSlotsByDay(slots);
  const now = new Date();
  const todaySlots = byDay[shiftedDates[getDay(now)]];

  // eslint-disable-next-line
  for (const [index, slot] of todaySlots.entries()) {
    let fromTime = parseDate(slot.from_time);
    let toTime = parseDate(slot.to_time);

    if (slot.is_overnight && index === 0) {
      fromTime = subDays(fromTime, 1);
    }

    if (
      ((getHours(toTime) === 0 && getMinutes(toTime) === 0) ||
        slot.is_overnight) &&
      index === todaySlots.length - 1
    ) {
      toTime = addDays(toTime, 1);
    }

    if (isWithinRange(now, fromTime, toTime)) {
      return slot;
    }
  }

  return null;
}

export function getSecondsToNextQuater() {
  const d = new Date();
  const mins = getMinutes(d);
  return (15 - mins % 15) * 60 + (60 - getSeconds(d));
}

getSecondsToNextQuater();

export function slotIsOnAt(slot, momentObject, listPosition) {
  let fromTime = parseDate(slot.from_time);
  let toTime = parseDate(slot.to_time);

  if (slot.is_overnight && listPosition === 0) {
    fromTime = subDays(fromTime, 1);
  }

  if (slot.is_overnight && listPosition === 1) {
    toTime = addDays(toTime, 1);
  } else {
    console.log('X');
  }

  try {
    return isWithinRange(new Date(), fromTime, toTime);
  } catch (e) {
    console.log(e, fromTime, toTime, listPosition, slot.is_overnight);
    return false;
  }
}

export function getScrollPositionForSlot(slot) {
  const onAirStartTime = parseDate(slot.from_time);
  const startOfDay = startOfToday();
  const duration = differenceInMinutes(onAirStartTime, startOfDay);

  return calculateWidth(duration, false);
}
