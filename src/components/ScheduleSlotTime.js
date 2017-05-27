import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import OnAirBadge from './OnAirBadge';
import { formatTime } from '../utils/schedule';
import isBefore from 'date-fns/is_before';

function ScheduleSlotTime(props) {
  const { slot } = props;

  const isOvernight = isBefore(slot.endDate, slot.startDate);

  const fromElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation': isOvernight &&
          props.index === 0,
      })}
    >
      {formatTime(slot.startDate)}
    </span>
  );

  const toElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation': isOvernight &&
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
