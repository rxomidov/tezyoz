import React, {Component} from 'react';
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import Label from "reactstrap/es/Label";
import Button from "reactstrap/es/Button";
import Link from "umi/Link";
import UserImage from 'components/UserImage/UserImage'
import {connect} from "react-redux";
import Spinner from "reactstrap/es/Spinner";

@connect(({app, settings}) => ({app, settings}))
class Index extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'app/me',
      payload: {}
    })
  }

  render() {
    const {app, dispatch, settings} = this.props;
    const {user} = app;
    const {isLoading} = settings;

    const saveProfile = (e) => {
      e.preventDefault();
      dispatch({
        type: "settings/updateState",
        payload: {
          isLoading: true
        }
      })
      let data = new FormData();
      if (e.target.image.files.length > 0) {
        data.append('image', e.target.image.files[0]);
      }
      data.append('firstname', e.target.firstName.value);
      data.append('lastname', e.target.lastName.value);
      data.append('oldPassword', e.target.oldPassword.value);
      data.append('newPassword', e.target.newPassword.value);

      dispatch({
        type: 'settings/editProfile',
        payload: data
      })
    };

    return (
      <section id="settings"
               className="d-flex w-100 justify-content-center align-items-center min-h-100 bg-white position-relative">
        <UserImage/>
        <div className="settings-content">
          <div className="user mx-auto" style={user.image ? {backgroundImage: `url('${user.image.replace('\\', '/')}')`}: {}}>
            <Label className="edit" for="user-image"/>

          </div>
          <Form className='fs-16 font-family-light' onSubmit={saveProfile}>
            <Input type="file" className="d-none" name="image" accept="image/png, image/jpeg" id="user-image"/>
            <FormGroup>
              <Input type="text" name="firstName" required className="border-0 font-family-light"
                     defaultValue={user.firstname ? user.firstname : ""}/>
              <Label>Ism</Label>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="lastName" required className="border-0" defaultValue={user.lastname}/>
              <Label>Familiya</Label>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="oldPassword" required className="border-0"/>
              <Label>Eski parol</Label>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="newPassword" required className="border-0"/>
              <Label>Yangi parol</Label>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="reNewPassword" required className="border-0"/>
              <Label>Takroriy yangi parol</Label>
            </FormGroup>
            <Button color="dark" className="py-2 fs-16 mt-5 font-family-regular " block disabled={isLoading}>{isLoading ? <Spinner size="sm" color="white" className="mr-1"/> : ""} Saqlash</Button>
          </Form>
        </div>
      </section>
    );
  }
}

export default Index;
