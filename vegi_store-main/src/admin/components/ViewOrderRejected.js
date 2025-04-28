import React from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
function ViewOrderRejected() {
  return (
    <>
      <Container fluid className="k-container">
        <div className="k-header">
          <h1 className="k-title">Orders</h1>
          <div className="k-breadcrumb">
            <span>Dashboard / Order / </span>
            <span className="k-active">View Order</span>
          </div>
        </div>

        <Row className="k-content-row">
          <Col lg={12} xl={9} className="k-order-bg">
            <Card className="k-order-card shadow-none">
              <Card.Body className="k-order-header shadow-none">
                <div className="k-order-info">
                  <h5 className="k-order-number">Order #A1B2C3</h5>
                  <span className="k-order-date">• Feb 05, 2025 02:00 Pm</span>
                </div>
                <div className="k-order-reject">
                  <span variant="light" className="k-reject-btn fw-semibold">
                    Rejected
                  </span>
                </div>
              </Card.Body>
            </Card>

            <Row className="k-address-row">
              <Col md={12} lg={4}>
                <Card className="k-address-card">
                  <Card.Body className="p-0">
                    <h6 className="k-address-title m-0 p-2 ps-3">
                      Shipping Address
                    </h6>
                    <div className="k-address-content p-3">
                      <p className="k-name">Jenny Wilson</p>
                      <p className="k-address">
                        Ehrenkranz 13 Washington Square S,
                        <br />
                        New York,Washington Square, NY 10012,
                        <br />
                        USA
                      </p>
                      <p className="k-email">jennywilson123@gmail.com</p>
                      <p className="k-phone">+1 56565 56565</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12} lg={4}>
                <Card className="k-address-card">
                  <Card.Body className="p-0">
                    <h6 className="k-address-title m-0 p-2 ps-3">
                      Billing Address
                    </h6>
                    <div className="k-address-content p-3">
                      <p className="k-name">Jenny Wilson</p>
                      <p className="k-address">
                        Ehrenkranz 13 Washington Square S,
                        <br />
                        New York,Washington Square, NY 10012,
                        <br />
                        USA
                      </p>
                      <p className="k-email">jennywilson123@gmail.com</p>
                      <p className="k-phone">+1 56565 56565</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12} lg={4}>
                <Card className="k-payment-card">
                  <Card.Body className="p-0">
                    <h6 className="k-payment-title m-0 p-2 ps-3">
                      Payment Details
                    </h6>
                    <div className="k-payment-content p-3">
                      <div className="k-payment-row align-items-center">
                        <span className="k-payment-label">Payment Status</span>
                        <p className="k-payment-success m-0">Success</p>
                      </div>
                      <div className="k-payment-row">
                        <span className="k-payment-label">Payment Method</span>
                        <span className="k-payment-value text-truncate">
                          Debit Card
                        </span>
                      </div>
                      <div className="k-payment-row">
                        <span className="k-payment-label">Transaction ID</span>
                        <span className="k-payment-value text-truncate">
                          #123456789
                        </span>
                      </div>
                      <div className="k-payment-row">
                        <span className="k-payment-label">
                          Card Holder Name
                        </span>
                        <span className="k-payment-value text-truncate">
                          Jenny Wilson
                        </span>
                      </div>
                      <div className="k-payment-row">
                        <span className="k-payment-label">Card Number</span>
                        <span className="k-payment-value text-truncate">
                          **** **** 1234
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="k-products-card">
              <Card.Body className="k-products-body">
                <Table responsive className="k-products-table rounded-0">
                  <thead>
                    <tr>
                      <th className="k-product-header">Product</th>
                      <th className="k-price-header">Price</th>
                      <th className="k-quantity-header">Quantity</th>
                      <th className="k-total-header">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="k-product-cell">
                        <div className="k-product-info">
                          <div className="k-product-img-container">
                            <img
                              src={require(`../K_images/Broccoli.png`)}
                              alt="Broccoli"
                              className="k-product-img"
                            />
                          </div>
                          <div className="k-product-details">
                            <p className="k-product-name m-0">
                              Broccoli - Organically Grown
                            </p>
                            <p className="k-product-weight m-0">250 g</p>
                          </div>
                        </div>
                      </td>
                      <td className="k-price-cell">$35</td>
                      <td className="k-quantity-cell">x1</td>
                      <td className="k-total-cell">$35</td>
                    </tr>
                    <tr>
                      <td className="k-product-cell">
                        <div className="k-product-info">
                          <div className="k-product-img-container">
                            <img
                              src={require(`../K_images/Broccoli.png`)}
                              alt="Broccoli"
                              className="k-product-img"
                            />
                          </div>
                          <div className="k-product-details">
                            <p className="k-product-name m-0">
                              Broccoli - Organically Grown
                            </p>
                            <p className="k-product-weight m-0">250 g</p>
                          </div>
                        </div>
                      </td>
                      <td className="k-price-cell">$35</td>
                      <td className="k-quantity-cell">x2</td>
                      <td className="k-total-cell">$70</td>
                    </tr>
                    <tr>
                      <td className="k-product-cell">
                        <div className="k-product-info">
                          <div className="k-product-img-container">
                            <img
                              src={require(`../K_images/Broccoli.png`)}
                              alt="Broccoli"
                              className="k-product-img"
                            />
                          </div>
                          <div className="k-product-details">
                            <p className="k-product-name m-0">
                              Broccoli - Organically Grown
                            </p>
                            <p className="k-product-weight m-0">250 g</p>
                          </div>
                        </div>
                      </td>
                      <td className="k-price-cell">$35</td>
                      <td className="k-quantity-cell">x1</td>
                      <td className="k-total-cell">$35</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={12} xl={3}>
            <Card className="k-price-details-card rounded-0 mt-5 mt-xl-0 mb-4">
              <Card.Header className="k-price-details-header">
                <h6 className="k-price-details-title">Price Details</h6>
              </Card.Header>
              <Card.Body className="k-price-details-body">
                <div className="k-price-row">
                  <span className="k-price-label">Price (3 items)</span>
                  <span className="k-price-value">$105</span>
                </div>
                <div className="k-price-row">
                  <span className="k-price-label">Discount</span>
                  <span className="k-price-discount">-$10</span>
                </div>
                <div className="k-price-row">
                  <span className="k-price-label">Platform Fee</span>
                  <span className="k-price-value">$1</span>
                </div>
                <div className="k-price-row">
                  <span className="k-price-label">Delivery Charges</span>
                  <span className="k-delivery-free">
                    <span className="k-delivery-original">$20</span> FREE
                  </span>
                </div>
                <div className="k-price-row k-price-total-row">
                  <span className="k-price-total-label">Total</span>
                  <span className="k-price-total-value">$96</span>
                </div>
              </Card.Body>
            </Card>

            <Card className="k-price-details-card rounded-0 mt-5 mt-xl-0">
              <Card.Header className="k-price-details-header">
                <h6 className="k-price-details-title">Reason</h6>
              </Card.Header>
              <Card.Body className="k-price-details-body">
                <div className="k-price-row">
                  <p className="m-0 k-text-gray">
                    Quisque varius diam vel metus mattis, id aliquam diam
                    rhoncus. Proin vitae magna in dui finibus malesuada et at
                    nulla. Morbi elit ex, viverra vitae ante vel, blandit
                    feugiat ligula.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ViewOrderRejected;
