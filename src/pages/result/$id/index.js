import React, {Component} from 'react';
import ResultComponent from 'components/ResultComponent/ResultComponent'
import {connect} from "react-redux";
import Container from "reactstrap/es/Container";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Card from "reactstrap/es/Card";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";
import CardFooter from "reactstrap/es/CardFooter";
import Link from 'umi/Link'

@connect(({result}) => ({result}))
class Index extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: "result/getHistoryById",
      payload: {path: this.props.match.params.id}
    }).then(r => {
      dispatch({
        type: 'result/updateState',
        payload: {title: "Men bir daqiqada " + r.wpm + " ta so'z yoza oldim. Tez yoza olasizmi?"}
      })
    })
  }

  componentWillUnmount() {
    document.title = "TezYoz.uz";
  }

  render() {
    const {dispatch, result} = this.props;
    const {history} = result;
    return (
      <Container className="h-100">
        <Row className="h-100 align-items-center">
          <Col md={{size: 4, offset: 4}}>
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-0">
                <h4 className="text-center font-family-bold">Natija</h4>
              </CardHeader>
              <CardBody>
                <p className="font-family-regular fs-20 text-center">Tezlik: <b>{history.wpm} WPM</b></p>
              </CardBody>
              <CardFooter className="text-center border-0">
                <h5 className="font-family-bold">Siz tezroq yoza olasizmi?</h5>
                <Link to="/sinov" className="text-uppercase font-family-regular text-decoration-none">unda urinib
                  ko'ring</Link>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        {/*<ResultComponent/>*/}
      </Container>
    );
  }
}

export default Index;
