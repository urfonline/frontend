import Color from 'color';
import {Show} from "./types";

export function getShowColourHexString(show: Show) {

  const isOk  = /^#[0-9A-F]{6}$/i.test(`#${show.brandColor}`);
  let showColour = 'B12220'; // sets a default colour just in case the colour is not valid

  if(isOk) {
    showColour = show.brandColor;
  }

  return showColour;
}

export function getShowBrandTone(show: Show) {
  return Color(`#${getShowColourHexString(show)}`).isLight() ? 'dark' : 'light';
}

export function getTone(color: string) {
  return Color(`#${color}`).isLight() ? 'dark' : 'light';
}

export const defaultShowCoverResource  = 'content/shows/covers/8d3dd720-3c00-405a-be40-9856c7c6ba8e.png';
