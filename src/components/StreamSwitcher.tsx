import React from 'react';
// import UpArrow from '../img/caret-up.svg';

interface IProps {
  onChange(streamIndex: number): void;
  schedule: any; // todo
}

function StreamSwitcher({ onChange, schedule }: IProps) {
  return (
    <div className="Player__streams Player__section">
      <select className="StreamSwitcher__selector" onChange={(ev: any) => onChange(parseInt(ev.target.value))}>
        {schedule.data.streams.map((stream: any, i: number) =>
          <option value={i}>{stream.name}</option>
        )}
      </select>
      {/*<div className="Player__selector">{schedule.stream.name}</div>*/}
    </div>
  );
}

export default StreamSwitcher;
