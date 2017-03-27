import React from 'react';

function VolumeControl(props) {
  return (
    <div>
      <input
        type="range" min="0" max="1" step="0.001" value={props.value} onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
    </div>
  );
}

VolumeControl.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.number.isRequired,
};

export default VolumeControl;
