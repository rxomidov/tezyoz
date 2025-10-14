import React from 'react';
import Button from "reactstrap/es/Button";

const OpenComponent = (props) => {
  return (
    <div>
      <Button className="rounded-0 open-btn" onClick={props.openItems}><span  className="icon icon-text icon-white"/></Button>
      <div className={`open-item ${props.opened ? 'opened' : ''}`}>
        <Button color="dark" onClick={props.refreshGame}
                className={`btn-refresh ${props.isNightMode ? "bg-light-mode" :"bg-dark-mode"} `}>
          <span className="icon icon-refresh"/>
        </Button>
        <div
          className={props.isNightMode ? "button-group text-center d-flex night-mode mt-3" : "button-group text-center d-flex light-mode mt-3"}>
          <Button
            className={props.isSFPro ? props.isNightMode ? "padding font-family-semi-bold fs-16 active-btn night-mode" : "padding font-family-semi-bold fs-16 active-btn light-mode" :
              props.isNightMode ? "padding font-family-semi-bold fs-16 night-mode" : "padding font-family-semi-bold fs-16 light-mode"}
            color="light" onClick={() => props.changeFamily(true)}>
            T
          </Button>
          <Button
            className={props.isSFPro ? props.isNightMode ? "padding font-family-times fs-16 night-mode" : "padding font-family-times fs-16 light-mode" : props.isNightMode ? "padding font-family-times fs-16 active-btn night-mode" :
              "padding font-family-times fs-16 active-btn light-mode"}
            color="light"
            onClick={() => props.changeFamily(false)}>
            T
          </Button>
        </div>
        <div
          className={props.isNightMode ? "button-group text-center night-mode" : "button-group text-center light-mode"}>
          <Button color="light" className={props.isNightMode ? "night-mode" : "light-mode active-btn"}
                  onClick={() => props.changeMode(false)}>
            <span className="icon icon-sun"/>
          </Button>
          <Button color="light" onClick={() => props.changeMode(true)}
                  className={props.isNightMode ? "active-btn night-mode" : "light-mode"}>
            <span className="icon icon-moon"/>
          </Button>
        </div>
        {props.showPause ? <div
          className={props.isNightMode ? "button-group text-center night-mode" : "button-group text-center light-mode"}>
          <Button color="light" onClick={props.changePause}
                  className={props.pause ? props.isNightMode ? "active-btn night-mode" : "active-btn light-mode" : props.isNightMode ? "night-mode" : "light-mode"}>
            <span className="icon icon-coffee"/>
          </Button>
        </div> : ""}
      </div>
    </div>
  );
};

export default OpenComponent;
