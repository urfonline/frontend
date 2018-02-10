import React from 'react';
import { connect } from 'react-redux';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import Spinner from './Spinner';
import {
  calculateWidth,
  getScrollPositionForNow,
  getTodayDayMonday,
} from '../utils/schedule';
import { RootState } from '../types';

interface IProps {
  schedule: any; // todo
}

class TodaySchedule extends React.Component<IProps> {
  private containerRef: any;

  constructor(props: IProps) {
    super(props);
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
      const onAirPosition = getScrollPositionForNow() - 75;
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
        ref={(ref) => {
          this.containerRef = ref;
        }}
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

export default connect((state: RootState) => ({
  schedule: state.schedule,
}))(TodaySchedule);
