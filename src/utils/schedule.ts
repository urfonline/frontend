import dayjs from 'dayjs';
import { BaseSlot, ChunkedSlot, Show, Slot, SlotType } from './types';
import { API_HOST } from '../config';

export function parseTime(timeString: string) {
  return dayjs.at('Europe/London', timeString, "HH:mm");
}

export function formatTime(date: dayjs.Dayjs) {
  if (date.minute() === 0) {
    return date.format('ha');
  }
  return date.format('h:mma');
}

function sortIndexOf(startDate: dayjs.Dayjs) {
  return (startDate.weekday() * 24 * 60) + (startDate.hour() * 60) + startDate.minute()
}

function createAutomationSlot(
  slotId: string,
  show: any,
  day: number,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
): ChunkedSlot {
  let duration = endDate.diff(startDate, 'minute');
  if (duration > 60 * 24) {
    console.warn(`very long slot generated: ${duration}m`, startDate.format("DD-HH:mm"), endDate.format("DD-HH:mm"));
  }

  return {
    id: slotId,
    startTime: startDate.format("HH:mm"),
    endTime: endDate.format("HH:mm"),
    startDate,
    endDate,
    sortIndex: sortIndexOf(startDate),
    day,
    show,
    type: SlotType.Contained,
    duration: endDate.diff(startDate, 'minute'),
  };
}

function upgradeSlot(slot: BaseSlot): Slot {
  let now = getZonedNow();
  let startDate = dayjs.atTimeOnDay('Europe/London', slot.day, slot.startTime).week(now.week());
  let endDate = dayjs.atTimeOnDay('Europe/London', slot.day, slot.endTime).week(now.week());
  let sortIndex = sortIndexOf(startDate);

  // wrap around midnight
  if (endDate.isBefore(startDate)) {
    // sunday-monday wraparound
    if (startDate.weekday() == 6 && endDate.weekday() == 0) {
      // endDate = endDate.subtract(7, 'day');
    } else {
      endDate = endDate.add(1, 'day');
    }
  }

  return { ...slot, startDate, endDate, sortIndex, day: startDate.weekday() };
}

export function chunkSlotsByDay(allSlots: Array<BaseSlot>, automationShow: Show) {
  return newChunkSlotsByDay(allSlots.map(upgradeSlot), automationShow);
}

function slotToParts(slot: Slot): ChunkedSlot | ReadonlyArray<ChunkedSlot> {
  let duration = slot.endDate.diff(slot.startDate, 'minute');

  if (slot.startDate.weekday() === slot.endDate.weekday()) {
    // Normal slot.

    return {
      ...slot,
      duration,
      type: SlotType.Contained,
    }
  } else {
    // Wrap-around slot
    let firstEnd = slot.startDate.endOf('day');
    let firstDuration = firstEnd.diff(slot.startDate, 'minute') + 1;
    let secondStart = slot.endDate.startOf('day');
    let secondDuration = slot.endDate.diff(secondStart, 'minute');

    if (secondDuration == 0) {
      // Slot ended at midnight, let's treat it regularly
      return {
        ...slot,
        duration,
        type: SlotType.Contained,
      }
    }

    // the wild wild west
    return [{
      ...slot,
      day: slot.startDate.weekday(),
      duration: firstDuration,
      type: SlotType.PreOvernight,
    }, {
      ...slot,
      id: `${slot.id}-post`,
      day: secondStart.weekday(),
      sortIndex: sortIndexOf(secondStart),
      duration: secondDuration,
      type: SlotType.PostOvernight,
    }];
  }
}

// @ts-ignore
function sundayWrap(slot: Slot): Slot {
  return {
    ...slot,
    startDate: slot.startDate.add(7, 'day'),
    endDate: slot.endDate.add(7, 'day'),
  }
}

