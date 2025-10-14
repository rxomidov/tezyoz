import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'

export default modelExtend(model, {
  namespace: "result",
  state: {
    history: {}
  },
  effects: {
    * getHistoryById({payload}, {call, put, select}) {
      const res = yield call(api.getHistoryTextById, payload);
      if (res.success)
        yield put({
          type: 'updateState',
          payload: {
            history: res
          }
        })
      return res;
    }
  }
})
