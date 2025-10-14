import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'
import {STORAGE_NAME} from "../utils/constant";

export default modelExtend(model, {
  namespace: "app",
  state: {
    isNightMode: false,
    user: {}
  },
  effects: {
    * me({payload}, {call, put, select}) {
      try {
        let res = yield call(api.me, {});
        if (!res.success) {
          res = yield call(api.newToken, {});
          if (!res.success) {
            localStorage.removeItem(STORAGE_NAME);
            localStorage.removeItem('Refresh-Token');
          } else {
            localStorage.setItem(STORAGE_NAME, res.token);
            localStorage.setItem('Refresh-Token', res.refreshToken);
            yield put({
              type: 'updateState',
              payload: {user: res}
            })
          }
        } else {
          yield put({
            type: 'updateState',
            payload: {user: res}
          })
        }
        return res;
      } catch (e) {
        const res = yield call(api.newToken, {});
        if (!res.success) {
          localStorage.removeItem(STORAGE_NAME);
          localStorage.removeItem('Refresh-Token');
        } else {
          localStorage.setItem(STORAGE_NAME, res.token);
          localStorage.setItem('Refresh-Token', res.refreshToken);
          yield put({
            type: 'updateState',
            payload: {user: res}
          })
        }
      }

    }
  },
})
