import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import ScheduleSlot from './ScheduleSlot';
import dateInterval from '../hoc/DateInterval';
import { getTodayDayMonday, slotIsOnAt } from '../utils/schedule';

function ScheduleDayRow(props) {
  const { shows, slots, calculateWidth } = props;

  if (slots === undefined) {
    return <div>Nothing is scheduled.</div>;
  }

  const isToday = props.day === getTodayDayMonday(props.dateInterval);

  return (
    <div className={cx('ScheduleRow', props.className)}>
      <div className="ScheduleRow__inner">
        <div className="ScheduleRow__slots">
          {slots.map((slot, index) => {
            const momentFrom = moment(slot.from_time);
            const momentTo = moment(slot.to_time);
            const fromTimeFormatted = momentFrom.format('hh:mm');
            const toTimeFormatted = momentTo.format('hh:mm');
            const timeKey = `${fromTimeFormatted}:${toTimeFormatted}`;
            const isOnAir =
              isToday &&
              slotIsOnAt(slot, props.dateInterval, index / (slots.length - 1));
            return (
              <ScheduleSlot
                key={timeKey}
                slot={slot}
                shows={shows}
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
  shows: PropTypes.object.isRequired,
};

ScheduleDayRow.defaultProps = {
  className: '',
};

export default dateInterval({ interval: 60000 }, ScheduleDayRow);
