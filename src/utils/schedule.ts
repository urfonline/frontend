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

function createAutomationSlot(
  slotId: string,
  show: any,
  day: number,
  startTime: number,
  duration: number,
): ChunkedSlot {
  let startDate = dayjs.at('Europe/London')
    .startOf('day').hour(startTime).day(day);
  let endDate = startDate.add(duration, 'hour');

  return {
    id: slotId,
    startTime: startDate.format("HH:mm"),
    endTime: endDate.format("HH:mm"),
    startDate,
    endDate,
    day,
    show,
    type: SlotType.Contained,
    duration: endDate.diff(startDate, 'minute'),
  };
}

function upgradeSlot(slot: BaseSlot): Slot {
  let startDate = parseTime(slot.startTime).day(slot.day);
  let endDate = parseTime(slot.endTime).day(slot.day);

  // wrap around midnight
  if (endDate.isBefore(startDate)) {
    endDate = endDate.add(1, 'day');
  }

  return { ...slot, startDate, endDate };
}

export function chunkSlotsByDay(allSlots: Array<BaseSlot>, automationShow: Show) {
  return newChunkSlotsByDay(allSlots.map(upgradeSlot), automationShow);
}

function newChunkSlotsByDay(allSlots: Array<Slot>, automationShow: Show) {
  const days: Array<Array<ChunkedSlot>> = [[], [], [], [], [], [], []];
  const taken: Array<Array<boolean>> = [[], [], [], [], [], [], []];

  allSlots.forEach(slot => {
    let index = slot.startDate.hour();
    let duration = slot.endDate.diff(slot.startDate, 'minute');
    let takenHours = slot.endDate.diff(slot.startDate, 'hour');

    let tracker = slot.startDate;
    for (let i = 0; i < takenHours; i++) {
      taken[tracker.day()][tracker.hour()] = true;
      tracker = tracker.add(1, 'hour');
    }

    // does slot wrap around?
    if (slot.startDate.day() !== slot.endDate.day()) {
      let firstDuration = slot.startDate
        .endOf('day')
        .diff(slot.startDate, 'minute') + 1; // bump up extra minute

      let secondStart = slot.endDate.startOf('day');
      let secondDuration = slot.endDate.diff(secondStart, 'minute');

      // first slot
      days[slot.day][index] = {
        ...slot,
        duration: firstDuration,
        type: SlotType.PreOvernight,
      };

      // add a second slot on day 2 if there is any duration left
      if (secondDuration > 0) {
        days[slot.endDate.day()][0] = {
          ...slot,
          duration: secondDuration,
          type: SlotType.PostOvernight,
        };
      }
    } else {
      // normal contained slot
      days[slot.day][index] = {
        ...slot,
        duration,
        type: SlotType.Contained,
      }
    }
  });

  // fill in automation
  for (let day = 0; day < 7; day++) {
    let start = -1;
    let duration = 0;

    for (let hour = 0; hour < 24; hour++) {
      if (!taken[day][hour]) {
        if (start < 0) {
          start = hour;
          duration = 1;
        } else {
          duration += 1;
        }
      } else if (start >= 0) {
        days[day][start] = createAutomationSlot(`auto-${day}-${hour}`,
          automationShow, day, start, duration);
        start = -1;
      }
    }

    // fill in final case
    if (!taken[day][23]) {
      days[day][23] = createAutomationSlot(`auto-${day}-23`,
        automationShow, day, 23, 1);
    }
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

export function getZonedNow(): dayjs.Dayjs {
  return dayjs.at('Europe/London')
}

export function getTodayDayMonday() {
  return getZonedNow().day();
}

export function getOnAirSlot(slotsByDay: Array<Array<ChunkedSlot>>): ChunkedSlot | null {
  if (slotsByDay === null) return null;

  const now = getZonedNow();
  const todaySlots = slotsByDay[now.day()];

  return todaySlots.find(slot => slot && now.isBetween(slot.startDate, slot.endDate)) || null;
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
