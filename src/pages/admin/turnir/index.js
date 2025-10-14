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
import PaginationItem from "reactstrap/es/PaginationItem";
import PaginationLink from "reactstrap/es/PaginationLink";
import Pagination from "reactstrap/es/Pagination";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import CustomInput from "reactstrap/es/CustomInput";

@connect(({turnir}) => ({turnir}))
class Index extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'turnir/getTurnirs', payload: {}})
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'turnir/updateState',
      payload: {
        list: [],
        page: 0,
        size: 10,
        modalShow: false,
        modalType: 'show',
        selectedItem: {},
        selectedItemId: '',
        totalPages: 0
      }
    })
  }

  render() {
    const {dispatch, turnir} = this.props;
    const {list, modalShow, modalType, selectedItem, page, totalPages} = turnir;
    const loadTurnirData = (page) => {
      dispatch({type: 'turnir/updateState', payload: {page}});
      dispatch({type: 'turnir/getTurnirs', payload: {page}});
    };
    const addModal = () => {
      dispatch({
        type: 'turnir/updateState',
        payload: {
          modalShow: true,
          selectedItem: {},
          modalType: 'add'
        }
      })
    };
    const editingModal = (item) => {
      dispatch({
        type: 'turnir/updateState',
        payload: {
          selectedItem: item,
          modalType: 'edit',
          modalShow: true
        }
      })
    };
    const modalChange = () => {
      dispatch({
        type: "turnir/updateState",
        payload: {
          modalShow: !modalShow,
        }
      })
    };
    const deletingModal = (id) => {
      dispatch({
        type: "turnir/updateState",
        payload: {
          selectedItemId: id,
          modalShow: true,
          modalType: 'delete'
        }
      })
    };
    const addTurnir = (e) => {
      e.preventDefault();
      let data = new FormData();
      if (e.target.image.files.length > 0) {
        data.append('image', e.target.image.files[0]);
      }
      data.append('name', e.target.name.value);
      data.append('text', e.target.text.value);
      data.append('time', e.target.time.value);
      data.append('closeDate', e.target.closeDate.value);
      if (modalType === 'edit') {
        data.append('path', selectedItem.id);
      }
      dispatch({
        type: "turnir/addOrUpdateTurnir",
        payload: data
      })
    };
    const deleteItem = () => {
      dispatch({
        type: 'turnir/deleteTurnir',
        payload: {}
      })
    };
    return (
      <div>
        <Button color="success" onClick={addModal}>Turnir qo'shish</Button>

        <Row className="shadow-sm py-3 mt-4 mb-4">
          <Col md='3'>
            <Row>
              <Col md='6'>
                <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">Rasm</h5>
              </Col>
              <Col md='6'>
                <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">Nomi</h5>
              </Col>
            </Row>
          </Col>
          <Col md='6'>
            <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">matn</h5>
          </Col>
          <Col md='3'>
            <Row>
              <Col md='6'>
                <Row>
                  <Col md='6'>
                    <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">Vaqt</h5>
                  </Col>
                  <Col md='6'>
                    <h5 className="font-family-medium fs-14 text-uppercase text-center mb-0">Tugash vaqti</h5>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        {list.map(i => (
          <Row className='shadow-sm py-3 mt-3'>
            <Col md='3'>
              <Row>
                <Col md='6' className="text-center text-nowrap d-flex align-items-center justify-content-center">
                  <img src={`/${i.image}`} width={100}/>
                </Col>
                <Col md='6' className="text-center d-flex align-items-center justify-content-center">
                  {i.name}
                </Col>
              </Row>
            </Col>
            <Col md='6'>
              {i.text}
            </Col>
            <Col md='3'>
              <Row>
                <Col md='6' className="text-center text-nowrap d-flex align-items-center justify-content-center">
                  <Row>
                    <Col md='6' className="text-center pl-0">
                      {i.time}
                    </Col>
                    <Col md='6'>
                      {i.closeDate.substr(0, 10)}
                    </Col>
                  </Row>
                </Col>
                <Col md='6' className="text-nowrap text-center">
                  <Button color="warning" onClick={() => editingModal(i)} className="btn-edit" />
                  <Button color="danger" onClick={() => deletingModal(i.id)} className="ml-3 btn-delete"/>
                </Col>
              </Row>
            </Col>
          </Row>
        ))}
        <Pagination aria-label="Page navigation example" className="mt-5">
          {Array.from(Array(totalPages).keys()).map(i =>
            <PaginationItem onClick={()=>loadTurnirData(i)} active={i===page}>
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
              <Form onSubmit={addTurnir}>
                <FormGroup>
                  <CustomInput type="file" name="image" required={modalType !== 'edit'} id="exampleCustomFileBrowser" label="Rasm tanlang" className="pl-0"/>
                </FormGroup>
                <FormGroup>
                  <Input type="text" name="name" required
                         defaultValue={modalType === 'edit' ? selectedItem.name : ''}/>
                  <Label>Name</Label>
                  <span className="icon icon-user"/>
                </FormGroup>
                <FormGroup>
                  <Input type="number" name="time" required
                         defaultValue={modalType === 'edit' ? selectedItem.time : ''}/>
                  <Label>Vaqt (sekund)</Label>
                  <span className="icon icon-user"/>
                </FormGroup>
                <FormGroup>
                  <Input type="date" name="closeDate" required
                         defaultValue={modalType === 'edit' ? selectedItem.closeDate.substr(0, 10) : ''}/>
                  <Label>Closing date</Label>
                  <span className="icon icon-user"/>
                </FormGroup>
                <FormGroup>
                  <Input type="textarea" name="text" rows="10" required placeholder="To'liq matn"
                         defaultValue={modalType === 'edit' ? selectedItem.text : ''}/>
                </FormGroup>
                <Button color={modalType === 'edit' ? 'primary' : 'success'}
                        block>{modalType === 'edit' ? "Matnni o'zgartirish" : "Matn qo'shish"}</Button>
              </Form>
            </ModalBody> : ''
          }
          {modalType === 'delete' ?
            <ModalFooter>
              <Button color="danger" onClick={deleteItem}>Ha</Button>{' '}
              <Button color="secondary" onClick={modalChange}>Yo'q</Button>
            </ModalFooter> : ''
          }
        </Modal>
      </div>
    );
  }
}


export default Index;
