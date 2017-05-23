import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from './Link';
import ScheduleSlotTime from './ScheduleSlotTime';

function ScheduleSlot(props) {
  const slot = props.slot;
  let show;
  if (slot.show) {
    show = props.shows[slot.show];
  } else {
    show = {
      title: 'Playlist',
    };
  }

  const scheduleSlotClasses = cx(
    'ScheduleSlot',
    `ScheduleSlot--tone-${show.tone === 'dark' ? 'dark' : 'light'}`,
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
        style={{ backgroundColor: show.accent }}
        href={show.page_url}
      >
        <ScheduleSlotTime slot={slot} onAir={props.onAir} index={props.index} />
        <div className="ScheduleSlot__title">
          {show.title}
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
  shows: PropTypes.object.isRequired,
};

export default ScheduleSlot;
