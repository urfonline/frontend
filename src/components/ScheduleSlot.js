import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Color from 'color';
import { Link } from 'react-router-dom';
import ScheduleSlotTime from './ScheduleSlotTime';
import { getShowBrandTone } from '../utils/shows';

function ScheduleSlot(props) {
  const slot = props.slot;
  const show = props.slot.show;

  const scheduleSlotClasses = cx(
    'ScheduleSlot',
    `ScheduleSlot--tone-${getShowBrandTone(show)}`,
    {
      'ScheduleSlot--overnight': slot.is_overnight,
      'ScheduleSlot--on-air': props.onAir,
    }
  );

  let onAirGlow = {};

  if (props.onAir) {
    const color = Color(`#${show.brandColor}`).rgb().array();
    onAirGlow.boxShadow = `0 0 20px rgba(${color.join(',')}, 0.7)`;
  }

  return (
    <div
      className={scheduleSlotClasses}
      style={{ width: props.calculateWidth(slot.duration), ...onAirGlow }}
    >
      <Link
        className="ScheduleSlot__inner"
        style={{ backgroundColor: `#${show.brandColor}` }}
        to={`/shows/${show.slug}`}
      >
        <ScheduleSlotTime slot={slot} onAir={props.onAir} index={props.index} />
        <div className="ScheduleSlot__show-name">
          {show.name}
        </div>
      </Link>
    </div>
  );
}

ScheduleSlot.propTypes = {
  calculateWidth: PropTypes.func.isRequired,
  onAir: PropTypes.bool.isRequired,
  slot: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default ScheduleSlot;
