import React from 'react';

interface IProps {
  stream: string;
  userState: any; // todo
  onChange: any;
}

interface IState {
  cacheKey: number;
}

class PlayerAudio extends React.Component<IProps, IState> {
  private audioEl: any;

  constructor(props: IProps) {
    super(props);

    this.state = {
      cacheKey: Math.random(),
    };
  }

  componentWillUpdate(nextProps: IProps) {
    const { userState } = this.props;

    if (nextProps.userState !== userState) {
      if (nextProps.userState) {
        this.audioEl.play();
      } else {
        this.audioEl.pause();
        this.setState({ cacheKey: Math.random() });
      }
    }
  }

  componentDidMount() {
    function handleEvent(...args: any[]) {
      console.log(args);
    }

    this.audioEl.addEventListener('stalled', handleEvent);
    this.audioEl.addEventListener('ended', handleEvent);
    this.audioEl.addEventListener('error', handleEvent);
    this.audioEl.addEventListener('loadstart', handleEvent);
    this.audioEl.addEventListener('playing', handleEvent);
    this.audioEl.addEventListener('progress', handleEvent);
    this.audioEl.addEventListener('stalled', handleEvent);
    this.audioEl.addEventListener('suspend', handleEvent);
    this.audioEl.addEventListener('waiting', handleEvent);
  }

  render() {
    const { stream } = this.props;

    return (
      <audio
        src={
          stream === 'live'
            ? `http://uk2.internet-radio.com:30764/stream?nocache=${
                this.state.cacheKey
              }`
            : stream
        }
        ref={ref => (this.audioEl = ref)}
      />
    );
  }
}

export default PlayerAudio;
