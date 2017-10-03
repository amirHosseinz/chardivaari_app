
import React, {PropTypes, Component} from 'react';
import {
  View,
  Text,
  ListView,
  Dimensions
} from 'react-native';
import Moment from 'moment';
import moment from 'moment-jalaali';
import styles from './CalendarStyle';
import Month from './Month';
const {width} = Dimensions.get('window');
export default class MonthList extends Component {
  constructor (props) {
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r2.shouldUpdate;
      }
    });
    this.monthList = [];
    this.state = {
      dataSource: this.ds.cloneWithRows(this._getMonthList())
    };
    this._renderMonth = this._renderMonth.bind(this);
    this._shouldUpdate = this._shouldUpdate.bind(this);
    this._checkRange = this._checkRange.bind(this);
    this._getWeekNums = this._getWeekNums.bind(this);
    this._scrollToSelecetdMonth = this._scrollToSelecetdMonth.bind(this);
  }
  componentWillReceiveProps (nextProps) {
    let isDateUpdated = ['startDate', 'endDate', 'minDate', 'maxDate'].reduce((prev, next) => {
      if (prev || nextProps[next] !== this.props[next]) {
        return true;
      }
      return prev;
    }, false);
    if (isDateUpdated) {
      this.setState({
        dataSource:
          this.state.dataSource.cloneWithRows(this._getMonthList(nextProps))
      });
    }
  }
  _renderMonth (month) {
    return (
      <Month
        month={month.date || {}}
        {...this.props}
      />
    );
  }
  _checkRange (date, start, end) {
    if (!date || !start) return false;
    dDate = moment();
    dDate.year(date.year());
    dDate.month(date.month());
    dDate.date(date.date());
    sStart = moment();
    sStart.year(start.year());
    sStart.month(start.month());
    sStart.date(start.date());
    date = dDate;
    start = sStart;
    if (end) {
      eEnd = moment();
      eEnd.year(end.year());
      eEnd.month(end.month());
      eEnd.date(end.date());
      end = eEnd;
    }
    if (!end) return date.jYear() === start.jYear() && date.jMonth() === start.jMonth();
    if (date.jYear() < start.jYear() || (date.jYear() === start.jYear() && date.jMonth() < start.jMonth())) return false;
    // console.log(String(end.year()) + ', '+ String(date.year()));
    // console.log(String(end.month()) + ', '+ String(date.month()));
    if (date.jYear() > end.jYear() || (date.jYear() === end.jYear() && date.jMonth() > end.jMonth())) return false;
    return true;
  }
  _shouldUpdate (month, props) {
    if (!props) return false;
    const {
      startDate,
      endDate
    } = props;
    const {
      date
    } = month;
    let next = this._checkRange(date, startDate, endDate);
    let prev = this._checkRange(date, this.props.startDate, this.props.endDate);
    if (prev || next) return true;
    return false;
  }
  _getMonthList (props) {
    // let minDate = (props || this.props).minDate.clone().date(1);
    let minDate = (props || this.props).minDate.clone().jDate(1);
    let maxDate = (props || this.props).maxDate.clone();
    let monthList = [];
    if (!maxDate || !minDate) return monthList;
    while (maxDate > minDate || (
      // maxDate.year() === minDate.year() &&
      // maxDate.month() === minDate.month()
      maxDate.jYear() === minDate.jYear() &&
      maxDate.jMonth() === minDate.jMonth()
    )) {
      let month = {
        date: minDate.clone()
      };
      month.shouldUpdate = this._shouldUpdate(month, props);
      monthList.push(month);
      minDate.add(1, 'jMonth');
      minDate.jDate(1);
    }
    return monthList;
  }
  _getWeekNums(start, end) {
    let clonedMoment = Moment(start), date, day, num, y, m, total = 0;
    while (!clonedMoment.isSame(end, 'months')) {
      y = clonedMoment.year();
      m = clonedMoment.month();
      date = new Date(y, m, 1);
      day = date.getDay();
      num = new Date(y, m + 1, 0).getDate();
      total += Math.ceil((num + day) / 7);
      clonedMoment.add(1, 'months');
    }
    return total;
  }
  _scrollToSelecetdMonth () {
    const {
      startDate,
      minDate
    } = this.props;
    let monthOffset = 12 * (startDate.year() - minDate.year()) +
      startDate.month() - minDate.month();
    let weekOffset = this._getWeekNums(minDate, startDate);
    setTimeout(() => {
      this.list && this.list.scrollTo({
        x: 0,
        y: monthOffset * (24 + 25) + (monthOffset ? weekOffset * Math.ceil(width / 7 + 10) : 0),
        animated: true
      });
    }, 400);
  }
  componentDidMount () {
    this.props.startDate && this._scrollToSelecetdMonth();
  }
  render () {
    return (
      <ListView
        ref={(list) => {this.list = list;}}
        style={styles.scrollArea}
        dataSource={this.state.dataSource}
        renderRow={this._renderMonth}
        pageSize={2}
        initialListSize={2}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}
