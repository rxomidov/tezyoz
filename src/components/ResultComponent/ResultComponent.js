import React from 'react';
import Button from "reactstrap/es/Button";
import {FacebookShareButton} from 'react-share';
import Link from 'umi/Link';
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Card from "reactstrap/es/Card";
import CardBody from "reactstrap/es/CardBody";
import Progress from "reactstrap/es/Progress";

const ResultComponent = (props) => {
  return (
    <div className="result-section ml-140">
      <h1 className={`fs-30 font-family-bold ${props.isNightMode ? 'text-white' : ''}`}>Sizning natijangiz</h1>

      <Row>
        <Col xl='4' lg='5' md='6' className="col-cll-3">
          <Card>
            <Button className="btn-rr" onClick={() => props.refreshGame()}/>
            <CardBody>
              <div className={`card-wpm position-relative ${props.wpm <= 30 ? 'danger-wpm' : props.wpm > 30 && props.wpm < 60 ? 'warning-wpm' : 'success-wpm'}`}>
                <h3 className="font-family-bold">{props.wpm} <span className="font-family-light">WPM</span></h3>
                <img src="/assets/images/bg-warning.png" alt=""/>
                <div className="wpm-smile" />
              </div>

              <div className="wpm-body">
                <Row className="bg-white shadow-sm mx-0">
                  <Col xs='5' className="pr-0">
                    <p className="mb-0 font-family-regular">{((props.typedTexts.filter(i => i.type === 'right').length / props.typedTexts.length) * 100).toFixed() + " %"} bajarildi</p>
                  </Col>
                  <Col xs='7' className="pl-0">
                    <Progress value={((props.typedTexts.filter(i => i.type === 'right').length / props.typedTexts.length) * 100).toFixed()}/>
                  </Col>
                </Row>

                <Row className="mx-0 my-4">
                  <Col xs='6' className="text-center pl-0 pr-2">
                    <div className="bg-white shadow-sm rounded py-3">
                      <h5 className="font-family-bold fs-25 right">{props.typedTexts.filter(i => i.type === 'right').length}</h5>
                      <span className="font-family-regular fs-15">To'g'ri</span>
                    </div>
                  </Col>
                  <Col xs='6' className="text-center pr-0 pl-2">
                    <div className="bg-white shadow-sm rounded py-3">
                      <h5 className="font-family-bold fs-25 wrong">{props.typedTexts.filter(i => i.type === 'wrong').length}</h5>
                      <span className="font-family-regular fs-15">Noto'g'ri</span>
                    </div>
                  </Col>
                </Row>
                {props.historyTextId ? (props.historyTextId === 'not' ? '' : <FacebookShareButton
                    url={"http://tezyoz.uz/result/" + props.historyTextId}
                    children={<Button block className="fs-16 font-family-medium face"><span
                      className="icon icon-facebook icon-white"/> Sahifamda
                      bo'lishish</Button>} className="ml-0"/>) :
                  <Link to={'/signup'}>{'Ma\'lumotlaringiz saqlanib qolishi uchun ro\'yxatdan o\'ting'}</Link>}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/*<Row className="res">*/}
      {/*<Col md='4' className="d-flex align-items-center">*/}
      {/*    <div className="result-circle">*/}
      {/*      <div className="result-circle-child shadow-lg d-flex justify-content-center align-items-center">*/}
      {/*        <div>*/}
      {/*          <h6 className="font-family-heavy fs-54 text-center mb-0">{props.wpm}</h6>*/}
      {/*          <p className="font-family-regular fs-38 text-center mb-0">WPM</p>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </Col>*/}
      {/*  <Col md='6'>*/}
      {/*    <div className="d-flex">*/}
      {/*      <div>*/}
      {/*    <span*/}
      {/*      className="right-typed fs-35 font-family-light">{props.typedTexts.filter(i => i.type === 'right').length}</span>*/}
      {/*        <p className="result-text fs-35 font-family-light">To'g'ri yozilgan</p>*/}
      {/*      </div>*/}
      {/*      <div>*/}
      {/*    <span*/}
      {/*      className="wrong-typed fs-35 font-family-light">{props.typedTexts.filter(i => i.type === 'wrong').length}</span>*/}
      {/*        <p className="result-text fs-35 font-family-light">Noto'g'ri yozilgan</p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="mt-72 d-flex">*/}
      {/*      <div className="">*/}
      {/*    <span*/}
      {/*      className={`typed fs-35 font-family-light ${props.isNightMode ? 'text-white' : ''}`}>{((props.typedTexts.filter(i => i.type === 'right').length / props.typedTexts.length) * 100).toFixed() + " %"}</span>*/}
      {/*        <p className="result-text fs-35 font-family-light">Bajarildi</p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
    </div>
  );
};

export default ResultComponent;
