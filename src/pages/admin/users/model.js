import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'
import {toast} from "react-toastify";

export default modelExtend(model, {
  namespace: "users",
  state: {
    userList: [],
    modalShow: false,
    selectedUser: {},
    totalPages: 0,
    page: 0,
    isSearchLoading: false,
    isSearching: false
  },
  effects: {
    * getUserList({payload}, {call, put, select}) {
      const {isSearching, searchingUser} = yield select(_ => _.users);
      console.log(payload)
      if (isSearching) {
        const res = yield call(api.searchUsers, {search: searchingUser, page: payload.page});
        if (res.success) {
          yield put({type: "updateState", payload: {userList: res.list, totalPages: res.totalPages}})
        }
      } else {
        const res = yield call(api.getAllUsers, payload?payload:{});
        if (res.success) {
          yield put({type: "updateState", payload: {userList: res.list, totalPages: res.totalPages}})
        }
      }
    },
    * searchUser({payload}, {call, put, select}) {
      const res = yield call(api.searchUsers, payload);
      yield put({
        type: "updateState",
        payload: {
          userList: res.list,
          isSearchLoading: false,
          totalPages: res.totalPage,
          page: 0
        }
      })
    },
    * editUser({payload}, {call, put, select}) {
      const res = yield call(api.editUserRole, payload);
      if (res.success) {
        yield put({
          type: "updateState",
          payload: {
            modalShow: false,
          }
        });
        yield put({
          type: "getUserList",
          payload: {}
        });
        toast.success("O'zgaritrildi");
      } else {
        toast.error("Xatolik!");
      }
    },
    * blockUser({payload}, {call, put, select}) {
      const res = yield call(api.blockUser, payload);
      yield put({
        type: 'getUserList'
      })
      if (res.success) {
        toast.success('Foydalanuvchi bloklandi')
      } else {
        toast.error('Xatolik')
      }
    },
    * unBlockUser({payload}, {call, put, select}) {
      const res = yield call(api.unBlockUser, payload);
      yield put({
        type: 'getUserList'
      })
      if (res.success) {
        toast.success('Foydalanuvchi blokdan chiqarildi')
      } else {
        toast.error('Xatolik')
      }
    }
  }
})
