import React from 'react';
import PropTypes from 'prop-types';
import urfLogoWhite from '../img/logotype.svg';
import urfLogoBlack from '../img/logotype-dark.svg';

function Player(props) {
  if (props.isLoading) {
    return null;
  }

  const show = props.shows[props.slot.show];

  return (
    <div className="Player" style={{ backgroundColor: show.accent }}>
      <header>
        <img
          src={show.tone === 'dark' ? urfLogoBlack : urfLogoWhite}
          height="40"
          alt="URF"
        />
        <span>Player</span>
      </header>
      <div className="">
        {show.logo
          ? <img src={show.logo} alt={show.title} />
          : <h1>{show.title}</h1>}

        <audio
          className="Player__audio"
          src="http://uk2.internet-radio.com:30764/stream"
          controls
          autoPlay
        />
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
