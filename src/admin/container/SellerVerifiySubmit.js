import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function SellerVerifiySubmit() {
  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Row>
          <Col sm={12}>
            <div className="k-verify-details-container w-50 mx-auto">
              <div className="k-verify-title text-center">
                <h4 className="fw-semibold">Verify & Submit</h4>
                <p className="k-text-gray">
                  Bank account should be in the name of registered business name
                  or trade name as per GSTIN.
                </p>
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <div className="k-verify-container w-50 mx-auto">
              <div className="k-veri-details k-text-gray w-75 mx-auto">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </p>
                <p>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </p>

                <div className="k-agreement mt-4">
                  <div className="k-agreement-group d-flex">
                    <input type="checkbox" name="agree" />
                    <p className="m-0 ms-2">
                      I agree to comply with FastKart’s <strong className="text-dark">Seller Agreement</strong>.
                    </p>
                  </div>
                </div>
              </div>
              <div className="k-submit-btn mt-5">
                    {/* <button className="k-veri-sub-btn d-block w-100"> */}
                    <button className="z_button fs-6 d-block w-100">
                      Verify & Submit
                      </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SellerVerifiySubmit;
