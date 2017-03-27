import React from 'react';

const Link = (props) => {
  const click = (e) => {
    e.preventDefault();
    window.loadUrl(props.href);
  };

  return (
    <a onClick={click} href={props.href} {...props}>{props.children}</a>
  );
};

Link.propTypes = {
  href: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired,
};

export default Link;
