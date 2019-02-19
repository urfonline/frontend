import React from 'react';
import cx from 'classnames';

interface IProps {
  days: Array<string>;
  className?: string;
}

const ScheduleDayColumn: React.FC<IProps> = (props: IProps) => {
  return (
    <div className={cx('ScheduleDayColumn', props.className)}>
      {props.days.map((day) => (
        <div className="ScheduleDayColumn__day" key={day}>
          {day}
        </div>
      ))}
    </div>
  );
};

ScheduleDayColumn.defaultProps = {
  className: '',
};

export default ScheduleDayColumn;
