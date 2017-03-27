import React from 'react';
import { connect } from 'react-redux';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import Spinner from './Spinner';
import {
  calculateWidth,
  getOnAirSlot,
  getScrollPositionForSlot,
  getTodayDayMonday,
} from '../utils/schedule';

class TodaySchedule extends React.Component {

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

  renderSchedule() {
    const slotsByDay = this.props.schedule.chunked;
    const today = getTodayDayMonday();

    return (
      <div
        className="Schedule__scroll-container"
        ref={(ref) => {
          this.containerRef = ref;
        }}
      >
        <div className="Schedule__scroll">
          <ScheduleTimeline calculateWidth={calculateWidth} />
          <div className="Schedule__day-row">
            <ScheduleDayRow
              day={today}
              shows={this.props.schedule.data.shows}
              slots={slotsByDay[today]}
              calculateWidth={calculateWidth}
            />
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="Schedule">
        {this.props.schedule.isLoading ? <Spinner /> : this.renderSchedule()}
      </div>
    );
  }
}

TodaySchedule.propTypes = {
  schedule: React.PropTypes.object.isRequired,
};

export default connect(state => ({
  schedule: state.schedule,
}))(TodaySchedule);
