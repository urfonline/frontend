import React from 'react';
import Imgix from 'react-imgix';

function Image(props: any) {
  const args = {
    ...props,
    src: `https://urf.imgix.net/${props.src ||
      'content/shows/covers/8d3dd720-3c00-405a-be40-9856c7c6ba8e.png'}`,
  };
  return <Imgix {...args} style={{ width: '100%', height: '100%' }} />;
}

export default Image;
