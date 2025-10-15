import React, {useState} from "react";
import Link from 'umi/Link'
import Navbar from "reactstrap/es/Navbar";
import Container from "reactstrap/es/Container";
import NavbarBrand from "reactstrap/es/NavbarBrand";
import NavbarToggler from "reactstrap/es/NavbarToggler";
import Collapse from "reactstrap/es/Collapse";
import Nav from "reactstrap/es/Nav";
import NavItem from "reactstrap/es/NavItem";
import UserImage from 'components/UserImage/UserImage'

const NavigationBar = (props) => {

  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <Navbar color="faded"  expand="lg"
            className={`p-lg-0 py-3 w-100 ${props.pathname === '/' ? 'home-navbar navbar-dark' : 'navbar-light'} ${props.nightMode ? 'navbar-night-mode' : 'navbar-light-mode'} ${props.pathname === '/' ? 'bg-transparent' : ''}`}>
      <Container fluid>
        <NavbarBrand>
          {props.pathname === '/' ?
            <div><Link to='/' className="position-relative d-block nav-brand"><img
              src="/assets/images/logo-sign.png" alt=""/></Link>
            </div> :
            <Link to="/"><img src="/assets/images/logo.png" alt="" width="200"/></Link>}
        </NavbarBrand>
          <NavbarToggler onClick={toggleNavbar} className="mr-2"/>
        <Collapse isOpen={!collapsed} navbar className={props.pathname === '/' ? 'home-collapse' : ''}>
          <Nav navbar className={'text-uppercase'}>
            <NavItem>
              <Link onClick={window.innerWidth <= 991 ? toggleNavbar : ''} to="/sinov"
                    className={`font-family-medium fs-16 nav-link ${props.pathname === "/sinov" ? 'active' : ''} ${props.pathname === '/' ? 'text-white' : ''}`}>Sinov
                rejimi</Link>

            </NavItem>
            <NavItem>
              <Link onClick={window.innerWidth <= 991 ? toggleNavbar : ''} to="/online"
                    className={`font-family-medium fs-16 nav-link ${props.pathname === "/online" ? 'active' : ''} ${props.pathname === '/' ? 'text-white' : ''}`}>Online
                Bellashuv</Link>
            </NavItem>
            <NavItem>
              <Link onClick={window.innerWidth <= 991 ? toggleNavbar : ''} to="/musobaqa"
                    className={`font-family-medium fs-16 nav-link ${props.pathname === "/musobaqa" ? 'active' : ''} ${props.pathname === '/' ? 'text-white' : ''}`}>Musobaqa</Link>
            </NavItem>
            <NavItem>
              <Link onClick={window.innerWidth <= 991 ? toggleNavbar : ''} to="/help"
                    className={`font-family-medium fs-16 nav-link ${props.pathname === "/help" ? 'active' : ''} ${props.pathname === '/' ? 'text-white' : ''}`}>Yordam</Link>
            </NavItem>
            {props.user.role === 'Admin' ? <NavItem>
              <Link onClick={window.innerWidth <= 991 ? toggleNavbar : ''} to="/admin/text"
                    className={`font-family-medium fs-16 nav-link ${props.pathname === "/admin/text" ? 'active' : ''} ${props.pathname === '/' ? 'text-white' : ''}`}>Admin</Link>
            </NavItem> : ''}
            {props.pathname === '/' ?
              <NavItem>
                <a href='/uploads/TezYozSetup1.0.0.exe' onClick={window.innerWidth <= 991 ? toggleNavbar : ''}
                      className={`font-family-medium fs-16 nav-link ${props.pathname === '/' ? 'text-white' : ''}`}>Offline versiyani yuklab olish</a>
              </NavItem>
              : ""
            }
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  )
};

export default NavigationBar
