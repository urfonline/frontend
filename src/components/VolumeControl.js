import React from 'react';
import PropTypes from 'prop-types';

function VolumeControl(props) {
  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.001"
        value={props.value}
        onChange={e => {
          props.onChange(e.target.value);
        }}
      />
    </div>
  );
}

VolumeControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default VolumeControl;
