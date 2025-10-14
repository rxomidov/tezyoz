import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'

export default modelExtend(model, {
  namespace: "tournaments",
  state: {
    tournamentList: [],
    page: 0,
    totalPages: 0
  },
  effects: {
    * getTournaments({payload}, {call, put, select}) {
      try {
        const res = yield call(api.getTournamentList, payload);
        if (res.success) {
          let {tournamentList} = yield select(_=>_.tournaments);
          tournamentList = [...tournamentList, ...res.list];
          yield put({
            type: "updateState",
            payload: {
              tournamentList: tournamentList,
              page: payload.page,
              totalPages: res.totalPages
            }
          })
        }
      }catch (e) {

      }
    }
  }
})
