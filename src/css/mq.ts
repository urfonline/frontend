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

export const queries: Accumulator = Object.keys(breakpoints).reduce(
  (accumulator: Accumulator, label) => {
    if (typeof breakpoints[label] === 'string') {
      accumulator[label] = (...args: any[]) =>
        `
          @media (${breakpoints[label]}) {
            ${args[0]};
          }
        `;
    } else {
      accumulator[label] = (...args: any[]) =>
        `
          @media (min-width: ${breakpoints[label]}px) {
            ${args[0]};
          }
        `;
    }

    return accumulator;
  },
  {},
);
