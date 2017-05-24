import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import OnAirBadge from './OnAirBadge';
import { formatTime } from '../utils/schedule';

function ScheduleSlotTime(props) {
  const { slot } = props;

  const fromElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation': slot.is_overnight &&
          props.index === 0,
      })}
    >
      {formatTime(slot.startDate)}
    </span>
  );

  const toElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation': slot.is_overnight &&
          props.index !== 0,
      })}
    >
      {formatTime(slot.endDate)}
    </span>
  );

  return (
    <div className="ScheduleSlot__time">
      {fromElement} - {toElement}
      {props.onAir ? <OnAirBadge /> : null}
    </div>
  );
}

ScheduleSlotTime.propTypes = {
  slot: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onAir: PropTypes.bool.isRequired,
};

export default ScheduleSlotTime;
