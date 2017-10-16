import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import PlayIcon from './PlayIcon';
import {compose} from "recompose";

interface IProps {
  player: any;
  onAir?: {
    show: {
      title: string;
      tone: string;
      accent: string;
    };
  };
  children?: any;
}

interface IState {
  isPlaying: boolean;
}

class InlinePlayer extends React.Component<IProps, IState> {
  public static defaultProps = {
    onAir: null,
  };

  constructor(props: IProps) {
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
      <div
        className={cx('InlinePlayer', `InlinePlayer--tone-${onAir.show.tone}`)}
        style={{ backgroundColor: onAir.show.accent }}
      >
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

export default compose(
  connect(state => ({
    player: state.player,
    onAir: state.schedule.currentlyOnAir,
  }), {}))
(InlinePlayer);
