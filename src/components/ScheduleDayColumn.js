import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function ScheduleDayColumn(props) {
  return (
    <div className={cx('ScheduleDayColumn', props.className)}>
      {props.days.map(day => (
        <div className="ScheduleDayColumn__day" key={day}>
          {day}
        </div>
      ))}
    </div>
  );
}

ScheduleDayColumn.propTypes = {
  days: PropTypes.array.isRequired,
  className: PropTypes.string,
};

ScheduleDayColumn.defaultProps = {
  className: '',
};

export default ScheduleDayColumn;
