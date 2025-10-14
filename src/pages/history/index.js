import React, {Component} from 'react';
import Container from "reactstrap/es/Container";
import {connect} from "react-redux";
import HistoryComponent from 'components/HistoryComponent/HistoryComponent';
import UserImage from 'components/UserImage/UserImage'
import Button from "reactstrap/es/Button";
@connect(({history}) => ({history}))
class Index extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: "history/getHistoryList",
      payload: {page: 0}
    })
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: "history/updateState",
      payload: {
        historyList: [],
        page: 0
      }
    })
  }

  render() {
    const {dispatch, history} = this.props;
    const {historyList, page, finished} = history;

    const getNextPage = () => {
      dispatch({
        type: 'history/getHistoryList',
        payload: {page: page + 1}
      })
    };

    return (
      <section id="history" className="position-relative bg-white min-h-100 pb-5">
        <UserImage />
        <Container fluid>
          <h4 className="font-family-heavy fs-20 text-uppercase">Sinovlar tarixi</h4>
          {historyList.map(item => (
            <HistoryComponent history={item}/>
          ))}
          {historyList.length === 0 || finished ?  "" : <Button className="text-uppercase fs-14 font-family-regular py-3 mt-5" color="dark" block onClick={getNextPage}>yana yuklash</Button>}
          {historyList.length === 0 ? <h4 className="font-family-heavy fs-24 text-center">Sizda saqlangan natijalar mavjud emas.</h4> : ""}
        </Container>
      </section>
    );
  }
}

export default Index;
