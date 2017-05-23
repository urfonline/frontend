import React from 'react';
import PropTypes from 'prop-types';

function Player(props) {
  let content;
  if (props.isLoading) {
    content = 'Player. To be implemented!';
  } else {
    content = 'Player. To be implemented!';
  }

  // const show = props.shows[props.slot.show];

  return (
    <div className="Player">
      <div className="Container">
        {content}
        {/*<audio*/}
        {/*className="Player__audio"*/}
        {/*src="http://uk2.internet-radio.com:30764/stream"*/}
        {/*controls*/}
        {/*autoPlay*/}
        {/*/>*/}
      </div>
    </div>
  );
}

Player.propTypes = {
  isLoading: PropTypes.bool,
  shows: PropTypes.object,
  slot: PropTypes.object,
};

Player.defaultProps = {
  isLoading: true,
  shows: null,
  slot: null,
};

export default Player;
