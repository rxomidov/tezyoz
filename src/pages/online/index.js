import React, {Component, useEffect} from 'react';
import Container from "reactstrap/es/Container";
import Button from "reactstrap/es/Button";
import Input from "reactstrap/es/Input";
import {connect} from "react-redux";
import LinearContentHorizontal from "components/LinearContentHorizontal/LinearContentHorizontal";
import io from "socket.io-client";
import router from 'umi/router';
import Spinner from "reactstrap/es/Spinner";
import UserImage from 'components/UserImage/UserImage'
import OpenComponent from "components/OpenComponent/OpenComponent";

@connect(({online, app}) => ({online, app}))
class Index extends Component {
  socket;
  room;
  ENDPOINT = "tezyoz.uz";
  userId;
  beginTime;
  waitTime = 30;
  waitTimeInterval;

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'app/me'
    }).then(user => {
      if (user.success) {
        this.userId = user.id;
        this.startGame();
      } else {
        // toast.error("Qatnashish uchun ro'yhatdan o'ting");
        router.push('/signin')
      }
    });
    document.oncontextmenu = document.body.oncontextmenu = function () {
      return false;
    };
  }

  refreshGame = () => {
    this.stopGame();
    this.startGame();
  };

  startGame = () => {
    this.socket = io(this.ENDPOINT, {query: "id=" + this.userId});
    this.socket.emit('join', {room: 'room'}, () => {
      console.log('join bo\'ldi')
    });
    this.handleRoomDataToSocket();
    this.handleWpmToSocket();
    this.socket.on("leftUser", (payload) => {
      let leftUsers = this.props.online.leftUsers;
      leftUsers.push(payload.userId);
      console.log(leftUsers)
      this.props.dispatch({
        type: 'online/updateState',
        payload: {leftUsers}
      })
    })

    this.waitTimeInterval = setInterval(() => {
      this.waitTime--;
      if (this.waitTime === 0) {
        if (!this.props.online.started && this.props.online.users.length > 1 && this.socket) {
          this.socket.emit("sendStart", {started: true, room: this.room});
        }
      } else if (this.waitTime === -40) {
        if (!this.props.online.started && this.socket)
          this.socket.emit("sendStart", {started: true, room: this.room});
        clearInterval(this.waitTimeInterval);
      }
    }, 1000)
    this.socket.on("started", ({started, room}) => {
      this.beginGame(true);
    })
  };

  stopGame = () => {
    const {dispatch, online} = this.props;
    const {intervalID, opened} = online;
    clearInterval(intervalID);
    clearInterval(this.waitTimeInterval);
    if (this.socket) {
      this.socket.emit('offsocket', {room: this.room, userId: this.userId});
      this.socket.emit('disconnect', {userId: this.userId});
      this.socket.off({userId: this.userId});
      this.socket.close();
      this.socket = null;
    }
    console.log('stop')
    dispatch({
      type: 'online/updateState',
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
        typedCount: 0,
        wpm: 0,
        showResult: false,
        intervalID: undefined,
        users: [],
        started: false,
        textId: '',
        leftUsers: [],
        opened: window.innerWidth <= 576 ? false : opened
      }
    });
  };

  calculateWPM = (time, wordsCount) => {
    return (wordsCount * 60 / time).toFixed();
  };

  beginWriting = () => {
    this.beginTime = new Date().getTime() / 1000;
  };

  componentWillUnmount() {
    this.stopGame();
    console.log('componentWillUnmount')
  }

  finish = () => {
    const {dispatch, online} = this.props;
    const {time, typedTexts, intervalID, constTime, textId} = online;
    clearInterval(intervalID);
    const wpm = this.calculateWPM((new Date().getTime() / 1000) - this.beginTime, typedTexts.filter(i => i.type === 'right').length);
    dispatch({
      type: 'online/updateState',
      payload: {
        showResult: true,
        wpm
      }
    });
    dispatch({type: 'online/createHistoryText', payload: {textId, wpm}});
  };

  handleWpmToSocket = () => {
    const {dispatch} = this.props;
    if (this.socket)
      this.socket.on("wpm", ({userId, wpm, percent}) => {
        dispatch({
          type: 'online/updateState',
          payload: {
            users: this.props.online.users.map(u => {
              return u.id === userId ? {...u, wpm, percent} : u
            })
          }
        })
      });
  };

  beginGame = (started) => {
    this.props.dispatch({
      type: 'online/updateState',
      payload: {started}
    })
    document.getElementById('text-input').focus();
    if (this.props.online.typedCount === 0) {
      this.beginWriting();
    }
  }

  handleRoomDataToSocket = () => {
    if (this.socket)
      this.socket.on('roomData', ({room, users, started, textId}) => {
        const {dispatch} = this.props;
        const TextId = this.props.online.textId;
        if (TextId !== textId) {
          dispatch({type: 'online/getTextById', payload: {path: textId}});
          dispatch({
            type: 'online/updateState',
            payload: {textId}
          })
        }
        if (!started) {
          console.log('raqiblarni kuting');
        } else {
          this.beginGame(started);
        }
        this.room = room;
        let modelUsers = this.props.online.users;
        users.forEach(user => {
          if (modelUsers.find(u => u.id === user.id) === undefined) {
            modelUsers.push({wpm: 0, percent: 0, ...user})
          }
        });
        dispatch({
          type: 'online/updateState',
          payload: {
            users: modelUsers
          }
        })
      });
  };

  render() {
    const {dispatch, online, app} = this.props;
    const {linearObjects, time, pause, isSFPro, resultSection, typedTexts, typingWord, typedCount, showResult, wpm, intervalID, constTime, users, started, leftUsers, opened} = online;
    const {isNightMode} = app;

    const changePause = () => {
      dispatch({
        type: "online/updateState",
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
        type: "online/updateState",
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
      });
      if (window.innerWidth <= 576) {
        openItems();
      }
    };

    const changeValue = (e) => {
      document.getElementsByClassName("typing-focus")[0].scrollIntoView();
      window.scrollBy(0, -300);

      let letter = e.target.value.substr(e.target.value.length - 1, 1);
      var tempLetter = typedTexts[typedCount].text.substr(e.target.value.length - 1, 1);
      if ((tempLetter === "\"" || tempLetter === "“" || tempLetter === "”") && (letter === "\"" || letter === "“" || letter === "”")) {
        e.target.value = e.target.value.substr(0, e.target.value.length - 1) + tempLetter
      } else if ((tempLetter === "'" || tempLetter === "`" || tempLetter === "‘" || tempLetter === "’") && (letter === "'" || letter === "`" || letter === "‘" || letter === "’")) {
        e.target.value = e.target.value.substr(0, e.target.value.length - 1) + tempLetter
      }
      var word = typedCount === typedTexts.length - 1 ? e.target.value : e.target.value.substr(0, e.target.value.length - 1);
      if ((letter === " " && typedTexts.filter(i => i.type === 'none')[0].text.length === word.length) || (typedTexts.length - 1 === typedCount && (typedTexts[typedCount].text.length === word.length))) {
        var tempTypedTexts = typedTexts;
        if (typedTexts[typedCount].text === word) {
          tempTypedTexts[typedCount].type = "right";
        } else {
          tempTypedTexts[typedCount].type = "wrong";
        }
        this.socket.emit("sendWpm", {
          room: this.room,
          userId: this.userId,
          wpm: this.calculateWPM((new Date().getTime() / 1000) - this.beginTime, typedTexts.filter(i => i.type === 'right').length),
          percent: (typedTexts.filter(i => i.type !== 'none').length / typedTexts.length) * 100
        });
        dispatch({
          type: "online/updateState",
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
          type: "online/updateState",
          payload: {
            typingWord: e.target.value
          }
        })
      }
    };
    const keyDown = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        return false;
      }
    };

    const openItems = () => {
      dispatch({
        type: "online/updateState",
        payload: {
          opened: !opened
        }
      })
    };

    return (
      <section id="fast-type"
               className={isNightMode ? "min-h-100 position-relative bg-dark-mode" : "min-h-100 position-relative bg-light-mode"}>
        <UserImage/>
        <div/>
        <Container fluid>
          <div className="d-flex">
            <div>
              {resultSection ? "" :
                <Button color="dark" onClick={this.refreshGame}
                        className={isNightMode ? "btn-refresh bg-light-mode pc-btn" : "btn-refresh bg-dark-mode pc-btn"}>
                  <span className="icon icon-refresh"/>
                </Button>}
            </div>
            <div className={resultSection ? "ml-140" : "ml-66"}>
              <Input type="text"
                     disabled={!started || showResult || pause}
                     className={`type-input fs-45 font-family-bold pt-0 pl-0 h-auto ${isNightMode ? 'night-mode' : ''} ${typedTexts.length > 0 ? (typedTexts.filter(i => i.type === 'none').length > 0 ? (typingWord !== typedTexts.find(i => i.type === 'none').text.substr(0, typingWord.length) ? 'text-danger' : '') : '') : ''}`}
                     autoComplete="off" autoFocus
                     onKeyDown={keyDown}
                     id="text-input"
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
                className={isSFPro ? isNightMode ? "default-text fs-35 text-non-typed-dark font-family-light text-online" : "default-text fs-35 text-non-typed font-family-light text-online" :
                  isNightMode ? "default-text fs-35 text-non-typed-dark font-family-times text-online" : "default-text fs-35 text-non-typed font-family-times text-online"}>
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
          </div>
          <div className={isNightMode ? "online-users night-mode" : "online-users"}>
            {users.map(u => {
              let highScore = Math.max(...users.map(user => user.wpm));

              return (
                <LinearContentHorizontal leftUsers={leftUsers} winner={u.wpm >= highScore && u.wpm > 0}
                                         linearObjects={linearObjects}
                                         user={u}/>
              )
            })}
          </div>
        </Container>
        {started ?
          <div
            className="position-fixed justify-content-center align-items-center online-waiting online-waiting-animated">
            <div className="text-center">
              <h3 className="text-white counter">O'yin boshlandi !</h3>
            </div>
          </div>
          :
          <div className="position-fixed justify-content-center align-items-center online-waiting">
            <div className="text-center">
              <h3 className="text-white">Raqiblaringizning ulanishini kuting...</h3>
              <Spinner className="mt-4" color="white"/>
            </div>
          </div>
        }
        <OpenComponent openItems={openItems} opened={opened} showPause={true} isNightMode={isNightMode} isSFPro={isSFPro}
                       changeFamily={changeFamily} changePause={changePause} changeMode={changeMode} pause={pause}
                       refreshGame={this.refreshGame}/>
      </section>
    );
  }
}

export default Index;
