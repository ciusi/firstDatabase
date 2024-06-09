import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css"; 

const Register = () => {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [data_di_nascita, setDataDiNascita] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting registration with:", { nome, cognome, email, data_di_nascita, password }); // Log dati di registrazione
    try {
      const response = await axios.post("http://localhost:5000/auth/register", { nome, cognome, email, data_di_nascita, password });
      console.log("Registration successful:", response.data); // Log risposta
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error("Errore nella registrazione:", err); // Log errore
      setError(err.response ? err.response.data.message : "Errore nella registrazione");
      setSuccess(false);
    }
  };

  return (
    <Container className="auth-container">
      <h2>Registrazione</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNome">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formCognome">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Cognome"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formDataDiNascita">
          <Form.Label>Data di Nascita</Form.Label>
          <Form.Control
            type="date"
            placeholder="Data di Nascita"
            value={data_di_nascita}
            onChange={(e) => setDataDiNascita(e.target.value)}
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
          Registrati
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {success && <Alert variant="success" className="mt-3">Registrazione avvenuta con successo! Reindirizzamento...</Alert>}
      <p className="mt-3">
        Hai già un account? <Link to="/login">Accedi</Link>
      </p>
    </Container>
  );
};

export default Register;
