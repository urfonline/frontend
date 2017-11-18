import React from 'react';

function Image(props: any) {
  return <img {...props} />;
}

const elementMap = {
  img: Image,
};

export { elementMap };
