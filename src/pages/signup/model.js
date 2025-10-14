import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'
import router from "umi/router";
import {toast} from "react-toastify";

export default modelExtend(model, {
  namespace: "signup",
  state: {
    isLoading: false
  },
  effects: {
    * signUpNewUser({payload}, {call, put, select}) {
      try {
        const res = yield call(api.signUp, payload);
        if (res.success) {
          yield put({
            type: "updateState",
            payload: {
              isLoading: false
            }
          });
          toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz.");
          router.push("/signin")
        } else {
          toast.error(res.error);
          yield put({
            type: "updateState",
            payload: {
              isLoading: false
            }
          });
        }
      } catch (e) {
        toast.error('Xatolik!');
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
