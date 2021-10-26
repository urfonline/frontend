import dayjs from 'dayjs';

export interface Action {
  type: string;
  payload: any;
}

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

export interface Category {
  name: string;
  slug: string;
  color: string;
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
  week?: number;
  show: Show;
}

export interface Slot extends BaseSlot {
  sortIndex: number;
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
  weekFromStart: number;
  slots: Array<BaseSlot>;
}

export interface ISlotList {
  slots: Array<ChunkedSlot>;
}

export interface ISlateWeek {
  days: Array<ISlotList>;
}

export interface IResolvedSlate {
  weeks: Array<ISlateWeek>;
}

export interface Stream {
  id: string;
  slug: string;
  name: string;
  proxyUrl: string;
  priorityOnline: number;
  priorityOffline: number;
  slate?: Slate;
}

export interface ResolvedStream extends Stream {
  bed: boolean;
  icyDescription?: string;
  resolvedPriority: number;
}
