import Color from 'color';
import { Show } from "./types";

export function getShowBrandTone(show: Show) {
  return Color(`#${show.brandColor}`).light() ? 'dark' : 'light';
}

export function getTone(color: string) {
  return Color(`#${color}`).light() ? 'dark' : 'light';
}
