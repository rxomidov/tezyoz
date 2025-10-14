import React from 'react';
import Container from "reactstrap/es/Container";
import Row from "reactstrap/es/Row";
import Link from "umi/Link";
import router from "umi/router";
import {connect} from "react-redux";

@connect(({app}) => ({app}))
class AdminLayout extends React.Component {
  render() {
    const logout = () => {
      const {dispatch} = this.props;
      dispatch({
        type: "app/updateState",
        payload: {
          user:{}
        }
      });
      localStorage.clear();

      router.push('/')
    };
    return (
      <section id="admin-layout">
        <Container fluid>
          <Row>
            <div className="col-12 col-lg-3 col-xl-3">
              <div className="card border-0">
                <ul className="nav flex-column h-100">
                  <li className={`nav-item py-1 ${this.props.pathname === '/admin/text' ? 'active' : ''}`}>
                    <Link to='/admin/text' className="nav-link font-family-regular fs-16">
                      <span className="icon icon-text mr-3" />
                      Matnlar bilan ishlash
                    </Link>
                  </li>
                  <li className={`nav-item py-1 ${this.props.pathname === '/admin/tournaments' ? 'active' : ''}`}>
                    <Link to='/admin/tournaments' className="nav-link font-family-regular fs-16">
                      <span className="icon icon-award mr-3" />
                      Musobaqa
                    </Link>
                  </li>
                  <li className={`nav-item py-1 ${this.props.pathname === '/admin/users' ? 'active' : ''}`}>
                    <Link to='/admin/users' className="nav-link">
                      <span className="icon icon-users mr-3" />
                      Rollarni boshqarish
                    </Link>
                  </li>
                  <li className={`nav-item py-1 ${this.props.pathname === '/admin/tournaments' ? 'active' : ''}`}>
                    <Link onClick={logout} className="nav-link font-family-regular fs-16">
                      <span className="icon icon-logout mr-3" />
                      Chiqish
                    </Link>

                    <div className="user-info d-flex">
                      <div>
                        <img src={this.props.user.image ? this.props.user.image.startsWith('https') ? this.props.user.image : '/' +  this.props.user.image.replace('\\', '/') : "/assets/icons/user.svg"} className="rounded-circle" alt=""/>
                      </div>
                      <div>
                        <h6 className="mb-0 fs-18 font-family-bold">{this.props.user.firstname} {this.props.user.lastname}</h6>
                        <p className="mb-0 fs-14 font-family-regular">{this.props.user.role}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 col-lg-9 col-xl-9">
              {this.props.children}
            </div>
          </Row>
        </Container>
      </section>
    );
  }
};

export default AdminLayout;
