import React, {Component} from 'react';
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import Label from "reactstrap/es/Label";
import Button from "reactstrap/es/Button";
import Link from 'umi/Link'
import Form from "reactstrap/es/Form";
import {connect} from "react-redux";
import Spinner from "reactstrap/es/Spinner";
import {toast} from "react-toastify";

@connect(({signup}) => ({signup}))
class Index extends Component {
  render() {
    const {dispatch, signup} = this.props;
    const {isLoading} = signup;

    const signUp = (e) => {
      e.preventDefault();
      const login = e.target.login.value;
      const password = e.target.password.value;
      const rePassword = e.target.rePassword.value;
      const firstname = e.target.firstName.value;
      const lastname = e.target.lastName.value;
      if (password === rePassword) {
        dispatch({
          type: "signup/signUpNewUser",
          payload: {login, password, firstname, lastname}
        })
      } else {
        toast.error("Takroriy parol xato kiritildi");
        document.getElementById('re-password').focus();
      }
    };
    return (
      <section id="sign" className="min-h-100 position-relative">
        <Link to='/'><img src="/assets/images/logo-sign.png" alt=""/></Link>
        <div className="w-50 position-absolute">
          <h1 className="font-family-semi-bold fs-50 ml-25">Tezyoz.uz tizimiga <br/> xush kelibsiz!</h1>
          <Form onSubmit={signUp} className="w-50 mx-auto pb-4">
            <div className="d-flex w-100 texts">
              <div className="w-50">
                <h4 className="text-uppercase fs-18 font-family-medium"><Link to='/signup' className='active'>Ro'yxatdan
                  o'tish</Link></h4>
              </div>
              <div className="w-50">
                <h4 className="text-uppercase fs-18 font-family-medium"><Link to='/signin'>kirish</Link></h4>
              </div>
            </div>
            <FormGroup>
              <Input type="text" name="login" required className="bg-white font-family-regular"/>
              <Label className="font-family-light">Login</Label>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="password" required className="bg-white font-family-regular"/>
              <Label className="font-family-light">Parol</Label>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="rePassword" id="re-password" required className="bg-white font-family-regular"/>
              <Label className="font-family-light"> Takroriy parol</Label>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="firstName" required className="bg-white font-family-regular"/>
              <Label className="font-family-light">Ism</Label>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="lastName" required className="bg-white font-family-regular"/>
              <Label className="font-family-light">Familiya</Label>
            </FormGroup>
            <Button color="dark" disabled={isLoading} className="text-uppercase fs-18">{isLoading ?
              <Spinner size="sm" color="white" className="mr-1"/> : ""} Saqlash</Button>
          </Form>
        </div>
      </section>
    );
  }
}

export default Index;
