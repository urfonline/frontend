import React, { RefObject, useState } from 'react';
// import UpArrow from '../img/caret-up.svg';

interface IProps {
  onChange(streamIndex: number): void;
  schedule: any; // todo
}

interface IStreamProps {
  onClick(): void;
  stream: any;
}

function Stream({ stream, onClick }: IStreamProps) {
  return (
    <div className={`StreamSwitcher__stream StreamSwitcher__stream__${stream.offline ? "offline" : "online"}`}
         onClick={onClick}>
      <div className="StreamSwitcher__stream__title">{stream.name}</div>
      <div className="StreamSwitcher__stream__meta">{stream.icyDescription || "📻  Automation"}</div>
    </div>
  )
}

function StreamSwitcher({ onChange, schedule }: IProps) {
  let switcherSelector: RefObject<HTMLDivElement> = React.createRef();
  let [isOpen, setOpen] = useState(false);

  return (
    <div className="Player__streams Player__section">
      <div className="StreamSwitcher__selector" ref={switcherSelector} onClick={() => setOpen(!isOpen)}>
        {schedule.stream.name}
      </div>
      <div className="StreamSwitcher__options" hidden={!isOpen}>
        {schedule.data.streams.map((stream: any, i: number) =>
          <Stream stream={stream} key={stream.id} onClick={() => {
            onChange(i);
            setOpen(false);
          }}/>
        )}
      </div>
    </div>
  );
}

export default StreamSwitcher;
