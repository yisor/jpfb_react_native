/*
 *  @File   : ChangeAirlistPage
 *  @Author : lsl
 *  @Date   : 2017-12-1 16:12:7
 *  @Last Modified   : 2017-12-1 16:12:7
 *  @Desc 航班列表
 */
import React, { Component } from 'react';
import { View, Text, Image, ListView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { flightSortUpTime, flightSortUpPrice, fetchFlightList } from '../action';
import { flightMarkerKey } from '../../../../constants/constDefines';
import TabView from '../../../../components/TabView';
import window from '../../../../utils/window';
import Store from '../../../../utils/store';
import Divider from '../../../../components/Divider';
import FlightItem from './FlightItem';
import FlightFilter from './FlightFilter';

class ChangeAirlistPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      visible: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchFlightList(this.props.params));
  }

  onPressItem(rowData) {
    let { params } = this.props;
    Actions.changeAirDetail({ 'flight': rowData, params: params });
  }

  renderRow = (rowData) => {
    return (<FlightItem rowData={rowData} onPressItem={(data) => this.onPressItem(data)} />)
  }

  renderCalendarNar() {
    return (
      <View style={styles.calendar}>
        <TouchableOpacity style={[styles.rowCenter, { marginLeft: 10 }]} activeOpacity={0.6}>
          <Image style={[styles.arrowImg, { marginRight: 10 }]} resizeMode="contain"
            source={require('../../../../resources/assets/common/arrow_white_icon.png')} />
          <Text style={{ color: 'white' }}>前一天</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rowCenter, styles.dateView]} activeOpacity={0.6}>
          <Text style={{ marginLeft: 10 }}>02月27日</Text>
          <Text style={{ marginLeft: 10 }}>周一</Text>
          <Image style={{ marginLeft: 10, marginRight: 10 }} resizeMode="contain"
            source={require('../../../../resources/assets/common/vertical_divider.png')} />
          <Image style={{ width: 15, height: 15 }} resizeMode="contain"
            source={require('../../../../resources/assets/plane/plane_calendar.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rowCenter, { marginRight: 10 }]} activeOpacity={0.6}>
          <Text style={{ color: 'white' }}>后一天</Text>
          <Image style={[styles.arrowImg, { marginLeft: 10 }]} resizeMode="contain"
            source={require('../../../../resources/assets/common/arrow_next.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCalendarNar()}
        <View style={{ height: window.heigh - 175, }}>
          <ListView
            contentContainerStyle={styles.contentContainer}
            dataSource={this.state.dataSource.cloneWithRows(this.props.flights)}
            renderRow={this.renderRow}
            enableEmptySections={true}
            renderSeparator={() => <Divider />} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    width: window.width,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  calendar: {
    flexDirection: 'row',
    height: 45,
    backgroundColor: "#51a6f0",
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateView: {
    backgroundColor: 'white',
    width: 160,
    height: 32,
    borderRadius: 3
  },
  arrowImg: {
    width: 7,
    height: 12,
  }
});

const select = store => ({
  flights: store.flight.list.flights,
  airlines: store.flight.list.airlines,
  status: store.flight.list.status
})
export default connect(select)(ChangeAirlistPage);
