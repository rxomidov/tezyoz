import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'
import React from "react";
import {toast} from "react-toastify";

export default modelExtend(model, {
  namespace: "tournament",
  state: {
    componentCount: 0,
    linearObjects: [],
    time: 0,
    constTime: 0,
    isPaused: false,
    isSFPro: true,
    resultSection: false,
    isNightMode: false,
    typedTexts: [],
    text: "",
    typingWord: "",
    typedCount: 0,
    wpm: 0,
    showResult: false,
    intervalID: undefined,
    showLeftTime: undefined,
    tournamentInfo: {},
    stratTime: "",
    endTime: "",
    turnirUserId: "",
    tournamentUsers: [],
    expireTime: "",
    leftTime: {},
    opened: false
  },
  effects: {
    * getTournament({payload}, {call, put, select}) {
      const res = yield call(api.getTournamentById, payload);
      var linearObjects = [];
      for (var i = 0; i < 30; i++) {
        linearObjects.push(i);
      }
      if (res.success) {
        yield put({
          type: "updateState",
          payload: {
            linearObjects,
            tournamentInfo: res,
            text: res.text,
            startTime: res.createdAt.substr(0, 10) + " " + res.createdAt.substr(11, 5),
            expireTime: res.closeDate.substr(0, 10) + " " + res.closeDate.substr(11, 5),
            time: res.time,
            constTime: res.time
          }
        });
        yield put({
          type: 'showEventDate',
          payload: {
            expireTime: res.closeDate.substr(0, 10) + " " + res.closeDate.substr(11, 5),
          }
        })
        let text = res.text;
        var typingText = [];
        var tempText = text.split(" ");
        for (let i = 0; i < text.split(" ").length; i++) {
          typingText.push({
            type: "none",
            text: tempText[i]
          })
        }
        yield put({
          type: "updateState",
          payload: {
            typedTexts: typingText
          }
        });

        yield put({
          type: "getTournamentusers",
          payload: {path: res.id}
        })
      }
    },
    * getTournamentusers({payload}, {call, put, select}) {
      const data = yield call(api.getTournamentusers, payload)
      if (data.success) {
        yield put({
          type: "updateState",
          payload: {
            tournamentUsers: data.list
          }
        })
      }
    },
    * showEventDate({payload}, {call, put, select}) {
      const {expireTime} = payload;
      console.log(expireTime)
      // let eventDate = startTime;
      let dateString = expireTime;
      let date1 = new Date(dateString).getTime();
      var date2 = new Date().getTime();
      var msec = date1 - date2;

      var mins = Math.floor(msec / 60000);
      var hrs = Math.floor(mins / 60);
      mins = mins % 60;
      var days = Math.floor(hrs / 24);
      hrs = hrs % 24;
      // return days + " " + <FormattedMessage id="DAY"/> + hrs + " " + <FormattedMessage id="HOUR"/>
      // return {
      //   days: days,
      //   hours: hrs,
      //   mins: mins
      // }
      if (msec < 0) {
        yield put({
          type: "updateState",
          payload: {
            leftTime: {
              days: days,
              hours: hrs,
              mins: mins,
              isExpire: true
            }
          }
        })
      } else {
        yield put({
          type: "updateState",
          payload: {
            leftTime: {
              days: days,
              hours: hrs,
              mins: mins,
              isExpire: false
            }
          }
        })
      }
    },
    * beginWrite({payload}, {call, put, select}) {
      const res = yield call(api.beginWriteTurnir, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {turnirUserId: res.turnirUserId}
        })
      }
    },
    * endWrite({payload}, {call, put, select}) {
      const res = yield call(api.endWriteTurnir, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {wpm: res.wpm, showResult: true}
        })
      }
    },
    * rejectWpm({payload}, {call, put, select}) {
      const{tournamentInfo}=yield select(_=>_.tournament);
      const res = yield call(api.rejectWpm, payload);
      if(res.success){
        toast.success('Natija bekor qilindi')
      }else{
        toast.error('Xatolik')
      }
      yield put({
        type: "getTournamentusers",
        payload: {path: tournamentInfo.id}
      })
    },
    * blockUser({payload}, {call, put, select}) {
      const{tournamentInfo}=yield select(_=>_.tournament);
      const res = yield call(api.blockUser, payload);
      if(res.success){
        toast.success('Foydalanuvchi bloklandi')
      }else{
        toast.error('Xatolik')
      }
      yield put({
        type: "getTournamentusers",
        payload: {path: tournamentInfo.id}
      })
    }
  }
})
