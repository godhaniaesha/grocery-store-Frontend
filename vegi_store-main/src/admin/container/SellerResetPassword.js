import React, { useState } from "react";
import "../../styles/kevin.css";
import Header from "./Header";
import { Card, Container, InputGroup, Form, Button } from "react-bootstrap";
import { IoEyeOff } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
function SellerResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    // console.log("Password reset submitted");
  };
  return (
    <>
      <Header />
      <Container className="d-flex justify-content-center align-items-center k-password-reset-container">
        <Card className="k-password-card shadow-sm border-0">
          <Card.Body className="p-4">
            <h2 className="text-center mb-2">Reset Password</h2>
            <p className="text-center text-muted mb-4 k-reset-pass-text">
              Create a unique password different from your previous ones.
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <InputGroup className="k-password-input-group mb-4">
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="k-password-input"
                  />
                  <Button
                    variant="light"
                    className="k-eye-button border-0"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <IoEyeOff size={20} />
                    ) : (
                      <MdRemoveRedEye size={20} />
                    )}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup className="k-password-input-group">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="k-password-input"
                  />
                  <Button
                    variant="light"
                    className="k-eye-button border-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <IoEyeOff size={20} />
                    ) : (
                      <MdRemoveRedEye size={20} />
                    )}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button type="submit" className="w-100 k-reset-button">
                Reset Password
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default SellerResetPassword;
