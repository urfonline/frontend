import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Image from './Image';

function Player(props) {
  let content;
  if (props.schedule.isLoading) {
    return null;
  } else {
    content = props.schedule.currentlyOnAir.show.name;
  }

  const show = props.schedule.currentlyOnAir.show;
  // const show = props.shows[props.slot.show];

  return (
    <div className="Player">
      <div className="Container">
        <div className="Player__container">
          <div className="Player__show-cover">
            <Image src={show.cover.resource} />
          </div>
          <span className="Player__show-name">{show.name}</span>
          {/*<audio*/}
          {/*className="Player__audio"*/}
          {/*src="http://uk2.internet-radio.com:30764/stream"*/}
          {/*controls*/}
          {/*autoPlay*/}
          {/*/>*/}
        </div>
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

export default connect(state => ({
  schedule: state.schedule,
}))(Player);
