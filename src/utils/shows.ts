import Color from 'color';
import { Show } from './types';

export function getShowBrandTone(show: Show) {
  return Color(`#${show.brandColor}`).isLight() ? 'dark' : 'light';
}

export function getTone(color: string) {
  return Color(`#${color}`).isLight() ? 'dark' : 'light';
}

export const defaultShowCoverResource  = 'content/shows/covers/8d3dd720-3c00-405a-be40-9856c7c6ba8e.png';
