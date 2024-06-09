import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Errore nel reset della password");
      setMessage("");
    }
  };

  return (
    <Container>
      <h2>Reset della Password</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Nuova Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nuova Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Resetta Password
        </Button>
      </Form>
      {message && <Alert variant="success" className="mt-3">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
};

export default ResetPassword;
