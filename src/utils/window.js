import { Dimensions, PixelRatio, Platform } from 'react-native';
export default {
  width: Dimensions.get('window').width,
  heigh: Dimensions.get('window').height,
  onePixel: 1 / PixelRatio.get(),
  statusBarHeight: (Platform.OS === 'ios' ? 20 : 0),
  tabBarHeight: 49,
  navBarHeight: (Platform.OS === 'ios' ? 64 : 44)
}