import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'
import {STORAGE_NAME} from 'utils/constant';
import router from "umi/router";
import {toast} from "react-toastify";

export default modelExtend(model, {
  namespace: "signin",
  state: {
    isLoading: false
  },
  effects: {
    * signIn({payload}, {call, put, select}) {
      try {
        const res = yield call(api.signIn, payload);
        if (res.success) {
          localStorage.setItem(STORAGE_NAME, res.token);
          localStorage.setItem('Refresh-Token', res.refreshToken);
          yield put({
            type: "updateState",
            payload: {
              isLoading: false
            }
          });
          router.push("/sinov")
        } else {
          toast.error('Login yoki parol xato!');
          yield put({
            type: "updateState",
            payload: {
              isLoading: false
            }
          });
        }
      } catch (e) {
        toast.error(e);
        yield put({
          type: "updateState",
          payload: {
            isLoading: false
          }
        });
      }
    }
  }
})
