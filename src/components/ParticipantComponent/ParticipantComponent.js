import React from 'react';
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import Button from "reactstrap/es/Button";
import ButtonGroup from "reactstrap/es/ButtonGroup";
import {connect} from "react-redux";

@connect(({app}) => ({app}))
class ParticipantComponent extends React.Component {
  render() {
    const {dispatch, app} = this.props;
    const {user} = app;
    const rejectWpm = (turnirUserId) => {
      dispatch({
        type: "tournament/rejectWpm",
        payload: {turnirUserId}
      })
    }
    const blockUser = (userId) => {
      dispatch({
        type: "tournament/blockUser",
        payload: {userId}
      })
    }
    console.log(this.props);
    
    return (
      <Row className="fs-16 font-family-light winners">
        <Col xs="7">
          <Row>
            <Col xs="2" className="pr-0 d-flex align-items-center text-center font-family-bold ">
              <span>{this.props.index + 1}</span>
            </Col>
            <Col xs="10" className="d-flex align-items-center">
              <div className="winner-image"
                   style={{backgroundImage: this.props.user.user.image ? `url("${this.props.user.user.image.startsWith('https') ? "" : '/'}${this.props.user.user.image.replace('\\', '/')}")` : 'url("/assets/icons/user.svg")'}}/>
              <div>
                <div>{this.props.user.user.name}</div>
                <div class="color-grey">{this.props.user.user.phoneNumber}</div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs="3">
          <div class="d-flex justify-content-between align-items-center h-100 font-family-bold ">
            <div xs="4" class="">
              <span>{this.props.user.wpm}</span>
            </div>
            <div xs="4">
              {this.props.isFirst ? <span className="icon icon-award"/> : ""}
            </div>
          </div>
        </Col>
        <Col xs="2">
          {user.role === 'Admin' ?
            <ButtonGroup><Button onClick={() => rejectWpm(this.props.user.id)} size={'sm'}>Reject</Button>
              <Button onClick={() => blockUser(this.props.user.user.id)}
                      size={'sm'}>BlockUser</Button></ButtonGroup> : ''}
        </Col>
      </Row>
    );
  }
}

export default ParticipantComponent;
