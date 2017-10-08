import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import Spinner from './Spinner';
import {
  calculateWidth,
  getScrollPositionForNow,
  getTodayDayMonday,
} from '../utils/schedule';

class TodaySchedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false,
    };

    this.handleDragStart = () => this.setState({ isDragging: true });
    this.handleDragStop = () => this.setState({ isDragging: false });
    this.handleMouseMove = event => {
      if (!this.state.isDragging) {
        return;
      }

      console.log(event);
    };
  }

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

  renderSchedule() {
    const slotsByDay = this.props.schedule.slotsByDay;
    const today = getTodayDayMonday();

    return (
      <div
        className="Schedule__scroll-container"
        ref={ref => {
          this.containerRef = ref;
        }}
        onMouseDown={this.handleDragStart}
        onMouseUp={this.handleDragStop}
        onMouseMove={this.handleMouseMove}
      >
        <div className="Schedule__scroll">
          <ScheduleTimeline calculateWidth={calculateWidth} />
          <div className="Schedule__day-row">
            <ScheduleDayRow
              day={today}
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
  schedule: PropTypes.object.isRequired,
};

export default connect(state => ({
  schedule: state.schedule,
}))(TodaySchedule);
