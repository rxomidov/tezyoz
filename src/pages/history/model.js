import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'

export default modelExtend(model, {
  namespace: "history",
  state: {
    historyList: [],
    page: 0,
    finished: false
  },
  effects: {
    * getHistoryList({payload}, {call, put, select}) {
      const res = yield call(api.getHistoryTextById, payload);
      console.log(res)
      let {historyList} = yield select(_=>_.history);
      if (res.success) {
        historyList = [...historyList, ...res.list];
        console.log(res.list);
        console.log(res.list.length)
        yield put({
          type: "updateState",
          payload: {
            historyList: historyList,
            page: payload.page,
            finished: res.list.length < 10
          }
        })
      }
    },
  }
})
