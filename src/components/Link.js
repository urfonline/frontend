import React from 'react';
import PropTypes from 'prop-types';

const Link = props => {
  const click = e => {
    e.preventDefault();
    window.loadUrl(props.href);
  };

  return (
    <a onClick={click} href={props.href} {...props}>
      {props.children}
    </a>
  );
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Link;
