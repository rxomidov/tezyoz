import React, {Component} from 'react';
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import Label from "reactstrap/es/Label";
import Button from "reactstrap/es/Button";
import Link from 'umi/Link'
import Form from "reactstrap/es/Form";
import {connect} from "react-redux";
import Spinner from "reactstrap/es/Spinner";
import {GoogleLogin} from 'react-google-login';
import {STORAGE_NAME} from 'utils/constant';
import router from "umi/router";
import {toast} from "react-toastify";

@connect(({signin}) => ({signin}))
class Index extends Component {

  googleResponse = (response) => {
    const {dispatch} = this.props;
    dispatch({
      type: "signin/updateState",
      payload: {
        isLoading: true
      }
    });
    const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type: 'application/json'});
    const options = {
      method: 'POST',
      body: tokenBlob,
      mode: 'cors',
      cache: 'default'
    };
    fetch('/api/user/auth/google', options).then(r => {
      const token = r.headers.get('x-auth-token');
      r.json().then(user => {
        if (user.success) {
          localStorage.setItem(STORAGE_NAME, user.token);
          router.push("/sinov")
          dispatch({
            type: "signin/updateState",
            payload: {
              isLoading: false
            }
          });
        } else {
          dispatch({
            type: "signin/updateState",
            payload: {
              isLoading: false
            }
          });
          // toast.error("Xatolik!")
        }
      }).catch(e => {
        dispatch({
          type: "signin/updateState",
          payload: {
            isLoading: false
          }
        });
        toast.error("Xatolik! Qaytadan urunib ko'ring!")
      });
    })
  };
  onFailure = (error) => {
    const {dispatch} = this.props;
    dispatch({
      type: "signin/updateState",
      payload: {
        isLoading: false
      }
    });
    toast.error("Xatolik!")
  };

  render() {
    const {dispatch, signin} = this.props;
    const {isLoading} = signin;

    const signInF = (e) => {
      e.preventDefault();
      dispatch({
        type: 'signin/updateState',
        payload: {
          isLoading: true
        }
      });
      var newUser = {
        login: e.target.login.value,
        password: e.target.password.value,
      };

      dispatch({
        type: "signin/signIn",
        payload: newUser
      })
    };
    return (
      <section id="sign" className="min-h-100 position-relative">
        <Link to='/'><img src="/assets/images/logo-sign.png" alt=""/></Link>
        <div className="w-50 position-absolute">
          <h1 className="font-family-semi-bold fs-50 ml-25">Tezyoz.uz tizimiga <br/> xush kelibsiz!</h1>
          <Form onSubmit={signInF} className="w-50 mx-auto pb-4">
            <div className="d-flex w-100 texts">
              <div className="w-50">
                <h4 className="text-uppercase fs-18 font-family-medium"><Link to='/signup'>Ro'yxatdan o'tish</Link></h4>
              </div>
              <div className="w-50">
                <h4 className="text-uppercase fs-18 font-family-medium"><Link to='/signin'
                                                                              className='active'>kirish</Link></h4>
              </div>
            </div>
            <FormGroup>
              <Input type="text" name="login" required className="bg-white font-family-regular"/>
              <Label className="font-family-light">Login</Label>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="password" required className="bg-white"/>
              <Label className="font-family-light">Parol</Label>
            </FormGroup>
            <div className="d-flex sign-group align-items-center justify-content-between">
              <Button color="dark" disabled={isLoading} className="text-uppercase fs-18">{isLoading ?
                <Spinner size="sm" color="white" className="mr-1"/> : ""} Kirish</Button>
              <div>
                <p className="font-family-regular fs-16 mb-0">yoki</p>
              </div>
              <GoogleLogin
                disabled={isLoading}
                clientId="558779061459-9efhsks6b1apje1ldu6qbhvda64jea75.apps.googleusercontent.com"
                buttonText="Google orqali kirish"
                onSuccess={this.googleResponse}
                onFailure={this.onFailure}
                className="d-flex"
              >{isLoading ? <span className='spinner-border spinner-border-sm'/> : ''} Google orqali
                kirish</GoogleLogin>
            </div>
          </Form>
        </div>
      </section>
    );
  }
}

export default Index;
