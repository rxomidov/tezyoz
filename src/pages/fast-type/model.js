import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'
import {toast} from "react-toastify";

export default modelExtend(model, {
  namespace: "fast",
  state: {
    componentCount: 30,
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
    textId: "",
    historyTextId: '',
    opened: false,
    isLoading: true
  },
  effects: {
    * getRandomText({payload}, {call, put, select}) {
      const texts = yield call(api.getRandomText, payload);
      yield put({
        type: 'updateState',
        payload: {
          textId: texts.list.length > 0 ? texts.list[0].id : "",
          text: texts.list.length > 0 ? texts.list[0].text : "",
          time: (texts.list.length > 0 ? texts.list[0].time : 0),
          constTime: (texts.list.length > 0 ? texts.list[0].time : 0),
        }
      });
      let text = texts.list.length > 0 ? texts.list[0].text : "";
      var linearObjects = [];
      for (var i = 0; i < 30; i++) {
        linearObjects.push(i);
      }
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
          linearObjects: linearObjects,
          typedTexts: typingText,
          isLoading: false
        }
      });
      return texts.list.length > 0 ? texts.list[0].text : "";
    },
    * beginWrite({payload}, {call, put, select}) {
      console.log(payload, 'qakduhiu');
      
      const res = yield call(api.beginWrite, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {historyTextId: res.historyTextId}
        })
      }
    },
    * writeWord({payload}, {call, put, select}) {
      const res = yield call(api.writeWord, payload);
    },
    * endWrite({payload}, {call, put, select}) {
      const res = yield call(api.endWrite, payload);
      if (res.success) {
        if (res.realWpm) {
          toast.error("Bu yozuv tezligingizga ishonchingiz komil bo'lsa adminga murojaat qiling.")
        }
        yield put({
          type: 'updateState',
          payload: {wpm: res.wpm, showResult: true}
        })
      }
    },
  }
})
