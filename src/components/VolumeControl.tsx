import React from 'react';

interface IProps {
  onChange(num: number): void;
  value: number;
}

function VolumeControl(props: IProps) {
  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.001"
        value={props.value}
        onChange={(e) => {
          props.onChange(parseInt(e.target.value, 10));
        }}
      />
    </div>
  );
}

export default VolumeControl;
