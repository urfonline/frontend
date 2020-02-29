import React from 'react';
import cx from 'classnames';
import OnAirBadge from './OnAirBadge';
import { formatTime} from '../utils/schedule';
import { ChunkedSlot, SlotType } from '../utils/types';

interface IProps {
  slot: ChunkedSlot;
  index: number;
  onAir: boolean;
}

function ScheduleSlotTime(props: IProps) {
  const { slot } = props;

  const isOvernight = slot.type != SlotType.Contained;

  const fromElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation':
          isOvernight && props.index === 0,
      })}
    >
      {formatTime(slot.startDate)}
    </span>
  );

  const toElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation':
          isOvernight && props.index !== 0,
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

export default ScheduleSlotTime;
