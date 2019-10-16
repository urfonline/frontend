import React, { useEffect, useState } from 'react';
import UpArrow from '../img/caret-up.svg';
import { resolveStreamOrder } from '../utils/schedule';
import { IScheduleState, streamsResolved, switchStreams } from '../ducks/schedule';
import { connect } from 'react-redux';
import { RootState } from '../types';

interface IProps {
  onChange(streamIndex: number): void;
  schedule: IScheduleState;
}

interface IStreamProps {
  onClick(): void;
  stream: any;
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

function StreamSwitcher({ onChange, schedule }: IProps) {
  let [isOpen, setOpen] = useState(false);

  return (
    <div className="Player__streams Player__section">
      <div className="StreamSwitcher__selector" onClick={() => setOpen(!isOpen)}>
        <UpArrow className="StreamSwitcher__selector__indicator" style={{
          transform: (isOpen ? "rotateX(180deg)": "")
        }} />
        {schedule.stream.name}
      </div>
      <div className={`StreamSwitcher__options StreamSwitcher__options__${isOpen ? "open": "closed"}`}>
        {schedule.onlineStreams.map((stream: any, i: number) =>
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
  schedule: IScheduleState;
  dispatch: any;
}

function LoadableStreamSwitcher({ schedule, dispatch }: IConnectProps) {
  useEffect(() => {
    resolveStreamOrder(schedule.allStreams)
      .then((onlineStreams: Array<any>) =>
        dispatch(streamsResolved(onlineStreams))
      )
      .then(() =>
        dispatch(switchStreams(0))
      )
  }, [schedule.allStreams]);

  if (!schedule.streamsResolved) {
    return <div className="Player__streams Player__section">
      <div className="StreamSwitcher__selector">Loading...</div>
    </div>
  }

  return <StreamSwitcher
    onChange={streamIndex => dispatch(switchStreams(streamIndex))}
    schedule={schedule}
  />
}

export default connect(
  (state: RootState) => ({ schedule: state.schedule }),
)(LoadableStreamSwitcher);
