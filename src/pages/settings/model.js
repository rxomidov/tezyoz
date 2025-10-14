import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'
import {toast} from "react-toastify";
import router from "umi/router";

export default modelExtend(model, {
  namespace: "settings",
  state: {
    isLoading: false
  },
  effects: {
    * editProfile({payload}, {call, put, select}) {
      const res = yield call(api.editUserProfile, payload);
      if (res.success){
        toast.success('Bajarildi!');
        yield put({
          type: "updateState",
          payload: {
            isLoading: false
          }
        });
        router.push('/');
      } else {
        toast.error('Xatolik!');
        yield put({
          type: "updateState",
          payload: {
            isLoading: false
          }
        });
      }
    },
  }
})
