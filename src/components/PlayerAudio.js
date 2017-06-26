import React from 'react';

class PlayerAudio extends React.Component {
  componentWillUpdate(nextProps) {
    const { userState } = this.props;

    if (nextProps.userState !== userState) {
      if (nextProps.userState) {
        this.audioEl.play();
      } else {
        this.audioEl.pause();
      }
    }
  }

  render() {
    const { stream } = this.props;

    return (
      <audio
        src={
          stream === 'live'
            ? 'http://uk2.internet-radio.com:30764/stream'
            : stream
        }
        ref={ref => (this.audioEl = ref)}
      />
    );
  }
}

export default PlayerAudio;
