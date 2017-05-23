import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import ScheduleDayColumn from './ScheduleDayColumn';
import Spinner from './Spinner';
import {
  calculateWidth,
  getOnAirSlot,
  getTodayDayMonday,
  getScrollPositionForSlot,
  chunkSlotsByDay,
} from '../utils/schedule';

class FullSchedule extends React.Component {
  componentDidUpdate() {
    const container = this.containerRef;

    if (container && container.scrollLeft === 0) {
      const onAirSlot = getOnAirSlot(this.props.schedule.data.slots);
      const slotStartedToday = onAirSlot.day === getTodayDayMonday();

      if (onAirSlot.is_overnight && !slotStartedToday) {
        container.scrollLeft = 0;
        return;
      }

      const onAirPosition = getScrollPositionForSlot(onAirSlot) - 40;
      if (onAirPosition > 0) {
        container.scrollLeft = onAirPosition;
      }
    }
  }

  render() {
    if (this.props.schedule.loading) {
      return <Spinner />;
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    const slotsByDay = chunkSlotsByDay(
      this.props.schedule.allSlots,
      this.props.schedule.automationShow
    );

    return (
      <div className="Schedule">
        <ScheduleDayColumn className="Schedule__days" days={days} />
        <div
          className="Schedule__scroll-container"
          ref={ref => {
            this.containerRef = ref;
          }}
        >
          <div className="Schedule__scroll">
            <ScheduleTimeline calculateWidth={calculateWidth} />
            {days.map((day, index) => (
              <div className="Schedule__day-row" key={day}>
                <ScheduleDayRow
                  title={day}
                  day={index}
                  slots={slotsByDay[index]}
                  calculateWidth={calculateWidth}
                />
              </div>
            ))}
            <ScheduleTimeline calculateWidth={calculateWidth} />
          </div>
        </div>
      </div>
    );
  }
}

FullSchedule.propTypes = {
  schedule: PropTypes.object.isRequired,
};

export default FullSchedule;
