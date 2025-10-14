import React from 'react';
import Col from "reactstrap/es/Col";
import Card from "reactstrap/es/Card";
import Row from "reactstrap/es/Row";

const HistoryComponent = (props) => {
  return (
    <Row className="mt-3">
      <Col md="12">
        <Card className="border-0 card-shadow">
          <Row>
            <Col md="10">
              <p className="mb-0 font-family-regular fs-14">{props.history.text}</p>
            </Col>
            <Col md="1">
              <p className="font-family-bold fs-14 mb-0">{props.history.wpm} WPM</p>
            </Col>
            <Col md="1">
              <p className="font-family-regular fs-14 mb-0">{props.history.createdAt.substr(0, 10)}</p>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default HistoryComponent;
