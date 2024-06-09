import React, { useState } from "react";
import axios from "../auth/axiosConfig"; // Importa la configurazione di Axios
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "./auth.css"; 

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { email, password }); // Log dati di login
    try {
      const response = await axios.post("/auth/login", { email, password });
      console.log("Login successful, received token:", response.data.token); // Log token ricevuto
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setError(null);
      navigate("/");
    } catch (err) {
      console.error("Errore nel login:", err); // Log errore
      setError(err.response ? err.response.data.message : "Errore nel login");
    }
  };

  return (
    <Container className="auth-container">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <p className="mt-3">
        Non hai un account? <Link to="/register">Registrati</Link>
      </p>
      <p className="mt-3">
        Hai dimenticato la password? <Link to="/forgot-password">Reset Password</Link>
      </p>
    </Container>
  );
};

export default Login;
