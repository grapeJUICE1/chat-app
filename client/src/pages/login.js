import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

function Login(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted: (data) => {
      dispatch({ type: "LOGIN", payload: data.login });
      window.location = "/";
    },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();
    loginUser({ variables });
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={7} lg={6}>
        <h1 className="text-center pb-3">Login</h1>
        <Form onSubmit={submitLoginForm}>
          <Form.Group>
            <Form.Label className={errors.username && "text-danger"}>
              {errors.username ?? "Username"}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={variables.username}
              className={errors.username && "is-invalid"}
              id="message-input"
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
              placeholder="Enter password"
              value={variables.password}
              className={errors.password && "is-invalid"}
              id="message-input"
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "loading...." : "Login"}
            </Button>
            <br />
            <small>
              Dont have an account? <Link to="/register">Register</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
