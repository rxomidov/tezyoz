import React, {Component} from 'react';
import Button from "reactstrap/es/Button";
import {connect} from "react-redux";
import Table from "reactstrap/es/Table";
import Modal from "reactstrap/es/Modal";
import ModalHeader from "reactstrap/es/ModalHeader";
import ModalBody from "reactstrap/es/ModalBody";
import ModalFooter from "reactstrap/es/ModalFooter";
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import Label from "reactstrap/es/Label";
import Form from "reactstrap/es/Form";
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import PaginationItem from "reactstrap/es/PaginationItem";
import PaginationLink from "reactstrap/es/PaginationLink";
import Pagination from "reactstrap/es/Pagination";
import ButtonGroup from "reactstrap/es/ButtonGroup";


@connect(({users}) => ({users}))
class Index extends Component {
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: "users/getUserList",
      payload: {}
    })
  }

  range(n) {
    return Array.apply(null, Array(n)).map(function (_, i) {
      return i;
    });
  }

  generatePagination(currentPage, totalPages) {

    // First we move out the configurations. That way, they don't mingle with the logic.
    var initialChunkPadding = 1;
    var middleChunkPadding = 2;
    var endingChunkPadding = 1;
    var gapValue = '...';

    // Instead of a loop, we use range. It's much cleaner and we don't have tracking variables
    // at the cost of generating an array.
    return this.range(totalPages).reduce(function (pagination, index) {

      // Then we determine what the current page is based on some comparisons
      var page = index + 1;
      var isInitialChunk = page <= 1 + initialChunkPadding;
      var isMiddleChunk = page >= currentPage - middleChunkPadding && page <= currentPage + middleChunkPadding;
      var isEndingChunk = page >= totalPages - endingChunkPadding;
      var hasNoGap = pagination[pagination.length - 1] !== gapValue;

      // Then based on the determinations, we determine what value gets pushed into the array.
      // It can either be the page, a '...', or a blank array (which doesn't change anything with concat)
      var valueToAdd = isInitialChunk || isMiddleChunk || isEndingChunk ? page : hasNoGap ? gapValue : [];

      return pagination.concat(valueToAdd);
    }, []);
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'users/updateState',
      payload: {
        userList: [],
        modalShow: false,
        selectedUser: {},
        totalPages: 0,
        page: 0
      }
    })
  }

  render() {
    const {dispatch, users} = this.props;
    const {userList, modalShow, selectedUser, totalPages, page, isSearchLoading} = users;


    const modalChange = (user) => {
      dispatch({
        type: "users/updateState",
        payload: {
          modalShow: !modalShow,
          selectedUser: user
        }
      })
    };

    const editingUser = (user) => {
      dispatch({
        type: "users/updateState",
        payload: {
          modalShow: true,
          selectedUser: user
        }
      })
    };

    const editUser = (e) => {
      e.preventDefault();
      dispatch({
        type: "users/editUser",
        payload: {
          path: selectedUser.id,
          roleName: e.target.roleName.value
        }
      })
    };

    const loadData = (page) => {
      dispatch({type: "users/getUserList", payload: {page}});
      dispatch({type: "users/updateState", payload: {page}});
    };

    const searChUser = (e) => {
      dispatch({
        type: "users/updateState",
        payload: {
          isSearchLoading: true,
          isSearching: e.target.value.length === 0,
          searchingUser: e.target.value
        }
      })
      dispatch({
        type: 'users/searchUser',
        payload: {
          search: e.target.value,
        }
      });
    };
    const action = (userId, isBlock) => {
      dispatch({
        type: 'users/' + (isBlock ? 'unBlockUser' : 'blockUser'),
        payload: {userId}
      })
    }

    return (
      <div>
        <Row>
          <Col md='4'>
            <FormGroup>
              <Input type="text" name="login" onChange={searChUser} required/>
              <Label>Qidirish</Label>
              {isSearchLoading ? <span className="spinner-border spinner-border-sm"/> : ''}
            </FormGroup>
          </Col>
        </Row>
        <Row className="shadow-sm py-3 mt-4 mb-4">
          <Col md='3'>
            <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">Ismi</h5>
          </Col>
          <Col md='3'>
            <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">Familiyasi</h5>
          </Col>
          <Col md='2'>
            <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">Roli</h5>
          </Col>
          <Col md='2'>
            <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">Telefon raqam</h5>
          </Col>
          <Col md='2'>
            <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">Amallar</h5>
          </Col>
        </Row>
        {userList.map(user => (
          <Row className='shadow-sm py-3 mt-3'>
            <Col md='3' className="text-center text-nowrap d-flex align-items-center justify-content-center">
              {user.firstname}
            </Col>
            <Col md='3' className="text-center">
              {user.lastname}
            </Col>
            <Col md='2' className="text-center">
              {user.role}
            </Col>
            <Col md='2' className="text-center">
              {user.phoneNumber}
            </Col>
            <Col md='2' className="text-nowrap d-flex align-items-center justify-content-center">
              <ButtonGroup>
                <Button onClick={() => action(user.id, user.isBlock)}>{user.isBlock ? 'UnBlock' : 'Block'}</Button>
              </ButtonGroup>
              {/*<Button color="warning" onClick={() => editingUser(user)} className="btn-edit"/>*/}
            </Col>
          </Row>
        ))}
        <Pagination aria-label="Page navigation example" className="mt-5">
          {this.generatePagination(page, totalPages).map((item, i) =>
            <PaginationItem onClick={() => {
              if (item - 1 !== page && item !== '...')
                loadData(item - 1)
            }}
                            active={item - 1 === page}
                            disabled={item - 1 === page || item === '...'}>
              <PaginationLink>
                {item}
              </PaginationLink>
            </PaginationItem>)}
        </Pagination>
        <Modal isOpen={modalShow} toggle={modalChange}>
          <ModalHeader toggle={modalChange}>Foydalanuvchi rolini o'zgartirish</ModalHeader>
          <ModalBody>
            <Form onSubmit={editUser}>
              <FormGroup>
                <Input type="select" name="roleName" required className="bg-white"
                       defaultValue={selectedUser ? selectedUser.role : ''} id="roleName">
                  <option value="User">User</option>
                  <option value="Moderator">Moderator</option>
                </Input>
                <label htmlFor="roleName" style={{left: "14px"}}>Rolni tanlang</label>
              </FormGroup>
              <Button color='primary' block>O'zgartirish</Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>

    );
  }
}

export default Index;
