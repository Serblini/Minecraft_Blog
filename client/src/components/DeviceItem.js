import React from 'react';
import { Card, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from '../assets/star.png'
import { useHistory } from "react-router-dom"
import { DEVICE_ROUTE } from "../utils/consts";

const DeviceItem = ({ device }) => {
  const history = useHistory()
  return (
    <Col className={"mb-3"} onClick={() => history.push(DEVICE_ROUTE + '/' + device.id)}>
      <Card className="p-3" style={{ cursor: 'pointer' }} border={"light"}>
        <Image
          src={process.env.REACT_APP_API_URL + device.img} />
        <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
          <h6 className="auth__title auth__title--fiol my-2">{device.name}</h6>
          <div className="d-flex align-items-center">
            {/* <div>{device.rating}</div> */}
            <Image width={18} height={18} src={star} />
          </div>
        </div>
        <div>{device.description}</div>
      </Card>
    </Col>
  );
};

export default DeviceItem;
