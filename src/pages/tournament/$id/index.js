import React, {Component} from 'react';
import Container from "reactstrap/es/Container";
import Button from "reactstrap/es/Button";
import LinearContent from 'components/LinearContent/LinearContent'
import Input from "reactstrap/es/Input";
import {connect} from "react-redux";
import ResultComponent from 'components/ResultComponent/ResultComponent'
import TournamentResult from 'components/TournamentResult/TournamentResult'
import UserImage from 'components/UserImage/UserImage'
import router from "umi/router";
import OpenComponent from "components/OpenComponent/OpenComponent";
import io from "socket.io-client";
import LazyLoad from 'react-lazyload';
import {toast} from "react-toastify";

@connect(({tournament, app}) => ({tournament, app}))
class Index extends Component {

  socket;
  room;
  ENDPOINT = "tezyoz.uz";
  userId;

  componentDidMount() {
    document.oncontextmenu = document.body.oncontextmenu = function () {
      return false;
    };
    const {dispatch, tournament} = this.props;
    dispatch({
      type: 'app/me'
    }).then(user => {
      if (user.success) {
        this.userId = user.id;
        this.socket = io(this.ENDPOINT, {query: "id=" + this.userId + "&turnirId=" + this.props.match.params.id});
        this.room = user.id + this.props.match.params.id;
        dispatch({type: 'tournament/getTournament', payload: {path: this.props.match.params.id}});
        // dispatch({
        //   type: 'tournament/updateState',
        //   payload: {
        //     showLeftTime: setInterval(() => {
        //      this.showEventDate()
        //     })
        //   }
        // });
        // this.showEventDate();
        if (this.socket) {
          this.socket.on('turnirUserId', ({id}) => {
            dispatch({type: 'tournament/updateState', payload: {turnirUserId: id}})
          })
          this.socket.on('wpm', (payload) => {
            if (payload.realWpm) toast.error("Bu yozuv tezligingizga ishonchingiz komil bo'lsa adminga murojaat qiling.")
            dispatch({type: 'tournament/updateState', payload: {wpm: payload.wpm, showResult: true}})
          })
        }
      } else {
        router.push('/signin')
      }
    })
  }

