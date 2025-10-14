import React, {Component, Suspense} from 'react';
import {connect} from "react-redux";
import LinearContent from 'components/LinearContent/LinearContent'
import ResultComponent from 'components/ResultComponent/ResultComponent'
import Container from "reactstrap/es/Container";
import Button from "reactstrap/es/Button";
import Input from "reactstrap/es/Input";
import UserImage from 'components/UserImage/UserImage'
import OpenComponent from "components/OpenComponent/OpenComponent";
import Spinner from "reactstrap/es/Spinner";
import router from "umi/router";

// const LinearContent = React.lazy(() => import('../../components/LinearContent/LinearContent'));
// const UserImage = React.lazy(() => import('../../components/UserImage/UserImage'));
// const Container = React.lazy(() => import('reactstrap/es/Container'));

@connect(({fast, app}) => ({fast, app}))
class Index extends Component {
  beginTime;

  componentDidMount() {
    document.oncontextmenu = document.body.oncontextmenu = function () {
      return false;
    }
    const {dispatch, fast} = this.props;
    dispatch({type: 'fast/getRandomText', payload: {}});
  }

  refreshGame = () => {
    const {dispatch, fast} = this.props;
    const {intervalID, opened} = fast;
    clearInterval(intervalID);
    dispatch({
      type: 'fast/updateState',
      payload: {
        componentCount: 0,
        linearObjects: [],
        time: 0,
        isPaused: false,
        isSFPro: true,
        resultSection: false,
        isNightMode: false,
        typedTexts: [],
        text: "",
        typingWord: "",
        historyTextId: "",
        typedCount: 0,
        wpm: 0,
        showResult: false,
        intervalID: undefined,
        opened: window.innerWidth <= 576 ? false : opened,
        isLoading: true
      }
    });
    dispatch({type: 'fast/getRandomText', payload: {}});
  };

  calculateWPM = (time, wordsCount) => {
    return (wordsCount * 60 / time).toFixed();
  };

  beginWriting = () => {
    this.beginTime = new Date().getTime() / 1000;
    const {dispatch, fast} = this.props;
    const {intervalID, textId} = fast;
    if (!intervalID) {
      dispatch({
        type: 'fast/beginWrite',
        payload: {textId}
      })
      dispatch({
        type: 'fast/updateState',
        payload: {
          intervalID: setInterval(() => {
            this.tick()
          }, 1000)
        }
      })
    }
  }

  componentWillUnmount() {
    const {dispatch, fast} = this.props;
    const {intervalID} = fast;
    clearInterval(intervalID);
    dispatch({
      type: 'fast/updateState',
      payload: {
        componentCount: 0,
        linearObjects: [],
        time: 0,
        isPaused: false,
        isSFPro: true,
        resultSection: false,
        isNightMode: false,
        typedTexts: [],
        text: "",
        typingWord: "",
        historyTextId: "",
        typedCount: 0,
        wpm: 0,
        showResult: false,
        intervalID: undefined,
        isLoading: true
      }
    });
  }

  finish = () => {
    const {dispatch, fast} = this.props;
    const {time, typedTexts, intervalID, constTime, textId, historyTextId} = fast;
    clearInterval(intervalID);
    dispatch({type: 'fast/endWrite', payload: {historyTextId}})
  };

  tick() {
    const {dispatch, fast} = this.props;
    const {time, pause} = fast;
    if (time === 1) {
      this.finish();
    } else {
      if (!pause) {
        dispatch({
          type: "fast/updateState",
          payload: {
            time: time - 1
          }
        });
      }
    }
  }

