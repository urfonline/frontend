import React from 'react';
import cx from 'classnames';
import Color from 'color';
import { Link } from 'react-router-dom';
import ScheduleSlotTime from './ScheduleSlotTime';

interface IProps {
  calculateWidth: any; // todo
  onAir: boolean;
  slot: any; // todo
  index: number;
}

function ScheduleSlot(props: IProps) {
  const slot = props.slot;
  const show = props.slot.show;
  const showColor = show && show.category ? show.category.color : 'ffffff';

  const scheduleSlotClasses = cx('ScheduleSlot', `ScheduleSlot--tone-light`, {
    'ScheduleSlot--overnight': slot.is_overnight,
    'ScheduleSlot--on-air': props.onAir,
  });

  let onAirGlow: { boxShadow?: string } = {};

  if (props.onAir) {
    let color;
    try {
      color = Color(`#${showColor}`);
    } catch(e) {
      color = Color('#ffffff');
    }

      color = color.rgb()
      .array();
    onAirGlow.boxShadow = `0 0 20px rgba(${color.join(',')}, 0.7)`;
  }

  return (
    <div
      className={scheduleSlotClasses}
      style={{ width: props.calculateWidth(slot.duration), ...onAirGlow }}
    >
      <Link
        className="ScheduleSlot__inner"
        style={{ backgroundColor: `#${showColor}` }}
        to={`/shows/${show.slug}`}
      >
        <ScheduleSlotTime slot={slot} onAir={props.onAir} index={props.index} />
        <div className="ScheduleSlot__show-name">{show.name}</div>
      </Link>
    </div>
  );
}

export default ScheduleSlot;
