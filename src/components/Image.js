import React from 'react';
import Imgix from 'react-imgix';

function Image(props) {
  const args = { ...props, src: `https://urf.imgix.net/${props.src}` };
  return <Imgix {...args} />;
}

export default Image;
