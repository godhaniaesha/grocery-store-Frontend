import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/header.css";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <section className="k-header">
        <div className="k-topbar p-2">
          <Container>
            <Row>
              <Col>
                <div className="k-download-app">
                  <p className="text-light m-0">Download App</p>
                </div>
              </Col>
              <Col>
                <div className="k-download-app">
                  <p className="text-light text-end m-0">USD</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="k-header-main">
          <Container>
            <Row className="align-items-center">
              <Col>
                <div className="k-logo">
                  <div className="k-logo-img">
                    <a className="k-logo-link">LOGO</a>
                  </div>
                </div>
              </Col>
              <Col className="d-flex justify-content-end">
                <div className="k-right-menu d-flex align-items-center">
                  <div className="k-alrady-user">
                    <Link
                      to={"/seller/sell-on-login"}
                      className="k-user-link k-text-gray text-nowrap"
                    >
                      Already a Seller?
                    </Link>
                  </div>
                  <div className="k-start-selling ms-3">
                    <div className="k-start">
                      <div className="k-start-link">
                        <Link
                          to={"/seller/seller-register"}
                          className="k-start-link-text text-nowrap"
                        >
                          Start Selling
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </>
  );
}

export default Header;
