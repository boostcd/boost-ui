import { call, delay, put, race, take } from 'redux-saga/effects';

import gatewayApi from '../../../apis/GatewayApi';
import { POLLING_DELAY } from '../../../constants';
import ACTIONS, {
  fetchMicroservicesFailure,
  fetchMicroservicesPending,
  fetchMicroservicesSuccess,
} from './actions';

export function* fetchMicroservices() {
  while (true) {
    try {
      yield put(fetchMicroservicesPending());
      const data = yield call(gatewayApi.getMicroservices);
      yield put(fetchMicroservicesSuccess(data));
    } catch (error) {
      yield put(fetchMicroservicesFailure(error));
    } finally {
      yield delay(POLLING_DELAY);
    }
  }
}

export default function*() {
  while (true) {
    yield take(ACTIONS.POLL_START);
    yield race([call(fetchMicroservices), take(ACTIONS.POLL_STOP)]);
  }
}
