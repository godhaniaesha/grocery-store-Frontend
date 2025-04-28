import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function SellerBankDetails() {
  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Row>
          <Col sm={12}>
            <div className="k-bank-details-container w-50 mx-auto">
              <div className="k-bank-title text-center">
                <h4 className="fw-semibold">Bank Details</h4>
                <p className="k-text-gray">
                  Bank account should be in the name of registered business name
                  or trade name as per GSTIN.
                </p>
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <div className="k-brand-form w-50 mx-auto">
              <div className="k-brand-group">
                <div className="k-bank-acc-num">
                  <label className="form-label">Account Number</label>
                  <div className="k-brand-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Account number"
                    />
                  </div>
                </div>
                <div className="k-confrim-bank-acc-num">
                  <label className="form-label">Confirm Account Number</label>
                  <div className="k-brand-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Account number"
                    />
                  </div>
                </div>
                <div className="k-ifsc-code">
                  <label className="form-label">IFSC Code</label>
                  <div className="k-brand-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="IFSC Code"
                    />
                  </div>
                </div>
              </div>
              <div className="k-brand-submit">
                {/* <button className="k-brand-button w-100 d-block mt-5"> */}
                <button className="z_button w-100 d-block mt-5">
                Verify Bank Details
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SellerBankDetails;
