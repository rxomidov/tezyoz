import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import {connect} from "react-redux";
import {ToastContainer} from 'react-toastify';
import AdminLayout from "../components/AdminLayout/AdminLayout";
import Link from "umi/Link";

@connect(({app}) => ({app}))
class BasicLayout extends React.Component {


  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'app/me',
      payload: {}
    })
  }

  render() {
    const homeStyle = {
      backgroundImage: "url('/assets/images/bg.png')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "100% 100%",
      backgroundAttachment: "fixed"
    };

    const {dispatch, app} = this.props;
    const {isNightMode, user} = app;
    return (
      <div className="h-100" style={this.props.location.pathname === '/' ? homeStyle : {}}>
        <ToastContainer/>
        {this.props.location.pathname !== '/signin' && this.props.location.pathname !== '/signup' ? <NavigationBar nightMode={isNightMode} pathname={this.props.location.pathname} user={user}/> : ''}
        <main className={`h-100 ${isNightMode ? 'navbar-night-mode' : 'navbar-light-mode'} ${this.props.location.pathname === '/' ? 'bg-transparent' : ''} ${this.props.location.pathname === '/signin' || this.props.location.pathname === '/signup' ? 'pt-0' : ''}`}>
          {/*{this.props.location.pathname.includes('admin') ?*/}
          {/*  <AdminLayout pathname={this.props.location.pathname}>*/}
          {this.props.children}
          {/*</AdminLayout> : this.props.children*/}
          {/*}*/}
        </main>
      </div>
    );
  }
}

export default BasicLayout;
