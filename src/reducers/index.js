import { combineReducers } from 'redux';
import { login } from '../containers/login';
import { address } from '../containers/user/address';
import flightStore from '../containers/flight';

const user = combineReducers({ login, address });

export default combineReducers({
  user,
  flight: flightStore,
});