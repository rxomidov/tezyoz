import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'
import {toast} from "react-toastify";

export default modelExtend(model, {
  namespace: "text",
  state: {
    texts: [],
    modalShow: false,
    modalType: 'add',
    selectedText: {},
    totalPages: 0,
    page: 0
  },
  effects: {
    * getTextList({payload}, {call, put, select}) {
      let {texts, page} = yield select(_ => _.text);
      const res = yield call(api.getTextById, payload);
      if (res.success) {
        yield put({type: "updateState", payload: {texts: res.list, totalPages: res.totalPages}})
      }
    },
    * deleteText({payload}, {call, put, select}) {
      const {selectedTextId, page} = yield select(_ => _.text);
      const res = yield call(api.deleteTextById, {path: selectedTextId});
      if (res.success) {
        yield put({
          type: "updateState",
          payload: {
            modalShow: false,
          }
        });
        yield put({
          type: "getTextList",
          payload: {page}
        })
        toast.success("O'chirildi");
      } else{
        toast.error("Xatolik!");
      }
      return res;
    },
    * addText({payload}, {call, put, select}) {
      const {modalType, page} = yield select(_ => _.text);
      const res = yield call(modalType === 'add' ? api.addNewText : api.editNewText, payload);
      if (res.success) {
        yield put({
          type: "updateState",
          payload: {
            modalShow: false,
          }
        });
        yield put({
          type: "getTextList",
          payload: {page}
        })
        toast.success("Muvaffaqqiyatli amalga oshirildi");
      } else {
        toast.error("Xatolik!");
      }
      return res;
    }
  }
})
