import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'
import {toast} from "react-toastify";

export default modelExtend(model, {
  namespace: 'turnir',
  state: {
    list: [],
    page: 0,
    size: 10,
    modalShow: false,
    modalType: 'show',
    selectedItem: {},
    selectedItemId: '',
    totalPages: 0
  },
  effects: {
    * getTurnirs({payload}, {call, put, select}) {
      let {list} = yield select(_ => _.turnir);
      const res = yield call(api.getTournamentList, payload);
      yield put({
        type: 'updateState',
        payload: {list: res.list, totalPages: res.totalPages}
      })
    },
    * addOrUpdateTurnir({payload}, {call, put, select}) {
      const {page} = yield select(_ => _.turnir);
      const res = yield call(payload.get('path') ? api.updateTurnir : api.addTurnir, payload);
      if (res.success) {
        yield put({type: "updateState", payload: {modalShow: false,}});
        yield put({type: "getTurnirs", payload: {page}})
        toast.success("Muvaffaqqiyatli amalga oshirildi!");
      } else {
        toast.error("Xatolik!");
      }
    },
    * deleteTurnir({payload}, {call, put, select}) {
      const {selectedItemId, page} = yield select(_ => _.turnir);
      const res = yield call(api.deleteTurnir, {path: selectedItemId});
      if (res.success) {
        yield put({type: "updateState", payload: {modalShow: false,}});
        yield put({type: "getTurnirs", payload: {page}})
        toast.success("O'chirildi");
      } else {
        toast.error("Xatolik!");
      }
    }
  }
})
