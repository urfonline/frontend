import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import dateFormat from 'date-fns/format';
import OnAirBadge from './OnAirBadge';

function ScheduleSlotTime(props) {
  const { slot } = props;
  const timeFormat = 'h:mma';

  const fromElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation': slot.is_overnight &&
          props.index === 0,
      })}
    >
      {dateFormat(slot.startDate, timeFormat)}
    </span>
  );

  const toElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation': slot.is_overnight &&
          props.index !== 0,
      })}
    >
      {dateFormat(slot.endDate, timeFormat)}
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
