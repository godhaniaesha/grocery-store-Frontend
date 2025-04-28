import React, { useState } from "react";
import Header from "./Header";
import "../../styles/kevin.css";
import { Button, Container, Form } from "react-bootstrap";
function SellerForgetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    // console.log("Forgot password attempt with:", { email });
  };

  return (
    <>
      <Header />

      <div className="k-login-form" style={{ marginTop: "100px" }}>
        <Container className="d-flex justify-content-center align-items-center">
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <div className="text-center mb-4">
              <h2 className="k-text-size">Forgot Password?</h2>
              <p className="k-text-gray">
                To recover your account, please enter your email below.
              </p>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Id</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email Id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded"
                />
              </Form.Group>

              <div className="mt-4">
                <Button
                  type="submit"
                  className="w-100 py-2"
                  style={{
                    background:
                      "linear-gradient(180deg, #479529 0%, #0C6C44 100%)",
                    borderColor: "#4CAF50",
                    fontSize: "1rem",
                  }}
                >
                  Send Code
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </>
  );
}

export default SellerForgetPassword;
