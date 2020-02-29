import dayjs from 'dayjs';

interface EmbeddedImage {
  width: number;
  height: number;
  resource: string;
}

export interface Show {
  id: number;
  name: string;
  category: {
    name: string;
    color: string;
  };
  brandColor: string;
  shortDescription: string;
  longDescription: string;
  slug: string;
  emojiDescription: string;
  createdAt: string;
  slots?: Array<BaseSlot>;
  cover: EmbeddedImage;
  socialMixcloudHandle?: string;
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

export interface Slate {
  id?: string;
  name?: string;
  automationShow: Show;
  slots: Array<BaseSlot>;
}

export interface Stream {
  id: string;
  slug: string;
  name: string;
  host: string;
  port: number;
  mountpoint: string;
  priorityOnline: number;
  priorityOffline: number;
  slate?: Slate;
}
