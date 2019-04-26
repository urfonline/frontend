import React, { useEffect } from 'react';

const ENDPOINT = 'https://urf.imgix.net/';

export enum AspectRatio {
  r16by9 = 'r16by9',
  r20by9 = 'r20by9',
  r1by1 = 'r1by1',
  rPanovision70 = 'rPanovision70',
}

const aspectRatioMap = {
  [AspectRatio.r1by1]: 1.0,
  [AspectRatio.r16by9]: 0.5625,
  [AspectRatio.r20by9]: 0.45,
  [AspectRatio.rPanovision70]: 0.36101083,
};

type AspectRatioInput = AspectRatio | { width: number; height: number };

interface ImageOptions {
  [optionName: string]: number | string;
}

interface IProps extends React.HTMLAttributes<HTMLImageElement> {
  aspectRatio: AspectRatioInput;
  src: string;
  alt: string;
  withoutLazy?: boolean; // todo
  withoutContainer?: boolean;
  options?: ImageOptions;
  sizes?: number[];
  mediaSizes?: string;
}

function aspectMultiplier(aspectRatio: AspectRatioInput, width: number) {
  if (typeof aspectRatio === 'string') {
    return width * aspectRatioMap[aspectRatio];
  }

  return width * (aspectRatio.height / aspectRatio.width);
}

const defaultOptions = {
  auto: 'format',
  q: 80,
  fit: 'crop',
  crop: 'faces',
};

function createQueryString(obj: { [key: string]: any }) {
  return Object.entries(obj)
    .map((pair) => pair.join('='))
    .join('&');
}

function generateUrl(
  props: {
    src: string;
    aspectRatio?: AspectRatioInput;
    options?: ImageOptions;
  },
  opts: { width: number },
) {
  if (!props.aspectRatio) {
    return `${ENDPOINT}${props.src}?w=${opts.width}`;
  }
  return `${ENDPOINT}${props.src}?w=${opts.width}&h=${aspectMultiplier(
    props.aspectRatio,
    opts.width,
  )}&${createQueryString(
    props.options ? { ...defaultOptions, ...props.options } : defaultOptions,
  )}`;
}

const defaultSizes = [
  960,
  240,
  320,
  480,
  624,
  800,
  1024,
  1152,
  1248,
  1440,
  1680,
];

const OneImage: React.FC<IProps> = (props) => {
  const sizes = props.sizes || defaultSizes;

  useEffect(() => {
    // todo
    // const el = ReactDOM.findDOMNode(this as any) as HTMLDivElement;
    // if (!el) {
    //   return;
    // }
    //
    // const img = el.nodeName === 'IMG' ? el : el.querySelector('img');
    // if (img) {
    //   img.classList.toggle('lazyloaded', false);
    //   img.classList.toggle('lazyload', true);
    // }
  }, [props.src]);

  const img = (
    <img
      className={`ResponsiveImage lazyload ${props.className}`}
      src={generateUrl(props, { width: sizes[0] })}
      data-sizes={props.mediaSizes || 'auto'}
      srcSet="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
      data-srcset={sizes.map(
        (width) => `${generateUrl(props, { width })} ${width}w`,
      )}
    />
  );

  if (props.withoutContainer) {
    return img;
  }

  const containerProps =
    typeof props.aspectRatio === 'string'
      ? {
          className: `u-responsive-ratio u-responsive-ratio--${
            props.aspectRatio
          }`,
        }
      : {
          className: 'u-responsive-ratio',
          style: {
            paddingBottom: `${(props.aspectRatio.height /
              props.aspectRatio.width) *
              100}%`,
          },
        };

  return <div {...containerProps} key={props.src}>{img}</div>;
};

interface IBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: AspectRatioInput;
  src: string;
  mslResource?: boolean;
}

const OneImageBackground: React.FC<IBackgroundProps> = (props) => {
  return (
    <div
      className={`lazyload ${props.className}`}
      data-sizes="auto"
      data-bgset={defaultSizes.map(
        (width) => `${generateUrl(props, { width })} ${width}w`,
      )}
    >
      {props.children}
    </div>
  );
};

export { OneImage, OneImageBackground };
