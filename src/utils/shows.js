import Color from 'color';

export function getShowBrandTone(show) {
  return Color(`#${show.brandColor}`).light() ? 'dark' : 'light';
}
