import dayjs from 'dayjs';

export interface Show {
  id: number;
  name: string;
  category: {
    name: string;
    color: string;
  };
  brandColor: string;
  shortDescription: string;
  slug: string;
  emojiDescription: string;
}

export enum Tone {
  Dark = 'dark',
  Light = 'light',
}

export interface BaseSlot {
  id: string;
  startTime: string;
  endTime: string;
  day: number;
  show: Show;
}

export interface Slot extends BaseSlot {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

export enum SlotType {
  Contained = 'Contained',
  PreOvernight = 'PreOvernight',
  PostOvernight = 'PostOvernight',
}

export interface ChunkedSlot extends Slot {
  duration: number;
  type: SlotType;
}
