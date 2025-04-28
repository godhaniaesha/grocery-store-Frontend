import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function SellerPickup() {
  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Row>
          <Col sm={12}>
            <div className="k-pickup-details-container w-50 mx-auto">
              <div className="k-bank-title text-center">
                <h4 className="fw-semibold">Pickup Address</h4>
                <p className="k-text-gray">
                  Products will be picked up from this location for delivery.
                </p>
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <div className="k-pickup-form w-50 mx-auto">
              <div className="k-pickup-group">
                <div className="k-room mb-3">
                  <label className="form-label m-0 mb-1">
                    Room/ Floor/ Building Number
                  </label>
                  <div className="k-room-input">
                    <input
                      type="text"
                      className="form-control k-input-bg-color"
                      placeholder="Room/ Floor/ Building Number"
                    />
                  </div>
                </div>
                <div className="k-street mb-3">
                  <label className="form-label m-0 mb-1">Street/ Locality</label>
                  <div className="k-street-input">
                    <input
                      type="text"
                      className="form-control k-input-bg-color"
                      placeholder="Street/ Locality"
                    />
                  </div>
                </div>
                <div className="k-landmark">
                  <label className="form-label m-0 mb-1">Landmark</label>
                  <div className="k-landmark-input">
                    <input
                      type="text"
                      className="form-control k-input-bg-color"
                      placeholder="Landmark"
                    />
                  </div>
                </div>
                <div className="k-pincode-group mt-3">
                  <div className="d-flex">
                    <div className="me-3">
                      <label className="form-label m-0 mb-1">Pincode</label>
                      <div className="k-landmark-input">
                        <input
                          type="text"
                          className="form-control k-input-bg-color"
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label m-0 mb-1">City</label>
                      <div className="k-landmark-input">
                        <input
                          type="text"
                          className="form-control k-input-bg-color"
                          placeholder="City"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="k-state mt-2">
                  <label className="form-label m-0 mb-1">State</label>
                  <div className="k-state-input">
                    <input
                      type="text"
                      className="form-control k-input-bg-color"
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>
              <div className="k-pickup-submit">
                {/* <button className="k-pickup-button w-100 d-block mt-5"> */}
                <button className="z_button w-100 d-block mt-5">
                Continue
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SellerPickup;
