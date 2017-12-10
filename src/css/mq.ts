import {css} from "emotion";

interface Accumulator {
  [key: string]: any;
}

// todo: type this better

const breakpoints: { [key: string]: number | string } = {
  small: 480,
  medium: 768,
  large: 960,
  xLarge: 1100,
};

export const queries: Accumulator = Object.keys(breakpoints).reduce((accumulator: Accumulator, label) => {
  if (typeof breakpoints[label] === 'string') {
    accumulator[label] = (...args: any[]) =>
      css`
        @media (${breakpoints[label]}) {
          ${css(...args)};
        }
      `
  } else {
    accumulator[label] = (...args: any[]) =>
      css`
        @media (min-width: ${breakpoints[label]}px) {
          ${css(...args)};
        }
      `
  }

  return accumulator
}, {});
