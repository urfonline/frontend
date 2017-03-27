import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import PlayIcon from './PlayIcon';

class InlinePlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: true,
    };
  }

  render() {
    const { player, onAir } = this.props;

    if (!player.stream || !onAir) {
      return null;
    }

    return (
      <div className={cx('InlinePlayer', `InlinePlayer--tone-${onAir.show.tone}`)} style={{ backgroundColor: onAir.show.accent }}>
        <div className="Container">
          <div className="InlinePlayer__play">
            <PlayIcon tone={onAir.show.tone} /> Live
          </div>
          {onAir.show.title}
        </div>
      </div>
    );
  }
}

InlinePlayer.propTypes = {
  player: React.PropTypes.object.isRequired,
  onAir: React.PropTypes.object,
};

InlinePlayer.defaultProps = {
  onAir: null,
};

export default connect(state => ({
  player: state.player,
  onAir: state.schedule.currentlyOnAir,
}))(InlinePlayer);
