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
import Pagination from "reactstrap/es/Pagination";
import PaginationItem from "reactstrap/es/PaginationItem";
import PaginationLink from "reactstrap/es/PaginationLink";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

@connect(({text}) => ({text}))
class Index extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: "text/getTextList",
      payload: {}
    })
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'text/updateState',
      payload: {
        texts: [],
        modalShow: false,
        modalType: 'add',
        selectedText: {},
        totalPages: 0,
        page: 0
      }
    })
  }

  render() {
    const {dispatch, text} = this.props;
    const {texts, modalShow, modalType, selectedText, totalPages, page} = text;

    const deletingModal = (id) => {
      dispatch({
        type: "text/updateState",
        payload: {
          selectedTextId: id,
          modalShow: true,
          modalType: 'delete'
        }
      })
    };

    const modalChange = () => {
      dispatch({
        type: "text/updateState",
        payload: {
          modalShow: !modalShow,
        }
      })
    };

    const deleteText = () => {
      dispatch({
        type: "text/deleteText",
        payload: {}
      })
    };

    const addText = (e) => {
      e.preventDefault();

      var newText = {
        text: e.target.text.value,
        time: e.target.time.value
      };
      if (modalType === 'edit') {
        dispatch({
          type: "text/addText",
          payload: {
            path: selectedText.id,
            ...newText
          }
        })
      } else {
        dispatch({
          type: "text/addText",
          payload: {
            ...newText
          }
        })
      }
    };

    const editingModal = (text) => {
      dispatch({
        type: 'text/updateState',
        payload: {
          selectedText: text,
          modalType: 'edit',
          modalShow: true
        }
      })
    };
    const loadData = (page) => {
      dispatch({type: "text/getTextList", payload: {page}});
      dispatch({type: "text/updateState", payload: {page}});
    };

    const addModal = () => {
      dispatch({
        type: 'text/updateState',
        payload: {
          modalShow: true,
          selectedText: {},
          modalType: 'add'
        }
      })
    };

    return (
      <div>
        <Button color="success" onClick={addModal}>Matn qo'shish</Button>

        <Row className="shadow-sm py-3 mt-4 mb-4">
          <Col md='2'>
            <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">vaqt</h5>
          </Col>
          <Col md='8'>
            <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">matn</h5>
          </Col>
        </Row>
          {texts.map(text => (
            <Row className='shadow-sm py-3 mt-3'>
              <Col md='2' className="text-center text-nowrap d-flex align-items-center justify-content-center">
                {text.time} s
              </Col>
              <Col md='8'>
                {text.text}
              </Col>
              <Col md='2' className="text-nowrap d-flex align-items-center justify-content-center">
                <Button color="warning" onClick={() => editingModal(text)} className="btn-edit" />
                <Button color="danger" onClick={() => deletingModal(text.id)} className="ml-3 btn-delete"/>
              </Col>
            </Row>
          ))}
        <Pagination aria-label="Page navigation example" className="mt-5">
          {Array.from(Array(totalPages).keys()).map(i =>
            <PaginationItem onClick={()=>loadData(i)} active={i===page}>
              <PaginationLink>
                {i + 1}
              </PaginationLink>
            </PaginationItem>)}
        </Pagination>
        <Modal isOpen={modalShow} toggle={modalChange}>
          <ModalHeader
            toggle={modalChange}>{modalType === 'add' ? "Yangi matn qo'shish" : modalType === 'edit' ? "Matnni o'zgartirish" : "O'chirmoqchimisiz?"}</ModalHeader>
          {modalType === 'add' || modalType === 'edit' ?
            <ModalBody>
              <Form onSubmit={addText}>
                <FormGroup>
                  <Input type="number" name="time" required className="bg-white"
                         defaultValue={modalType === 'edit' ? selectedText.time : ''}/>
                  <Label>Vaqt (sekund)</Label>
                  <span className="icon icon-time"/>
                </FormGroup>
                <FormGroup>
                  <Input type="textarea" name="text" rows="10" required placeholder="To'liq matn"
                         defaultValue={modalType === 'edit' ? selectedText.text : ''}/>
                </FormGroup>
                <Button color={modalType === 'edit' ? 'primary' : 'success'}
                        block>{modalType === 'edit' ? "Matnni o'zgartirish" : "Matn qo'shish"}</Button>
              </Form>
            </ModalBody> : ''
          }
          {modalType === 'delete' ?
            <ModalFooter>
              <Button color="danger" onClick={deleteText}>Ha</Button>{' '}
              <Button color="secondary" onClick={modalChange}>Yo'q</Button>
            </ModalFooter> : ''
          }
        </Modal>
      </div>

    );
  }
}

export default Index;
