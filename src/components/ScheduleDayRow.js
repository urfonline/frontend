import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import dateFormat from 'date-fns/format';
import ScheduleSlot from './ScheduleSlot';
import dateInterval from '../hoc/DateInterval';
import { getTodayDayMonday, slotIsOnAt } from '../utils/schedule';

function ScheduleDayRow(props) {
  const { slots, calculateWidth } = props;

  if (slots === undefined) {
    return <div>Nothing is scheduled.</div>;
  }

  const isToday = props.day === getTodayDayMonday(props.dateInterval);

  return (
    <div className={cx('ScheduleRow', props.className)}>
      <div className="ScheduleRow__inner">
        <div className="ScheduleRow__slots">
          {slots.map((slot, index) => {
            const timeKey = `${dateFormat(slot.startDate, 'hh:mm')}:${dateFormat(slot.endDate, 'hh:mm')}`;
            const isOnAir =
              isToday &&
              slotIsOnAt(slot, props.dateInterval, index / (slots.length - 1));
            return (
              <ScheduleSlot
                key={timeKey}
                slot={slot}
                index={index}
                onAir={isOnAir}
                calculateWidth={calculateWidth}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

ScheduleDayRow.propTypes = {
  dateInterval: PropTypes.object.isRequired,
  calculateWidth: PropTypes.func.isRequired,
  day: PropTypes.number.isRequired,
  className: PropTypes.string,
  slots: PropTypes.array.isRequired,
};

ScheduleDayRow.defaultProps = {
  className: '',
};

export default dateInterval({ interval: 60000 }, ScheduleDayRow);
