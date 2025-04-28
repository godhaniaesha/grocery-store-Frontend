import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function SellerBrandDetails() {
  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Row>
          <Col sm={12}>
            <div className="k-brand-details-container">
              <div className="k-brand-title text-center">
                <h4 className="fw-semibold">Brand Details</h4>
                <p className="k-text-gray">
                  Your store name will be visible to all buyers of FastKart
                </p>
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <div className="k-brand-form">
              <div className="k-brand-group">
              <div className="k-store-name">
                <label className="form-label">Store Name</label>
                <div className="k-brand-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Store number"
                  />
                  <p>E.g. Business Name, Trade Name, Etc.</p>
                </div>
              </div>
              <div className="k-store-name">
                <label className="form-label">Owner Name</label>
                <div className="k-brand-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Store number"
                  />
                </div>
              </div>
              </div>
              <div className="k-brand-submit">
                {/* <button className="k-brand-button w-100 d-block mt-5"> */}
                <button className="z_button w-100 d-block mt-5">
                  Submit
                  </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SellerBrandDetails;
