import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import bigStar from "../assets/bigStar.png";
import { useParams } from "react-router-dom";
import { fetchOneDevice } from "../http/deviceAPI";
import PopularPosts from "./PopularPosts";

const DevicePage = () => {
  const [device, setDevice] = useState({ info: [] });
  const { id } = useParams();
  console.log(`id`, id);
  // useEffect(() => {
  //   fetchOneDevice(id).then(data => setDevice(data))
  // }, [])

  useEffect(() => {
    fetchOneDevice(id).then((data) => setDevice(data));
  }, [id]);

  const rpHTML = (html, className) => {
    if (className) {
      return (
        <p className={className} dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    return <p dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <Container className="mt-3 pt-3">
      <Row style={{ minHeight: 500 }} className="p-4">
        <Col lg={8} className="mb-3">
          <div
            className="p-3"
            style={{
              backgroundColor: "white",
              borderRadius: ".25rem",
            }}
          >
            <h2
              className="auth__title auth__title--fiol mb-3"
              style={{ backgroundColor: "white" }}
            >
              {device.name}
            </h2>

            {/* <Row className="mt-3"> */}
            <Card
              style={{
                // width: 300, height: 300,
                maxWidth: 500,
                margin: "0 auto",
                fontSize: 32,
                // border: '5px solid lightgray'
              }}
            >
              <Image
                // width={300} height={300}
                style={{ borderRadius: ".25rem" }}
                src={process.env.REACT_APP_API_URL + device.img}
              />
            </Card>
            {/* <Col md={8}> */}
            {rpHTML(device.description, "mt-3 text-justify")}
          </div>
          {/* </Col> */}
          {/* <Col md={4}> */}
          {/* <Card
                className=""
                style={{
                  // width: 300, height: 300,
                  fontSize: 32,
                  // border: '5px solid lightgray'
                }}
              >
                <Image
                  // width={300} height={300}
                  src={process.env.REACT_APP_API_URL + device.img} />
              </Card> */}
          {/* </Col> */}
          {/* </Row> */}
        </Col>
        <PopularPosts />
      </Row>
      {/* <Row className="d-flex flex-column m-3">
        <h1>Характеристики</h1>
        {device.info.map((info, index) =>
          <Row key={info.id} style={{ background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10 }}>
            {info.title}: {info.description}
          </Row>
        )}
      </Row> */}
    </Container>
  );
};

export default DevicePage;
