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
  getScrollPositionForNow,
} from '../utils/schedule';

class FullSchedule extends React.Component {
  componentDidUpdate() {
    this.updateScrollPositionToNow();
  }

  componentDidMount() {
    this.updateScrollPositionToNow();
  }

  updateScrollPositionToNow() {
    const container = this.containerRef;

    if (container && container.scrollLeft === 0) {
      const onAirPosition = getScrollPositionForNow() - 40;
      if (onAirPosition > 0) {
        container.scrollLeft = onAirPosition;
      }
    }
  }

  render() {
    const { isLoading, slotsByDay, currentlyOnAir } = this.props.schedule;
    if (isLoading) {
      return <Spinner />;
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

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
                  onAirSlotId={currentlyOnAir.slotId}
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

export default connect(state => ({
  schedule: state.schedule,
}))(FullSchedule);
