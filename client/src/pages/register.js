import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $imageUrl: String
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      imageUrl: $imageUrl
    ) {
      username
      email
      createdAt
    }
  }
`;

function Register(props) {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, res) => props.history.push("/login"),
    onError: (err) => {
      console.log(err);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();
    registerUser({ variables });
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={7} lg={6}>
        <h1 className="text-center pb-3">Register</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label className={errors.email && "text-danger"}>
              {errors.email ?? "Email Address"}
            </Form.Label>
            <Form.Control
              type="email"
              id="message-input"
              placeholder="Enter email"
              value={variables.email}
              className={errors.email && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.username && "text-danger"}>
              {errors.username ?? "Username"}
            </Form.Label>
            <Form.Control
              type="text"
              id="message-input"
              placeholder="Enter username"
              value={variables.username}
              className={errors.username && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.password && "text-danger"}>
              {errors.password ?? "Password"}
            </Form.Label>
            <Form.Control
              type="password"
              id="message-input"
              placeholder="Enter password"
              value={variables.password}
              className={errors.password && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.confirmPassword && "text-danger"}>
              {errors.confirmPassword ?? "Retype Password"}
            </Form.Label>
            <Form.Control
              type="password"
              id="message-input"
              placeholder="Enter confirmed password"
              value={variables.confirmPassword}
              className={errors.confirmPassword && "is-invalid"}
              onChange={(e) =>
                setVariables({
                  ...variables,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.imageUrl && "text-danger"}>
              {errors.imageUrl ?? "Image URL"}
            </Form.Label>
            <Form.Control
              type="text"
              id="message-input"
              placeholder="Enter your profile image url"
              value={variables.imageUrl}
              className={errors.imageUrl && "is-invalid"}
              onChange={(e) =>
                setVariables({
                  ...variables,
                  imageUrl: e.target.value,
                })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "loading.." : "Register"}
            </Button>
            <br />
            <small>
              Already have an account? <Link to="/login">Login</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default Register;
