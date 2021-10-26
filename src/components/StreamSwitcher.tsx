import React, { useEffect, useState } from 'react';
import UpArrow from '../img/caret-up.svg';
import { resolveStreamOrder } from '../utils/schedule';
import { IStreamState, streamsResolved, switchStreams } from '../ducks/streams';
import { connect } from 'react-redux';
import { RootState } from '../types';
import { ResolvedStream } from '../utils/types';

interface IProps {
  onChange(streamIndex: number): void;
  streams: IStreamState;
}

interface IStreamProps {
  onClick(): void;
  stream: ResolvedStream;
}

function Stream({ stream, onClick }: IStreamProps) {
  return (
    <div className={`StreamSwitcher__stream StreamSwitcher__stream__${stream.bed ? "offline" : "online"}`}
         onClick={onClick}>
      <div className="StreamSwitcher__stream__title">{stream.name}</div>
      <div className="StreamSwitcher__stream__meta">&#128251; {stream.icyDescription || "Unknown"}</div>
    </div>
  )
}

function StreamSwitcher({ onChange, streams }: IProps) {
  let [isOpen, setOpen] = useState(false);

  return (
    <div className="Player__streams Player__section">
      <div className="StreamSwitcher__selector" onClick={() => setOpen(!isOpen)}>
        <UpArrow className="StreamSwitcher__selector__indicator" style={{
          transform: (isOpen ? "rotateX(180deg)": "")
        }} />
        {streams.stream ? streams.stream.name : 'Loading...'}
      </div>
      <div className={`StreamSwitcher__options StreamSwitcher__options__${isOpen ? "open": "closed"}`}>
        {streams.onlineStreams.map((stream, i: number) =>
          <Stream stream={stream} key={stream.id} onClick={() => {
            onChange(i);
            setOpen(false);
          }}/>
        )}
      </div>
    </div>
  );
}

interface IConnectProps {
  streams: IStreamState;
  dispatch: any;
}

function LoadableStreamSwitcher({ streams, dispatch }: IConnectProps) {
  useEffect(() => {
    resolveStreamOrder(streams.allStreams)
      .then((onlineStreams) =>
        dispatch(streamsResolved(onlineStreams))
      )
      .then(() =>
        dispatch(switchStreams(0))
      )
  }, [streams.allStreams]);

  if (!streams.onlineResolved) {
    return <div className="Player__streams Player__section">
      <div className="StreamSwitcher__selector">Loading...</div>
    </div>
  }

  return <StreamSwitcher
    onChange={streamIndex => dispatch(switchStreams(streamIndex))}
    streams={streams}
  />
}

export default connect(
  (state: RootState) => ({ streams: state.streams }),
)(LoadableStreamSwitcher);
