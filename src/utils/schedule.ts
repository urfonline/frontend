import dayjs from 'dayjs';
import { BaseSlot, ChunkedSlot, ISlateWeek, ISlotList, ResolvedStream, Show, Slot, SlotType, Stream } from './types';
import { API_HOST } from '../config';

const STUDIO_TIMEZONE = 'Europe/London';

export class SlateWeek implements ISlateWeek {
  days: Array<ISlotList>;

  constructor(days: Array<ISlotList>) {
    this.days = days;
  }

  get monday() { return this.days[0]; }
  get tuesday() { return this.days[1]; }
  get wednesday() { return this.days[2]; }
  get thursday() { return this.days[3]; }
  get friday() { return this.days[4]; }
  get saturday() { return this.days[5]; }
  get sunday() { return this.days[6]; }
}

export function parseTime(timeString: string) {
  return dayjs.at(STUDIO_TIMEZONE, timeString, "HH:mm");
}

export function formatTime(date: dayjs.Dayjs) {
  if (date.minute() === 0) {
    return date.format('ha');
  }
  return date.format('h:mma');
}

function sortIndexOf(startDate: dayjs.Dayjs) {
  return (startDate.hour() * 60) + startDate.minute()
}

/**
 * Find the difference in minutes between two times.
 * If there is a difference between the UTC offsets of the two times (e.g. DST
 * happened between them) then adjust the difference to compensate.
 * @param a First time
 * @param b Second time
 */
function fixedZoneDiff(a: dayjs.Dayjs, b: dayjs.Dayjs) {
  let duration = a.diff(b, 'minute');

  // DAYLIGHT SAVINGS!
  if (a.utcOffset() != b.utcOffset()) {
    duration += a.utcOffset() - b.utcOffset();
  }

  return duration;
}

function createAutomationSlot(
  slotId: string,
  show: any,
  day: number,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
): ChunkedSlot {
  let duration = fixedZoneDiff(endDate, startDate);
  if (duration > 60 * 24) {
    console.warn(`very long slot generated: ${duration}m`,
      startDate.format("DD-HH:mm"),
      endDate.format("DD-HH:mm"));
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
    duration: fixedZoneDiff(endDate, startDate),
  };
}

/**
 * Upgrade a naive BaseSlot (slot as received from the API) into a Slot, which
 * has locale-aware dates attached, along with the day and sort index.
 * @param slot Basic slot to upgrade
 */
function upgradeSlot(slot: BaseSlot): Slot {
  let now = getZonedNow();
  let startDate = dayjs.atTimeOnDay(STUDIO_TIMEZONE, slot.day, slot.startTime);
  let endDate = dayjs.atTimeOnDay(STUDIO_TIMEZONE, slot.day, slot.endTime);
  let sortIndex = sortIndexOf(startDate);

  // wrap around midnight
  if (endDate.isBefore(startDate)) {
    // sunday-monday wraparound
    if (startDate.weekday() == 6 && endDate.weekday() == 0) {
      // do nothing. it seems easier to read this way
    } else {
      endDate = endDate.add(1, 'day');
    }
  }

  startDate = startDate.week(now.week());
  endDate = endDate.week(now.week());

  return { ...slot, startDate, endDate, sortIndex, day: startDate.weekday() };
}

/**
 * In some cases, slots might wrap-around the "midnight" marker, which is
 * a physical linebreak in our site layout. In order for that to work, we
 * need to split those slots up into two parts - one for pre-midnight, and
 * one for post-midnight. This function does just that - if the slot crosses
 * midnight, we return two slots, broken up at the midnight line. The start
 * and end date is the same for both chunked slots, but their duration is
 * reduced to only occupy one part, for when we eventually convert the duration
 * to width.
 *
 * The returned ChunkedSlot(s) have duration and type properties, which is
 * missing from the input Slot.
 *
 * @param slot Basic Slot to convert into chunked slot(s).
 * @returns Either a ChunkedSlot or an Array of ChunkedSlots.
 */
