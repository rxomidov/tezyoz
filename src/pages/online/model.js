import api from 'api';
import modelExtend from 'dva-model-extend'
import {model} from 'utils/model'

export default modelExtend(model, {
  namespace: "online",
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
    started: false,
    intervalID: undefined,
    users: [],
    textId: '',
    leftUsers: [],
    opened: false,
  },
  effects: {
    * getTextById({payload}, {call, put, select}) {
      const texts = yield call(api.getTextById, payload);
      yield put({
        type: 'updateState',
        payload: {
          text: texts.list.length > 0 ? texts.list[0].text : "",
          time: (texts.list.length > 0 ? texts.list[0].time : 0),
          constTime: (texts.list.length > 0 ? texts.list[0].time : 0),
          componentCount: (texts.list.length > 0 ? texts.list[0].time : 0)
        }
      });
      let text = texts.list.length > 0 ? texts.list[0].text : "";
      var linearObjects = [];
      for (var i = 0; i < 50; i++) {
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
          typedTexts: typingText
        }
      });
      return texts.list.length > 0 ? texts.list[0].text : "";
    },
    * createHistoryText({payload}, {call, put, select}) {
      const res = yield call(api.createTextHistory, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {historyTextId: res.id}
        })
      }
    }
  }
})
