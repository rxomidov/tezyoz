import React, {Component} from 'react';
import Container from "reactstrap/es/Container";
import Row from "reactstrap/es/Row";
import Button from "reactstrap/es/Button";
import TournamentComponent from "components/TournamentComponent/TournamentComponent";
import {connect} from "react-redux";
import UserImage from 'components/UserImage/UserImage'
import router from "umi/router";
import {toast} from "react-toastify";

@connect(({tournaments, app}) => ({tournaments, app}))
class Index extends Component {
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'app/me'
    }).then(res=>{
      if(res.success){
        dispatch({
          type: "tournaments/getTournaments",
          payload: {page: 0}
        })
      }else{
        // toast.error("Qatnashish uchun ro'yhatdan o'ting");
        router.push('/signin')
      }
    })

  }
  componentWillUnmount() {
    const {dispatch} = this.props;

    dispatch({
      type: "tournaments/updateState",
      payload: {
        tournamentList: [],
        page: 0
      }
    })
  }

  render() {
    const {tournaments, app, dispatch} = this.props;
    const {tournamentList, page, totalPages} = tournaments;
    const {isNightMode} = app;

    const getNextPage = () => {
      dispatch({
        type: 'tournaments/getTournaments',
        payload: {page: page + 1}
      })
    };

    return (
      <section id="tournament" className={`position-relative min-h-100 ${isNightMode ? 'bg-dark-mode': 'bg-light-mode'}`}>
        <UserImage />
        <Container fluid>
          <Row>
            {tournamentList.map(item => (
              <TournamentComponent tournament={item}/>
            ))}
          </Row>
          {totalPages - 1 === page ? '' : <Button className="text-uppercase fs-14 font-family-regular py-3 mt-5" color="dark" block onClick={getNextPage}>yana yuklash</Button> }
        </Container>
      </section>
    );
  }
}

Index.propTypes = {};

export default Index;
