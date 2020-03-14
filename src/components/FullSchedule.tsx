import React from 'react';
import { connect } from 'react-redux';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import ScheduleDayColumn from './ScheduleDayColumn';
import Spinner from './Spinner';
import { calculateWidth, getScrollPositionForNow } from '../utils/schedule';
import { RootState } from '../types';
import { IScheduleState } from '../ducks/schedule';

interface IProps {
  schedule: IScheduleState;
}

class FullSchedule extends React.Component<IProps, any> {
  private containerRef: any;
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

  render() {
    const { isLoading, onAirSlot, slotsByDay } = this.props.schedule;
    if (isLoading) {
      return <Spinner />;
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="Schedule">
        <ScheduleDayColumn className="Schedule__days" days={days} />
        <div
          className="Schedule__scroll-container"
          ref={(ref) => {
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
                  onAirSlotId={!!onAirSlot ? onAirSlot.id : ''}
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

export default connect((state: RootState) => ({
  schedule: state.schedule,
}))(FullSchedule);
