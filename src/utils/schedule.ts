import differenceInMinutes from 'date-fns/differenceInMinutes';
import getDay from 'date-fns/getDay';
import setHours from 'date-fns/setHours';
import getHours from 'date-fns/getHours';
import setMinutes from 'date-fns/setMinutes';
import getMinutes from 'date-fns/getMinutes';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import addDays from 'date-fns/addDays';
import isBefore from 'date-fns/isBefore';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import isWithinInterval from 'date-fns/isWithinInterval';

const shiftedDates = [6, 0, 1, 2, 3, 4, 5];

const NOW = new Date();
const TOMORROW = addDays(new Date(), 1);
const START_OF_TODAY = startOfDay(NOW);
const END_OF_TODAY = endOfDay(NOW);
const START_OF_TOMORROW = startOfDay(TOMORROW);

interface Slot {
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string,
  day: number;
}


export function parseTime(timeString: string) {
  const [hours, minutes] = timeString.split(':');

  let date = new Date();
  date = setHours(date, parseInt(hours, 10));
  date = setMinutes(date, parseInt(minutes, 10));

  return date;
}

export function formatTime(date: Date) {
  if (getMinutes(date) === 0) {
    return format(date, 'ha');
  }
  return format(date, 'h:mma');
}

function createAutomationSlot(slotId: number, show: any, startDate: Date, endDate: Date) {/* todo */
  return {
    slotId,
    startDate,
    endDate,
    automation: true,
    show,
    duration: differenceInMinutes(endDate, startDate),
  };
}

export function chunkSlotsByDay(slots: Array<Slot>, automationShow: Slot) {
  let slotId = 0;
  const days: Array<Array<any>> = [[], [], [], [], [], [], []];
  let currentDate = START_OF_TODAY;
  let currentDay = 0;

  // parse the times to actual dates - all set to today
  const sortedSlots: Array<Slot> = slots.map(slot => {
    return {
      ...slot,
      startDate: parseTime(slot.startTime),
      endDate: parseTime(slot.endTime),
    };
  });

  // sort the slots by day and start time
  sortedSlots.sort((a: Slot, b: Slot) => {
    if (a.day < b.day) {
      return -1;
    }
    if (a.day > b.day) {
      return 1;
    }

    if (a.day === b.day) {
      return isBefore(a.startDate, b.startDate) ? -1 : 1;
    }

    return 0;
  });

  sortedSlots.forEach(slot => {
    // if slot is first of a new day, set the time to midnight
    if (currentDay !== slot.day) {
      currentDate = START_OF_TODAY;
      currentDay = slot.day;
    }

    // add automation show if there is a gap before this show
    if (
      getHours(currentDate) !== getHours(slot.startDate) ||
      getMinutes(currentDate) !== getMinutes(slot.startDate)
    ) {
      console.log(currentDate, slot.startDate);
      days[slot.day].push(createAutomationSlot(
        slotId++,
        automationShow,
        currentDate,
        slot.startDate
      ));
      currentDate = slot.startDate;
    }

    // add this slot
    // if is overnight
    if (isBefore(slot.endDate, slot.startDate) && getHours(slot.endDate) !== 0 && getMinutes(slot.endDate) !== 0) {
      const diffMins = differenceInMinutes(
        START_OF_TOMORROW,
        slot.startDate
      );
      days[slot.day].push(
        Object.assign({}, slot, {
          slotId: slotId++,
          duration: diffMins,
          type: 'pre-overnight',
        })
      );

      if (slot.day !== 6) {
        const postMins = differenceInMinutes(slot.endDate, START_OF_TOMORROW);
        days[slot.day + 1].push(
          Object.assign({}, slot, {
            startDate: subDays(slot.startDate, 1),
            slotId: slotId++,
            duration: postMins,
            type: 'post-overnight',
          })
        );
      }
    } else {
      days[slot.day].push({
        slotId: slotId++,
        ...slot,
        duration: differenceInMinutes(slot.endDate, slot.startDate),
      });
    }

    currentDate = slot.endDate;
  });

  const startDay = START_OF_TODAY;
  const endDay = END_OF_TODAY;
  days.forEach(daySlots => {
    // create a day length auto-slot if there is nothing on that day
    if (daySlots.length <= 0) {
      daySlots.push(
        createAutomationSlot(slotId++, automationShow, startDay, endDay)
      );
      return;
    }

    // if the last slot isn't overnight and doesn't end at midnight; add auto-slot to midnight
    const lastSlotOfDay = daySlots[daySlots.length - 1];
    if (
      lastSlotOfDay.endDate !== endDay &&
      isBefore(lastSlotOfDay.startDate, lastSlotOfDay.endDate)
    ) {
      daySlots.push(
        createAutomationSlot(
          slotId++,
          automationShow,
          lastSlotOfDay.endDate,
          endDay
        )
      );
    }
  });

  console.log(days);

  return days;
}

export function calculateWidth(number: number) {
  const width = 3600;
  const totalMinutes = 24 * 60;
  const widthPerMinute = width / totalMinutes;
  return number * widthPerMinute;
}

export function calculateWidthWithUnit(number: number) {
  return `${Math.floor(calculateWidth(number))}px`;
}

export function getTodayDayMonday() {
  return shiftedDates[getDay(new Date())];
}

export function getOnAirSlot(slotsByDay: any) { // todo
  const now = new Date();
  const todaySlots = slotsByDay[shiftedDates[getDay(now)]];

  // eslint-disable-next-line
  for (const [_index, slot] of todaySlots.entries()) {
    let endDate = slot.endDate;
    let startDate = slot.startDate;
    if (isBefore(slot.endDate, slot.startDate)) {
      if (slot.type === 'pre-overnight') {
        endDate = addDays(endDate, 1);
      } else if (slot.type === 'post-overnight') {
        startDate = subDays(startDate, 1);
      }
    }

    if (isWithinInterval(now, { start: startDate, end: endDate })) {
      return slot;
    }
  }

  return null;
}

export function getScrollPositionForNow(): number {
  const now = new Date();
  const duration = differenceInMinutes(now, START_OF_TODAY);

  return calculateWidth(duration);
}