function groupBy<T>(list: Array<T>, keyfunc: (el: T) => number) {
  let result: Array<Array<T>> = [];

  list.forEach(el => {
    let key = keyfunc(el);
    if (!result[key]) result[key] = [];

    result[key].push(el);
  });

  return result;
}

function newChunkSlotsByDay(allSlots: Array<Slot>, automationShow: Show) {
  let autoId = 1;

  let unchunked = allSlots.sort((a, b) =>
    a.startDate.diff(b.startDate, 'minute')
  ).flatMap<ChunkedSlot>((slot, i, arr) => {
    let nextSlot = arr[i + 1];

    if (!nextSlot) {
      nextSlot = sundayWrap(arr[0]);
      // nextSlot = arr[0];

      // Sunday wraparound is difficult! We use `isBefore` here, which mostly works except for the wraparound,
      // because endDate is Sunday while startDate is all the way back at Monday.
      // We tried to fix this using `sundayWrap`, which overrode the next slot's date *for this comparison*
      // (but didn't use it for any subsequent operations), however if a slot gets split across the wraparound
      // (because of, say, a +9:30 timezone) then this would generate a week-long slot because of the difference.
      // TODO: More special handling for the wraparound.
    }

    if (slot.endDate.isBefore(nextSlot.startDate, 'minute')) {
      // just fill the hole, hole filler
      return [
        slotToParts(slot),
        slotToParts(
          createAutomationSlot(`auto-${autoId++}`, automationShow,
            slot.endDate.weekday(), slot.endDate, nextSlot.startDate)
        )
      ].flat(1)
    }

    return slotToParts(slot);
  });

  return groupBy(unchunked, slot => slot.day)
    .map(dayMap =>
      dayMap.sort((a, b) =>
        a.sortIndex - b.sortIndex
      )
    );
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

export function getZonedNow(): dayjs.Dayjs {
  return dayjs.at('Europe/London')
}

export function getTodayDayMonday() {
  return getZonedNow().weekday();
}

export function getOnAirSlot(slotsByDay: Array<Array<ChunkedSlot>>): ChunkedSlot | undefined {
  if (slotsByDay === null) return;

  const now = getZonedNow();
  const todaySlots = slotsByDay[now.weekday()];

  return todaySlots.find(slot => slot && now.isBetween(slot.startDate, slot.endDate, 'minute', '[)'));
}

export function getScrollPositionForNow(): number {
  const now = getZonedNow();
  const duration = now.diff(now.startOf('day'), 'minute');

  return calculateWidth(duration);
}

export function resolveStreamOrder(streams: Array<any>): Promise<any> {
  return Promise.all(
    streams.map((stream: any): Promise<any> => {
      let asleep = false;

      if (stream.slate != null) {
        let currentSlot = getOnAirSlot(
          chunkSlotsByDay(stream.slate.slots, stream.slate.automationShow)
        );

        asleep = currentSlot ? (currentSlot.show.id === stream.slate.automationShow.id) : true;
      }

      return fetch(`${API_HOST}/streams/${stream.slug}/status`)
        .then((res) => res.json())
        .then((data: any) => {
          let info = data.icestats;
          let source = info.source;

          if (Array.isArray(source)) {
            source = info.source[0];
          }

          return { stream,
            bed: asleep,
            offline: source == null,
            description: (source ? source.server_description : null)
          };
        })
        .catch(() => {
          return { stream, offline: true }
        })
    })
  ).then((streamInfos: Array<any>) => {
    return streamInfos.sort((a: any, b: any) =>
      (a.bed ? a.stream.priorityOffline : a.stream.priorityOnline)
      - (b.bed ? b.stream.priorityOffline : b.stream.priorityOnline)
    ).filter((info: any) => !info.offline)
      .map((info: any) => {
        return { ...info.stream,
          bed: info.bed,
          icyDescription: info.description,
          resolvedPriority: info.bed
            ? info.stream.priorityOffline
            : info.stream.priorityOnline
        }
      }
    )
  }).catch((errors) => {
    console.error(errors);
  })
}
