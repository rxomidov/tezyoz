import React from 'react';
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import ParticipantComponent from "components/ParticipantComponent/ParticipantComponent";
import LazyLoad from 'react-lazyload';

const TournamentResult = (props) => {
  return (
    <div className={`tournament-result w-25 ${props.isMobile ? 'mobile-result' : 'pc-result'}`}>
      <article className="d-flex justify-content-between align-items-center">
        <div>
          <span className="mb-0 font-family-regular fs-18">Qolgan vaqt: </span>
        </div>
        <div>
          <h5
            className="mb-0 fs-20 font-family-bold">{props.leftTime.isExpire ? 'Tugagan' : `Kun: ${props.leftTime.days} | Soat: ${props.leftTime.hours}:${props.leftTime.mins > 9 ? props.leftTime.mins : '0' + props.leftTime.mins}`}</h5>
        </div>
      </article>
      <article className="mt-3">
        <Row className="text-uppercase fs-14 font-family-regular">
          <Col xs='7'>
            <Row>
              <Col xs="2" className="text-center pr-0">
                <span>N</span>
              </Col>
              <Col xs="10">
                <span>foydanaluvchi</span>
              </Col>
            </Row>
          </Col>
          <Col xs="5">
            <Row>
              <Col xs="4">
                <span>WPM</span>
              </Col>
              <Col xs="4">
                {/*<span>So'z</span>*/}
              </Col>
            </Row>
          </Col>
        </Row>
        <LazyLoad>
          {
            props.users.map((user, index) => (
              <ParticipantComponent key={index} index={index} user={user} isFirst={index === 0}/>
            ))
          }
        </LazyLoad>
      </article>
    </div>
  );
};

export default TournamentResult;
