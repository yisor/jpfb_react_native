import React, { Component } from 'react';
import { View, Text, Image, ListView, StyleSheet, ActivityIndicator, InteractionManager, Alert, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { flightQuery } from '../action';
import TabView from '../../../../components/TabView';
import window from '../../../../utils/window';
import Divider from '../../../../components/Divider';
import { formatTime } from '../../../../utils/timeUtils';

const MealTypes = ['无餐食', '早餐', '午餐', '正餐', '小吃', '点心'];
const isShare = [false, true];// 是否共享
const isStopover = [false, true]; // 是否经停
import mockData from './flight.json';

class FlightListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    };
  }

  componentDidMount() {
    this.props.dispatch(flightQuery(this.props.params));
  }

  //机场名称
  renderAirfield(rowData) {
    return (
      <View style={styles.airfieldContainer}>
        <Text style={styles.flightInfoFont}>{rowData.departureAirport}</Text>
        <Text style={styles.flightInfoFont}>{rowData.destinationAirport}</Text>
      </View>
    );
  }

  renderFlightArrow(rowData) {
    return (isStopover[rowData.isStopover] ?
      <View style={{ alignItems: 'center', }}>
        <Text style={styles.stopoverText}>经停</Text>
        <Image source={require('../../../../resources/assets/plane/plane_stopover_arrow_icon.png')} style={styles.flightArrowImg} />
      </View>
      : <Image source={require('../../../../resources/assets/plane/plane_arrow_icon.png')} style={styles.flightArrowImg} />
    );
  }

  // 航班时间
  renderFlightTime(rowData) {
    return (
      <View style={styles.flightTimeContainer}>
        <Text style={styles.flightTime}>{formatTime(rowData.departureTime)}</Text>
        {this.renderFlightArrow(rowData)}
        <Text style={styles.flightTime}>{formatTime(rowData.destinationTime)}</Text>
      </View>
    );
  }

  // 最低价格
  renderMinPrice(rowData) {
    return (
      <View style={styles.minPriceContainer}>
        <Text style={styles.minPriceFont}>{`¥${rowData.minPrice}`}</Text>
      </View>
    );
  }

  // 是否共享
  renderIsShare(rowData) {
    return (isShare[rowData.isShare] ?
      <View style={styles.isShareBg}>
        <Text style={styles.isShareText}>共享</Text>
      </View> : null
    );
  }

  onPressItem(rowData) {
    Actions.flightDetail({ 'flight': rowData });
  }

  renderRow = (rowData) => {
    return (
      <TouchableOpacity style={styles.rowContainer} activeOpacity={0.6} onPress={() => this.onPressItem(rowData)}>
        <View style={{ flex: 1 }}>
          {this.renderFlightTime(rowData)}
          {this.renderAirfield(rowData)}
          <View style={styles.flyInfoContainer}>
            <Text style={styles.flightInfoFont}>{rowData.airlineShortName}</Text>
            {this.renderIsShare(rowData)}
            <Text style={styles.verticalDivider}>|</Text>
            <Text style={styles.flightInfoFont}>{rowData.flightNumber}</Text>
            <Text style={styles.verticalDivider}>|</Text>
            <Text style={styles.flightInfoFont}>{rowData.planeType}</Text>
            <Text style={styles.verticalDivider}>|</Text>
            <Text style={styles.flightInfoFont}>{MealTypes[rowData.mealType]}</Text>
          </View>
        </View>
        {this.renderMinPrice(rowData)}
      </TouchableOpacity>
    )
  }

  renderBottomTab() {
    return (
      <TabView barStyle={{ backgroundColor: 'white' }} type='projector'>
        <TabView.Sheet
          type='button'
          title='时间'
          icon={require('../../../../resources/assets/plane/tab_annulus_1.png')}
          activeIcon={require('../../../../resources/assets/plane/tab_annulus_2.png')} />
        <TabView.Sheet
          type='button'
          title='价格'
          icon={require('../../../../resources/assets/plane/tab_price.png')}
          activeIcon={require('../../../../resources/assets/plane/tab_price_2.png')} />
        <TabView.Sheet
          type='button'
          title='筛选'
          icon={require('../../../../resources/assets/plane/tab_screening_1.png')}
          activeIcon={require('../../../../resources/assets/plane/tab_screening_2.png')} />
      </TabView>
    );
  }

  renderCalendarNar() {
    return (
      <View style={styles.calendar}>
        <TouchableOpacity style={[styles.rowCenter, { marginLeft: 10 }]} activeOpacity={0.6}>
          <Image style={[styles.arrowImg, { marginRight: 10 }]} resizeMode="contain" source={require('../../../../resources/assets/common/arrow_white_icon.png')} />
          <Text style={{ color: 'white' }}>前一天</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rowCenter, styles.dateView]} activeOpacity={0.6}>
          <Text style={{ marginLeft: 10 }}>02月27日</Text>
          <Text style={{ marginLeft: 10 }}>周一</Text>
          <Image style={{ marginLeft: 10, marginRight: 10 }} resizeMode="contain" source={require('../../../../resources/assets/common/vertical_divider.png')} />
          <Image style={{ width: 15, height: 15 }} resizeMode="contain" source={require('../../../../resources/assets/plane/plane_calendar.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rowCenter, { marginRight: 10 }]} activeOpacity={0.6}>
          <Text style={{ color: 'white' }}>后一天</Text>
          <Image style={[styles.arrowImg, { marginLeft: 10 }]} resizeMode="contain" source={require('../../../../resources/assets/common/arrow_next.png')} />
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
        {this.renderBottomTab()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    marginTop: 20
  },
  contentContainer: {
    width: window.width,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  flightTime: {
    fontSize: 20,
    color: "#323b43"
  },
  flightTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  flyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  flightInfoFont: {
    fontSize: 12,
    color: "#a0a4a8",
  },
  minPriceFont: {
    fontSize: 18,
    color: "#e26a6a"
  },
  minPriceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  isShareBg: {
    borderRadius: 2,
    backgroundColor: "#51a6f0",
    marginLeft: 5
  },
  isShareText: {
    fontSize: 8,
    color: "#fff",
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2
  },
  stopoverText: {
    fontSize: 10,
    color: "#51a6f0"
  },
  flightArrowImg: {
    width: 44,
    height: 3
  },
  airfieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  verticalDivider: {
    marginLeft: 5,
    marginRight: 5
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
  status: store.flight.list.status,
})
export default connect(select)(FlightListPage);
