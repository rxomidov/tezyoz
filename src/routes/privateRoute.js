import React, {Component} from 'react';
import {connect} from "react-redux";
import router from "umi/router";
import AdminLayout from "../components/AdminLayout/AdminLayout";

@connect(({app}) => ({app}))
class PrivateRoute extends Component {
  componentDidMount() {
    const {dispatch, app} = this.props;
    const {user} = app;
    dispatch({
      type: 'app/me'
    }).then(user => {
      if (user.role !== 'Admin') {
        router.push('/signin')
      }
    })

  }

  render() {
    const {app} = this.props;
    const {user} = app;
    return (
      <div>
        {user.role === 'Admin' ?  <AdminLayout pathname={this.props.location.pathname} user={user}> {this.props.children} </AdminLayout> : ''}
      </div>
    );
  }
}

export default PrivateRoute;
