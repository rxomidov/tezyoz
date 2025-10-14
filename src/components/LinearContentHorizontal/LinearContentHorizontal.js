import React from "react";

const LinearContentHorizontal = (props) => {
  return (
    <div className="d-flex align-items-center horizontal-item justify-content-between w-75"
         style={{backgroundColor: (props.leftUsers.includes(props.user.id) ? '#f7e1dd' : '')}}>
      {console.log(props.user, props.leftUsers)}
      <div className="d-flex align-items-center">
        <div>
          <img
            src={props.user.image ? props.user.image.startsWith('https') ? props.user.image : "/" + props.user.image.replace('\\', '/') : "/assets/icons/user.svg"}
            alt=""/>
        </div>
        <div>
          <p className="mb-0 font-family-regular fs-16">{props.user.name}</p>
        </div>

      </div>
      <div className="d-flex align-items-center">
        <div className="horizontal-content mx-auto">
          <div className="linear">
            <div className="d-flex align-items-center">
              <div className="d-flex position-relative">
                {props.linearObjects.map((object, index) => (
                  <div key={index}
                       className={index < props.time ? "linear-item active" : "linear-item"}
                       style={{marginLeft: "11px"}}/>
                ))}
                <div
                  style={{marginLeft: `${props.user.percent}%`}}
                  className="linear-icon linear-user position-absolute rounded-circle d-flex align-items-center justify-content-center">
                  <span className="icon icon-pilot"/>
                </div>
                <div
                  className="linear-icon linear-finish position-absolute rounded-circle d-flex align-items-center justify-content-center">
                  <span className="icon icon-flag"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-6">
          <p className="font-family-bold d-flex mb-0 fs-20 align-items-end position-relative">{props.user.wpm}<span
            className="font-family-regular fs-16 ml-2"> WPM</span> {props.winner ?
            <span className="icon icon-award position-absolute user-award"/> : ''}</p>
        </div>
      </div>
    </div>
  )
};


export default LinearContentHorizontal