  render() {
    const {dispatch, fast, app} = this.props;
    const {linearObjects, time, pause, isSFPro, resultSection, typedTexts, typingWord, typedCount, showResult, wpm, intervalID, historyTextId, constTime, opened, isLoading} = fast;
    const {isNightMode} = app;

    const changePause = () => {
      dispatch({
        type: "fast/updateState",
        payload: {
          pause: !pause
        }
      });
      if (window.innerWidth <= 576) {
        openItems();
      }
    };

    const changeFamily = (family) => {
      dispatch({
        type: "fast/updateState",
        payload: {
          isSFPro: family
        }
      });
      if (window.innerWidth <= 576) {
        openItems();
      }
    };

    const changeMode = (mode) => {
      dispatch({
        type: "app/updateState",
        payload: {
          isNightMode: mode
        }
      })
      if (window.innerWidth <= 576) {
        openItems();
      }
    };

    const changeValue = (e) => {
      document.getElementsByClassName("typing-focus")[0].scrollIntoView();
      window.scrollBy(0, -150);

      let letter = e.target.value.substr(e.target.value.length - 1, 1);
      if (typedCount === 0) {
        this.beginWriting();
      }
      var tempLetter = typedTexts[typedCount].text.substr(e.target.value.length - 1, 1);
      if ((tempLetter === "\"" || tempLetter === "“" || tempLetter === "”") &&
        (letter === "\"" || letter === "“" || letter === "”")) {
        e.target.value = e.target.value.substr(0, e.target.value.length - 1) + tempLetter
      } else if ((tempLetter === "'" || tempLetter === "`" || tempLetter === "‘" || tempLetter === "’") &&
        (letter === "'" || letter === "`" || letter === "‘" || letter === "’")) {
        e.target.value = e.target.value.substr(0, e.target.value.length - 1) + tempLetter
      }
      var word = typedCount === typedTexts.length - 1 ? e.target.value : e.target.value.substr(0, e.target.value.length - 1);
      if ((letter === " " && typedTexts.filter(i => i.type === 'none')[0].text.length === word.length) ||
        (typedTexts.length - 1 === typedCount && (typedTexts[typedCount].text.length === word.length))) {
        var tempTypedTexts = typedTexts;
        if (typedTexts[typedCount].text === word) {
          tempTypedTexts[typedCount].type = "right";
        } else {
          tempTypedTexts[typedCount].type = "wrong";
        }
        dispatch({
          type: 'fast/writeWord',
          payload: {word, historyTextId}
        })
        dispatch({
          type: "fast/updateState",
          payload: {
            typedTexts: tempTypedTexts,
            typingWord: "",
            typedCount: typedCount + 1
          }
        })
        if (!typedTexts[typedCount + 1]) {
          this.finish();
        }
      } else {
        dispatch({
          type: "fast/updateState",
          payload: {
            typingWord: e.target.value
          }
        })
      }
    };
    const keyDown = (e) => {
      // if (e.ctrlKey) {
      //   e.preventDefault();
      //   return false;
      // }
    };
    const openItems = () => {
      dispatch({
        type: "fast/updateState",
        payload: {
          opened: !opened
        }
      })
    }
    return (
      <section id="fast-type"
               className={isNightMode ? "min-h-100 position-relative bg-dark-mode" : "min-h-100 position-relative bg-light-mode"}>
        {/*// <Suspense fallback={<div>nizom</div>}>*/}
        {isLoading ? <div className="text-center"><Spinner/></div> :
          <div>
            <UserImage/>
            {!showResult ?
              <Container fluid>
                <div className="d-flex">
                  <div>
                    {resultSection ? "" :
                      <Button color="dark" onClick={this.refreshGame}
                              className={`btn-refresh pc-btn ${isNightMode ? "bg-light-mode" : "bg-dark-mode"} `}>
                        <span className="icon icon-refresh"/>
                      </Button>}
                  </div>
                  <div className={resultSection ? "ml-140" : "ml-66"}>
                    <Input type="text"
                           autocapitalize={"off"}
                           className={`type-input fs-45 font-family-bold pt-0 pl-0 h-auto ${isNightMode ? 'night-mode' : ''} ${typedTexts.length > 0 ?
                             (!!typedTexts.find(i => i.type === 'none') ?
                               (typingWord !== typedTexts.find(i => i.type === 'none').text.substr(0, typingWord.length) ? 'text-danger' : '')
                               : '') : ''}`}
                           autoComplete="off" autoFocus
                           disabled={pause}
                           onKeyDown={keyDown}
                           onChange={changeValue} value={typingWord}/>
                  </div>
                </div>
                <div className="d-flex mt-47">
                  {resultSection ? "" :
                    <div className="pc-btn">
                      <div
                        className={isNightMode ? "button-group text-center d-flex night-mode" : "button-group text-center d-flex light-mode"}>
                        <Button
                          className={isSFPro ? isNightMode ? "font-family-semi-bold fs-16 active-btn night-mode" : "font-family-semi-bold fs-16 active-btn light-mode" :
                            isNightMode ? "font-family-semi-bold fs-16 night-mode" : "font-family-semi-bold fs-16 light-mode"}
                          color="light" onClick={() => changeFamily(true)}>
                          T
                        </Button>
                        <Button
                          className={isSFPro ? isNightMode ? "font-family-times fs-16 night-mode" : "font-family-times fs-16 light-mode" : isNightMode ? "font-family-times fs-16 active-btn night-mode" :
                            "font-family-times fs-16 active-btn light-mode"}
                          color="light"
                          onClick={() => changeFamily(false)}>
                          T
                        </Button>
                      </div>
                      <div
                        className={isNightMode ? "button-group text-center night-mode" : "button-group text-center light-mode"}>
                        <Button color="light" className={isNightMode ? "night-mode" : "light-mode active-btn"}
                                onClick={() => changeMode(false)}>
                          <span className="icon icon-sun"/>
                        </Button>
                        <Button color="light" onClick={() => changeMode(true)}
                                className={isNightMode ? "active-btn night-mode" : "light-mode"}>
                          <span className="icon icon-moon"/>
                        </Button>
                      </div>
                      {/*<div*/}
                      {/*  className={isNightMode ? "button-group text-center night-mode" : "button-group text-center light-mode"}>*/}
                      {/*  <Button color="light" onClick={changePause}*/}
                      {/*          className={pause ? isNightMode ? "active-btn night-mode" : "active-btn light-mode" : isNightMode ? "night-mode" : "light-mode"}>*/}
                      {/*    <span className="icon icon-coffee"/>*/}
                      {/*  </Button>*/}
                      {/*</div>*/}
                    </div>
                  }
                  <div className={resultSection ? "ml-140 w-100" : "ml-66 w-100"}>
                    <p
                      className={isSFPro ? isNightMode ? "default-text fs-35 text-non-typed-dark font-family-light" : "default-text fs-35 text-non-typed font-family-light" :
                        isNightMode ? "default-text fs-35 text-non-typed-dark font-family-times" : "default-text fs-35 text-non-typed font-family-times"}>
                      {typedTexts.map((text, index) => {
                          if (index == typedCount) {
                            return (
                              <span className="typing-focus"><span
                                className={isNightMode ? "text-typing-dark" : "text-typing"}>{text.text.substr(0, typingWord.length)}</span>{text.text.substr(typingWord.length, text.text.length)} </span>
                            )
                          } else {
                            return (
                              <span
                                className={text.type == "right" ? isNightMode ? "text-right-typed-dark" : "text-right-typed" :
                                  text.type == "wrong" ? isNightMode ? "text-wrong-typed-dark" : "text-wrong-typed" :
                                    text.type == "writing" ? isNightMode ? "text-typing-dark" : "text-typing" : ""}>{text.text} </span>
                            )
                          }
                        }
                      )}
                    </p>
                  </div>

                  <LinearContent time={time} linearObjects={linearObjects} constTime={constTime}/>
                </div>
              </Container> : <Container fluid>
                <ResultComponent wpm={wpm} isNightMode={isNightMode} typedTexts={typedTexts}
                                 refreshGame={this.refreshGame}
                                 historyTextId={historyTextId}/>
              </Container>}
            {/*// </Suspense>*/}
            <OpenComponent openItems={openItems} opened={opened} isNightMode={isNightMode} isSFPro={isSFPro}
                           showPause={true} changeFamily={changeFamily} changePause={changePause}
                           changeMode={changeMode} pause={pause} refreshGame={this.refreshGame}/>
          </div>
        }

      </section>

    );
  }
}

export default Index;
