import React from 'react';
import Card from "reactstrap/es/Card";
import Link from "umi/Link";
import CardBody from "reactstrap/es/CardBody";
import Col from "reactstrap/es/Col";
import CardFooter from "reactstrap/es/CardFooter";

const TournamentComponent = (props) => {

  return (
    <Col md="6" lg='4' xl='3'>
      <Card className="border-0 h-100">
        <Link to={"/musobaqa/" + props.tournament.id}/>
        <img src={props.tournament.image} alt="" className="card-img-top"/>
        <CardBody className='pb-0'>
          <h4 className="font-family-medium fs-16 text-uppercase">{props.tournament.name}</h4>
          <p className="font-family-regular fs-14 color-grey">Boshlangan
            vaqt: {props.tournament.createdAt.substr(0, 10)} {props.tournament.createdAt.substr(11, 5)}</p>
        </CardBody>
        <CardFooter className="border-0 bg-white pt-0">
          <div className="d-flex mt-4">
            <div>
              <p className="font-family-regular fs-12 mb-2 color-grey">Ishtirokchilar</p>
              <h4 className="font-family-semi-bold fs-18 text-uppercase">{props.tournament.usersCount} ta</h4>
            </div>
            <div className="ml-5">
              <p className="font-family-regular fs-12 mb-2 color-grey">O'tkazilgan sinovlar</p>
              <h4 className="font-family-semi-bold fs-18 text-uppercase">{props.tournament.testsCount} marta</h4>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Col>
  );
};

export default TournamentComponent;
