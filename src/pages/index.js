import React from 'react'
import {Button, Container} from "reactstrap";
import Link from 'umi/Link'
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Nav from "reactstrap/es/Nav";
import NavItem from "reactstrap/es/NavItem";
import {connect} from "react-redux";

@connect(({app}) => ({app}))
class Index extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: "app/me",
      payload: {}
    })
  }

  render() {
    const {app} = this.props;
    const {user} = app;

    return (
      <section id="home" className="position-relative pt-144">
        <div className="home-overlay"/>
        <Container fluid>

          <Row>
            <Col lg='3' className="col-xll-2 d-lg-block d-none">
              <Nav vertical className="home-icons">
                <NavItem>
                  <Link to="/sinov" className="text-uppercase text-white fs-16 font-family-medium nav-link"><span
                    className="icon icon-load icon-white"/> <span
                    className="nav-text position-relative">Sinov rejimi</span></Link>
                </NavItem>
                <NavItem>
                  <Link to="/online" className="text-uppercase text-white fs-16 font-family-medium nav-link"><span
                    className="icon icon-online icon-white"/><span className="nav-text position-relative">Online bellashuv</span></Link>
                </NavItem>
                <NavItem>
                  <Link to="/musobaqa" className="text-uppercase text-white fs-16 font-family-medium nav-link"><span
                    className="icon icon-tournaments icon-white"/><span
                    className="nav-text position-relative">musobaqa</span></Link>
                </NavItem>
                <NavItem>
                  <Link to="/help" className="text-uppercase text-white fs-16 font-family-medium nav-link"><span
                    className="icon icon-help icon-white"/><span
                    className="nav-text position-relative">yordam</span></Link>
                </NavItem>
                <NavItem>
                  <Link to={user.id ? "/history" : "/signin"}
                        className="text-uppercase text-white fs-16 font-family-medium nav-link"><span
                    className="icon icon-sign icon-white"/><span
                    className="nav-text position-relative">{user.id ? user.firstname : "Kirish"}</span></Link>
                </NavItem>
                <NavItem>
                  <a href='/uploads/TezYozSetup1.0.0.exe' className="text-uppercase text-white fs-16 font-family-medium nav-link"><span
                    className="icon icon-download icon-white"/><span
                    className="nav-text position-relative">offline versiyani yuklab olish</span></a>
                </NavItem>
              </Nav>
            </Col>
            <Col lg='9' className="col-xll-10">
              <div>
                <h1
                  className="font-family-semi-bold fs-61 text-center text-white position-relative">Bexato yozishni <br/> bugundan boshlang!</h1>
                <p className="font-family-regular fs-24 mt-3 text-center text-white position-relative">O‘zbek tilida imloviy xatolarsiz tez yozishni
                  uddalay olasizmi?<br/>
                  TezYoz yordamida savodxonligingizni <br/> bir qo‘l tekshirib ko‘ring!</p>
                <div className="d-flex justify-content-center position-relative">
                  <Link to="/sinov"><Button className="fs-18 mt-4 font-family-medium shadow-sm" color="light">Sinab
                    ko'rish</Button></Link>
                  <Link to="/musobaqa" className="pl-3 pl-md-4"><Button
                    className="fs-18 mt-4 font-family-medium ml-md-3 ml-0 shadow-sm"
                    color="warning">Musobaqada ishtirok etish</Button></Link>
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row our-sponsor  justify-content-center position-relative">
                <div className="d-none d-md-block text-center">
                  <p className="text-center text-white fs-14 font-family-regular">Loyiha O`zbekiston Respublikasi
                    Prezidentning <br/> 5 tashabbusi doirasida amalga oshirildi</p>
                  <Link><img src="/assets/images/five-way.png" width='79'/></Link>
                </div>
                <div className="d-none d-md-block ml-50 text-center">
                  <p className="text-center text-white fs-14 font-family-regular">Loyiha tashkilotchilari</p>
                  <a href='https://yoshlar.gov.uz/'><img src="/assets/images/yia-uz.svg" width='135'/></a>
                  <a href='https://yoshlarittifoqi.uz' style={{marginLeft:"30px"}}><img src="/assets/images/yi.png" width='135'/></a>
                  <a href='https://www.uzedu.uz' style={{marginLeft:"30px"}}><img src="/assets/images/xalq-talim.png" width='73'/></a>
                </div>
                {/*<div className="d-none d-md-block text-center ml-50">*/}
                {/*  <p className="text-center text-white fs-14 font-family-regular">Bizning hamkor</p>*/}
                {/*  <a href='https://www.uzedu.uz'><img src="/assets/images/xalq-talim.png" width='73'/></a>*/}
                {/*</div>*/}
                <div className="d-flex d-md-none flex-column align-items-center">
                  <div className="text-center">
                    <p className="text-center text-white fs-14 font-family-regular">Loyiha O`zbekiston Respublikasi
                      Prezidentning <br/> 5 tashabbusi doirasida amalga oshirildi</p>
                    <Link><img src="/assets/images/five-way.png" width='79'/></Link>
                  </div>
                  <div className="text-center">
                    <p className="text-center text-white fs-14 font-family-regular">Loyiha tashkilotchilari</p>
                    <a href='https://yoshlar.gov.uz/'><img src="/assets/images/yia-uz.svg" width='135'/></a>
                    <a href='https://yoshlarittifoqi.uz' style={{marginLeft:"30px"}}><img src="/assets/images/yi.png" width='135'/></a>
                    <a href='https://www.uzedu.uz' style={{marginLeft:"30px"}}><img src="/assets/images/xalq-talim.png" width='73'/></a>
                  </div>
                  {/*<div className="text-center">*/}
                  {/*  <p className="text-center text-white fs-14 font-family-regular">Bizning hamkor</p>*/}
                  {/*  <a href='https://www.uzedu.uz'><img src="/assets/images/xalq-talim.png" width='73'/></a>*/}
                  {/*</div>*/}
                </div>
              </div>
            </Col>
          </Row>
        </Container>

      </section>
    );
  }
}

export default Index
