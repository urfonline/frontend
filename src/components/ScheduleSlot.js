import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
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

  return (
    <div
      className={scheduleSlotClasses}
      style={{ width: props.calculateWidth(slot.duration) }}
    >
      <Link
        className="ScheduleSlot__inner"
        style={{ backgroundColor: `#${show.brandColor}` }}
        to={`/shows/${show.slug}`}
      >
        <ScheduleSlotTime slot={slot} onAir={props.onAir} index={props.index} />
        <div className="ScheduleSlot__title">
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
