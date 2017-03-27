import parseDate from 'date-fns/parse';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import startOfTomorrow from 'date-fns/start_of_tomorrow';
import getDay from 'date-fns/get_day';
import getHours from 'date-fns/get_hours';
import getMinutes from 'date-fns/get_minutes';
import getSeconds from 'date-fns/get_seconds';
import subDays from 'date-fns/sub_days';
import addDays from 'date-fns/add_days';
import startOfToday from 'date-fns/start_of_today';
import isWithinRange from 'date-fns/is_within_range';

const shiftedDates = [6, 0, 1, 2, 3, 4, 5];


export function chunkSlotsByDay(slots) {
  const days = [[], [], [], [], [], [], []];

  slots.forEach((slot) => {
    if (slot.is_overnight) {
      const slotFrom = parseDate(slot.from_time);
      const diffMins = differenceInMinutes(startOfTomorrow(slotFrom), slotFrom);
      days[slot.day].push(Object.assign({}, slot, { duration: diffMins, type: 'pre-overnight' }));

      if (slot.day !== 6) {
        days[(slot.day + 1)].push(
          Object.assign({}, slot, { duration: slot.duration - diffMins, type: 'post-overnight' }),
        );
      }
    } else {
      days[slot.day].push(slot);
    }
  });
  return days;
}

export function calculateWidth(number, includeUnit = true) {
  const width = 3600;
  const totalMinutes = 24 * 60;
  const widthPerMinute = width / totalMinutes;

  // console.log({ duration: number, width: number * widthPerMinute });

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
      (
        (getHours(toTime) === 0 && getMinutes(toTime) === 0) || slot.is_overnight)
          && index === todaySlots.length - 1) {
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
  return ((15 - (mins % 15)) * 60) + (60 - getSeconds(d));
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