  refreshGame = () => {
    const {dispatch, tournament} = this.props;
    const {intervalID, opened} = tournament;
    clearInterval(intervalID);
    dispatch({
      type: 'tournament/updateState',
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
        turnirUserId: "",
        typingWord: "",
        typedCount: 0,
        wpm: 0,
        showResult: false,
        intervalID: undefined,
        opened: window.innerWidth <= 576 ? false : opened
      }
    });
    dispatch({type: 'tournament/getTournament', payload: {path: this.props.match.params.id}});
  };

  beginWriting = () => {
    const {dispatch, tournament, showLeftTime} = this.props;
    const {intervalID} = tournament;
    if (!intervalID) {
      this.socket.emit("sendBeginTurnir", {turnirId: this.props.match.params.id, userId: this.userId})
      dispatch({
        type: 'tournament/beginWrite',
        payload: {turnirId: this.props.match.params.id}
      })
      dispatch({
        type: 'tournament/updateState',
        payload: {
          intervalID: setInterval(() => {
            this.tick()
          }, 1000),
          // showLeftTime: setInterval(() => {
          //   this.showEventDate()
          // })
        }
      });
    }
    // if (!showLeftTime) {
    //   dispatch({
    //     type: 'tournament/updateState',
    //     payload: {
    //       showLeftTime: setInterval(() => {
    //         this.showEventDate()
    //       }, 1000)
    //     }
    //   })
    // }
  }

  componentWillUnmount() {
    const {dispatch, tournament} = this.props;
    const {intervalID, showLeftTime} = tournament;
    clearInterval(intervalID);
    clearInterval(showLeftTime);
    dispatch({
      type: 'tournament/updateState',
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
        turnirUserId: "",
        typedCount: 0,
        wpm: 0,
        showResult: false,
        intervalID: undefined,
        showLeftTime: undefined,
        expireTime: "",
        leftTime: {}
      }
    });
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  finish = () => {
    const {dispatch, tournament, app} = this.props;
    const {time, typedTexts, intervalID, constTime, tournamentInfo, turnirUserId} = tournament;
    const {user} = app
    clearInterval(intervalID);
    this.socket.emit("sendEndTurnir", {turnirUserId, room: this.room})
    dispatch({
      type: 'tournament/endWrite',
      payload: {turnirUserId}
    })
  };

  tick() {
    const {dispatch, tournament} = this.props;
    const {time, pause} = tournament;
    if (time === 1) {
      this.finish();
    } else {
      if (!pause) {
        dispatch({
          type: "tournament/updateState",
          payload: {
            time: time - 1
          }
        });
      }
    }
  }

  // showEventDate = () => {
  //   const {dispatch, tournament} = this.props;
  //   const {expireTime} = tournament;
  //   console.log(expireTime)
  //   // let eventDate = startTime;
  //   let dateString = expireTime;
  //   let date1 = new Date(dateString).getTime();
  //   var date2 = new Date().getTime();
  //   var msec = date1 - date2;
  //
  //   var mins = Math.floor(msec / 60000);
  //   var hrs = Math.floor(mins / 60);
  //   mins = mins % 60;
  //   var days = Math.floor(hrs / 24);
  //   hrs = hrs % 24;
  //   // return days + " " + <FormattedMessage id="DAY"/> + hrs + " " + <FormattedMessage id="HOUR"/>
  //   // return {
  //   //   days: days,
  //   //   hours: hrs,
  //   //   mins: mins
  //   // }
  //   if (msec < 0) {
  //     dispatch({
  //       type: "tournament/updateState",
  //       payload: {
  //         leftTime: {
  //           days: days,
  //           hours: hrs,
  //           mins: mins,
  //           isExpire: true
  //         }
  //       }
  //     })
  //   } else {
  //     dispatch({
  //       type: "tournament/updateState",
  //       payload: {
  //         leftTime: {
  //           days: days,
  //           hours: hrs,
  //           mins: mins,
  //           isExpire: false
  //         }
  //       }
  //     })
  //   }
  // };

  render() {
    const {dispatch, tournament, app} = this.props;
    const {
      linearObjects, time, pause, isSFPro, resultSection, typedTexts, typingWord, typedCount, showResult, wpm,
      intervalID, tournamentInfo, startTime, tournamentUsers, constTime, expireTime, leftTime, opened, turnirUserId
    } = tournament;
    const {isNightMode} = app;

    const changePause = () => {
      dispatch({
        type: "tournament/updateState",
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
        type: "tournament/updateState",
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
      if (typedCount === 0) {
        this.beginWriting();
      }
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
        this.socket.emit("sendWordTurnir", {word, turnirUserId});
        // dispatch({
        //   type: 'tournament/writeWord',
        //   payload: {word, turnirUserId}
        // })
        dispatch({
          type: "tournament/updateState",
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
          type: "tournament/updateState",
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
        type: "tournament/updateState",
        payload: {
          opened: !opened
        }
      })
    };


    return (
      <section id="fast-type"
               className={isNightMode ? "min-h-100 position-relative bg-dark-mode" : "min-h-100 position-relative bg-light-mode"}>
        <UserImage/>
        {!showResult ?
          <Container fluid>
            <div className="d-flex">
              <div className="pc-btn">
                {resultSection ? "" :
                  <Button color="dark" onClick={this.refreshGame}
                          className={isNightMode ? "btn-refresh bg-light-mode" : "btn-refresh bg-dark-mode pc-btn"}>
                    <span className="icon icon-refresh"/>
                  </Button>}
                {resultSection ? "" :
                  <div className="mt-47">
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
                  </div>
                }
              </div>
              <div className={resultSection ? "ml-140 w-50" : "ml-66 w-50"}>
                <h4
                  className={`fs-18 font-family-semi-bold text-uppercase mb-1 tournament-info ${isNightMode ? 'night' : 'light'}`}>{tournamentInfo.name}</h4>
                <p
                  className={`fs-14 font-family-regular mb-0 tournament-info ${isNightMode ? 'night' : 'light'}`}>Boshlangan
                  vaqt: {startTime}</p>
                <div className={resultSection ? "ml-140 mt-47 pr-3" : "mt-47 pr-3"}>
                  <Input type="text"
                         className={`type-input fs-45 font-family-bold pt-0 pl-0 h-auto ${isNightMode ? 'night-mode' : ''} ${typedTexts.length > 0 ?
                           (!!typedTexts.find(i => i.type === 'none') ?
                             (typingWord !== typedTexts.find(i => i.type === 'none').text.substr(0, typingWord.length) ? 'text-danger' : '') : '') : ''}`}
                         autoComplete="off" autoFocus
                         onKeyDown={keyDown}
                         disabled={leftTime.isExpire}
                         onChange={changeValue} value={typingWord}/>
                  <p
                    className={isSFPro ? isNightMode ? "default-text fs-35 text-non-typed-dark font-family-light  mt-47" : "default-text fs-35 text-non-typed font-family-light mt-47" :
                      isNightMode ? "default-text fs-35 text-non-typed-dark font-family-times mt-47" : "default-text fs-35 text-non-typed font-family-times mt-47"}
                    style={{userSelect: "none"}}>
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
                  <LinearContent time={time} linearObjects={linearObjects} constTime={constTime}
                                 className="tournament-linear"/>
                </div>
              </div>
              <LazyLoad>
                <TournamentResult isMobile={false} users={tournamentUsers} leftTime={leftTime}/>
              </LazyLoad>
            </div>
            <div className="d-flex mt-47">

            </div>
            <LazyLoad>
              <TournamentResult isMobile={true} users={tournamentUsers} leftTime={leftTime}/>
            </LazyLoad>
          </Container> : <Container fluid>
            <ResultComponent wpm={wpm} isNightMode={isNightMode} typedTexts={typedTexts} refreshGame={this.refreshGame}
                             historyTextId={'not'}/>
          </Container>}
        {/*<Button onClick={showEventDate}>Click</Button>*/}
        <OpenComponent openItems={openItems} opened={opened} isNightMode={isNightMode} isSFPro={isSFPro}
                       changeFamily={changeFamily} changePause={changePause} showPause={false} changeMode={changeMode}
                       pause={pause} refreshGame={this.refreshGame}/>

      </section>
    );
  }
}

export default Index;