function slotToParts(slot: Slot): ChunkedSlot | ReadonlyArray<ChunkedSlot> {
  let duration = fixedZoneDiff(slot.endDate, slot.startDate);

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
    let firstDuration = fixedZoneDiff(firstEnd, slot.startDate) + 1;
    let secondStart = slot.endDate.startOf('day');
    let secondDuration = fixedZoneDiff(slot.endDate, secondStart);

    if (secondDuration == 0) {
      // Slot ended at midnight, let's treat it regularly
      // Use firstDuration in case the slot keeps going over several days
      return {
        ...slot,
        duration: firstDuration,
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

/**
 * Take an array of Slots (which have been placed into the local timezone via upgradeSlot)
 * and chunk them into a possibly-sparse Array, with each index 0-7 corresponding
 * to each weekday, monday-sunday.
 *
 * @param allSlots Slots to chunk into day groups.
 * @param automationShow Show to use as the automation show.
 * @returns SlateWeek A week's worth of slots; 2D array of chunked slots
 */
function chunkAllSlotsByDay(allSlots: Array<Slot>, automationShow: Show) {
  let autoId = 1;

  let unchunked = allSlots.sort((a, b) =>
    a.startDate.diff(b.startDate, 'minute')
  ).flatMap<ChunkedSlot>((slot, i, arr) => {
    let nextSlot = arr[i + 1];

    if (!nextSlot) {
      if (arr[0].startDate.isSame(slot.endDate, 'minute')) {
        // Slots are directly touching already, don't do wraparound
        nextSlot = arr[0];
      } else {
        nextSlot = sundayWrap(arr[0]);
      }
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

  let sortedChunks = groupBy(unchunked, slot => slot.day)
    .map(dayMap => (
      { slots: dayMap.sort((a, b) => a.sortIndex - b.sortIndex) }
    ));

  return new SlateWeek(sortedChunks);
}

export function chunkSlotsByDay(allSlots: Array<BaseSlot>, automationShow: Show) {
  return chunkAllSlotsByDay(allSlots.map(upgradeSlot), automationShow);
}

export function filterSlotsByWeek(allSlots: Array<BaseSlot>, week: number): Array<BaseSlot> {
  return allSlots.filter((slot) => !slot.week || slot.week == week)
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

/**
 * Get the local zone-aware time
 */
export function getZonedNow(): dayjs.Dayjs {
  return dayjs();
}

export function getZonedToday() {
  return getZonedNow().weekday();
}

export function getOnAirSlot(slateWeek: SlateWeek): ChunkedSlot | undefined {
  if (slateWeek === null) return;

  const now = getZonedNow();
  const today = slateWeek.days[now.weekday()];

  if (!today) return;
  const todaySlots = today.slots;

  const fastSlot = todaySlots.find(slot => slot &&
    now.isBetween(slot.startDate, slot.endDate, 'minute', '[)'));
  if (fastSlot !== undefined) {
    return fastSlot;
  }

  // try again a week in the future
  // when a slot wraps around sunday, the PostOvernight slot gets pushed into next week,
  // which means we wouldn't pick it up usually - this fixes that.
  return todaySlots.find(slot => slot &&
    now.add(1, 'week').isBetween(slot.startDate, slot.endDate, 'minute', '[)'));
}

export function getScrollPositionForNow(): number {
  const now = getZonedNow();
  const duration = fixedZoneDiff(now, now.startOf('day'));

  return calculateWidth(duration);
}

interface StreamStatus {
  stream: Stream,
  asleep: boolean;
  offline: boolean;
  description?: string;
}

/**
 * Resolve the order of streams by querying their Icecast proxy endpoints.
 *
 * @param streams List of stream objects to order
 * @returns Promise that resolves to a list of streams, with the highest (lowest value) priority stream first.
 */
export function resolveStreamOrder(streams: Stream[]): Promise<ResolvedStream[]> {
  return Promise.all(
    streams.map((stream): Promise<StreamStatus> => {
      let asleep = false;

      if (stream.slate != null) {
        let currentSlot = getOnAirSlot(
          chunkSlotsByDay(stream.slate.slots, stream.slate.automationShow)
        );

        asleep = currentSlot ? (currentSlot.show.id === stream.slate.automationShow.id) : true;
      }

      return fetch(`${API_HOST}/streams/${stream.slug}/status`)
        .then(res => res.json().then(data => {
            if (!res.ok) {
              throw new Error(data.error);
            }

            return data;
        })).then((data: any) => ({
          stream, asleep,
          offline: data.offline,
          description: data.description,
        })).catch(err => {
          console.log(`Stream offline: ${err}`);
          return { stream, asleep, offline: true };
        });
    })
  ).then((streamInfos) => {
    return streamInfos.sort((a, b) =>
      (a.asleep ? a.stream.priorityOffline : a.stream.priorityOnline)
      - (b.asleep ? b.stream.priorityOffline : b.stream.priorityOnline)
    ).filter((info) => !info.offline)
      .map((info) => {
        return { ...info.stream,
          bed: info.asleep,
          icyDescription: info.description,
          resolvedPriority: info.asleep
            ? info.stream.priorityOffline
            : info.stream.priorityOnline
        }
      }
    )
  }).catch((errors) => {
    console.error(errors);
    return [];
  })
}
