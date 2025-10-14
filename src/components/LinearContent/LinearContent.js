import React from "react";

const LinearContent = (props) => {
  return (
    <div className={`linear-content ${props.className}`}>
      <div className="linear position-relative">
        <div className="linear-icon linear-finish position-absolute rounded-circle d-flex align-items-center justify-content-center">
          <span className="icon icon-flag"/>
        </div>
        <div className="linear-item finish"/>
        {props.linearObjects.map((object, index) => (
          <div key={index}
               className={`linear-item position-absolute ${index === parseInt((props.time - 1) * 31 / props.constTime) ? 'active' : ''} ${index >= parseInt((props.time - 1) * 31 / props.constTime) && index > 15 ? 'green' : index >= parseInt((props.time - 1) * 31 / props.constTime) && index <= 15 && index > 7 ? 'yellow' : index >= parseInt((props.time - 1) * 31 / props.constTime) && index <= 7 ? 'red' : ''}`}
               style={{top: index * 11, right: 0}}/>
        ))}
        <div className="linear-icon linear-user position-absolute rounded-circle d-flex align-items-center justify-content-center" style={{top: (props.time - 1) * (11 * (29 / props.constTime)
          )}}>
          <span className="icon icon-pilot"/>
        </div>
        <div className="time" style={{bottom: 0-(props.linearObjects.length + 7) * 11}}>
          <p className="fs-35 font-family-light">{parseInt(props.time / 60) > 9 ? parseInt(props.time / 60) : "0" + parseInt(props.time / 60)}:{props.time % 60 > 9 ? props.time % 60 : "0" + props.time % 60}</p>
        </div>
      </div>
    </div>
  )
};


export default LinearContent
