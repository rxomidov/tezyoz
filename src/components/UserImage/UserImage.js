import React, {Component} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import Link from 'umi/Link'
import {connect} from "react-redux";
import router from "umi/router";

@connect(({app}) => ({app}))
class UserImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    }
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: "app/me",
      payload: {}
    })
  }

  render() {
    const {dispatch, app} = this.props;
    const {user} = app;

    const toggle = () => {
      if (user.id) {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        })
      } else {
        goLogin();
      }
    };

    const goLogin = () => {
      router.push('/signin')
    };

    const logOut = () => {
      localStorage.clear();
      dispatch({
        type: "app/me",
        payload: {}
      });
      dispatch({
        type: "app/updateState",
        payload: {
          user: {}
        }
      })
      goLogin();
    };
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={toggle} className={`user-image ${user.id ? '' : 'non-signed'}`}
                style={{
                  backgroundImage: user.image ? `url('${user.image.startsWith('https') ? '' : '/'}${user.image.replace('\\', '/')}')` : "url('/assets/icons/user.svg')",
                  backgroundSize: user.image ? "100%" : "44%"
                }}>
        {this.props.pathname === '/' && !user.id ?
          <p className="fs-16 font-family-medium text-uppercase text-right mb-0">Kirish</p> : ''}
        <DropdownToggle/>
        <DropdownMenu right className="border-0 shadow-lg">
          <Link className="text-decoration-none" to="/settings"><DropdownItem>Profil sozlamalari</DropdownItem></Link>
          <Link className="text-decoration-none" to="/history"><DropdownItem>Sinovlar tarixi</DropdownItem></Link>
          <DropdownItem onClick={logOut}>Chiqish</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default UserImage;
