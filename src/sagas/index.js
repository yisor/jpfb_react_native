import { fork } from 'redux-saga/effects';
import { watchLoginRequests } from '../containers/login';
import { watchQueryFlight } from '../containers/flight/list';
import { watchQueryAuditPerson, watchQueryCostCenter } from '../containers/flight/order';
import { watchQueryAddress } from '../containers/user/address';

export default function* rootSaga() {
  yield [
    fork(watchLoginRequests),
    fork(watchQueryFlight),
    fork(watchQueryAuditPerson),
    fork(watchQueryCostCenter),
    fork(watchQueryAddress)
  ];
}