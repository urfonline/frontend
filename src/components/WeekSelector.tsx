import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../types';
import { switchWeek } from '../ducks/schedule';
import Arrow from '../img/arrow-right.svg';
import { getZonedNow } from '../utils/schedule';

interface IWeekProps {
  isNextWeek: boolean;
  isActive: boolean;
  switchWeek(nextWeek: boolean): void;
}

function Week({ isNextWeek, isActive, switchWeek } : IWeekProps) {
  let monday = getZonedNow().add(isNextWeek ? 1 : 0, 'week').startOf('week');

  return <div className={`WeekSelector__Week WeekSelector__Week__${isActive ? 'active' : 'inactive'}`}
              onClickCapture={() => switchWeek(isNextWeek)}>
    <h2>{isNextWeek ? "next" : "this"} week {isNextWeek && <Arrow/>}</h2>
    <span>week starting {monday.format("Do [of] MMMM")}</span>
  </div>
}

interface IProps {
  showNextWeek: boolean;
  dispatch: any;
}

function WeekSelector({ showNextWeek, dispatch }: IProps) {
  let onSwitchWeek = (nextWeek: boolean) => {
    dispatch(switchWeek(nextWeek))
  };

  return <div className="WeekSelector WeekSelector__inline">
    <Week isNextWeek={false} isActive={!showNextWeek} switchWeek={onSwitchWeek} />
    <Week isNextWeek={true} isActive={showNextWeek} switchWeek={onSwitchWeek} />
  </div>
}

export default connect(
  (state: RootState) => ({
    showNextWeek: state.schedule.showNextWeek,
  })
)(WeekSelector);
