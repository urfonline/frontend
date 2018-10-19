import differenceInMinutes from 'date-fns/differenceInMinutes';
import getDay from 'date-fns/getDay';
import setHours from 'date-fns/setHours';
import isSameDay from 'date-fns/isSameDay';
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
import { isEqual } from 'date-fns';

const shiftedDates = [6, 0, 1, 2, 3, 4, 5];

const NOW = new Date();
const START_OF_TODAY = startOfDay(NOW);
const END_OF_TODAY = endOfDay(NOW);

interface Slot {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  day: number;
}

enum SlotType {
  Contained = 'Contained',
  PreOvernight = 'PreOvernight',
  PostOvernight = 'PostOvernight',
}

export function parseTime(timeString: string) {
  const [hours, minutes] = timeString.split(':');

  let date = startOfDay(new Date());
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

function getDayOffsetFromToday(day: number) {
  return getTodayDayMonday() - day;
}

function createAutomationSlot(
  slotId: number,
  show: any,
  startDate: Date,
  endDate: Date,
) {
  /* todo */
  return {
    slotId,
    startDate,
    endDate,
    automation: true,
    show,
    duration: differenceInMinutes(endDate, startDate),
  };
}

function parseSlotDate(slot: Slot) {
  const initialDayOffset = getDayOffsetFromToday(slot.day);

  const startDate = addDays(parseTime(slot.startTime), initialDayOffset);

  let endDate = addDays(parseTime(slot.endTime), initialDayOffset);

  if (isEqual(startOfDay(endDate), endDate)) {
    endDate = endOfDay(endDate);
  }

  if (isBefore(endDate, startDate)) {
    endDate = addDays(endDate, 1);
  }

  return { startDate, endDate };
}

function prepareSlots(slots: Array<Slot>) {
  const sortedSlots: Array<Slot> = slots.map((slot) => {
    const { startDate, endDate } = parseSlotDate(slot);
    return {
      ...slot,
      startDate,
      endDate,
    };
  });

  // sort the slots by day and start time
  sortedSlots.sort((a: Slot, b: Slot) => {
    return isBefore(a.startDate, b.startDate) ? -1 : 1;
  });

  return sortedSlots;
}

export function chunkSlotsByDay(
  slotsUnsorted: Array<Slot>,
  automationShow: Slot,
) {
  const sortedSlots = prepareSlots(slotsUnsorted);

  const days: Array<Array<any>> = [[], [], [], [], [], [], []];
  let slotId = 0;
  let currentDate = START_OF_TODAY;
  let currentDay = -0;

  sortedSlots.forEach((slot) => {
    // if slot is first of a new day, set the time to midnight
    if (currentDay !== slot.day) {
      currentDate = startOfDay(slot.startDate);
      currentDay = slot.day;
    }

    // add automation show if there is a gap before this show
    if (
      getHours(currentDate) !== getHours(slot.startDate) ||
      getMinutes(currentDate) !== getMinutes(slot.startDate)
    ) {
      days[slot.day].push(
        createAutomationSlot(
          slotId++,
          automationShow,
          currentDate,
          slot.startDate,
        ),
      );
      currentDate = slot.startDate;
    }

    // add this slot
    // if is overnight
    if (
      !isSameDay(slot.endDate, slot.startDate) &&
      getHours(slot.endDate) !== 0 &&
      getMinutes(slot.endDate) !== 0
    ) {
      const diffMins = differenceInMinutes(
        endOfDay(slot.startDate),
        slot.startDate,
      );

      days[slot.day].push(
        Object.assign({}, slot, {
          slotId: slotId++,
          duration: diffMins,
          type: SlotType.PreOvernight,
        }),
      );

      if (slot.day !== 6) {
        const postMins = differenceInMinutes(
          startOfDay(slot.endDate),
          slot.startDate,
        );
        days[slot.day + 1].push(
          Object.assign({}, slot, {
            startDate: startOfDay(slot.endDate),
            slotId: slotId++,
            duration: postMins,
            type: SlotType.PostOvernight,
          }),
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
  days.forEach((daySlots) => {
    // create a day length auto-slot if there is nothing on that day
    if (daySlots.length <= 0) {
      daySlots.push(
        createAutomationSlot(slotId++, automationShow, startDay, endDay),
      );
      return;
    }

    // if the last slot isn't overnight and doesn't end at midnight; add auto-slot to midnight
    const lastSlotOfDay = daySlots[daySlots.length - 1];

    if (
      !isEqual(lastSlotOfDay.endDate, endOfDay(lastSlotOfDay.endDate)) &&
      isBefore(lastSlotOfDay.startDate, lastSlotOfDay.endDate)
    ) {
      daySlots.push(
        createAutomationSlot(
          slotId++,
          automationShow,
          lastSlotOfDay.endDate,
          endOfDay(lastSlotOfDay.endDate),
        ),
      );
    }
  });

  // ✨ Sunday wrap around ✨
  const lastSundaySlot = days[6][days[6].length - 1];
  if (
    !isSameDay(lastSundaySlot.startDate, lastSundaySlot.endDate) &&
    !isEqual(
      lastSundaySlot.endDate,
      startOfDay(addDays(lastSundaySlot.startDate, 1)),
    )
  ) {
    const mondaySlot = { ...lastSundaySlot };
    const endOfSunday = startOfDay(addDays(lastSundaySlot.startDate, 1));
    const durationDuringSunday = differenceInMinutes(
      endOfSunday,
      lastSundaySlot.startDate,
    );
    const durationDuringMonday = lastSundaySlot.duration - durationDuringSunday;
    lastSundaySlot.duration = durationDuringSunday;
    mondaySlot.duration = durationDuringMonday;
    days[0][0].duration = days[0][0].duration - mondaySlot.duration;
    days[0].unshift(mondaySlot);
  }

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

export function getOnAirSlot(slotsByDay: any) {
  // todo
  const now = new Date();
  const todaySlots = slotsByDay[shiftedDates[getDay(now)]];

  // @ts-ignore
  for (const [_index, slot] of todaySlots.entries()) {
    let endDate = slot.endDate;
    let startDate = slot.startDate;
    if (isBefore(slot.endDate, slot.startDate)) {
      if (slot.type === SlotType.PreOvernight) {
        endDate = addDays(endDate, 1);
      } else if (slot.type === SlotType.PreOvernight) {
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
