import React, { Fragment, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";

import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";

import Messages from "./Messages";
import User from "./Users";

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      content
      from
      to
      createdAt
    }
  }
`;
const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid
      content
      Message {
        uuid
        from
        to
      }
    }
  }
`;

function Home({ history }) {
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();
  const { user } = useAuthState();
  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  );
  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION
  );

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;

      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message,
        },
      });
    }
  }, [messageError, messageData]);
  useEffect(() => {
    if (reactionError) console.log(reactionError);

    if (reactionData) {
      console.log(reactionData);
      const reaction = reactionData.newReaction;
      const otherUser =
        user.username === reaction.Message.to
          ? reaction.Message.from
          : reaction.to;

      messageDispatch({
        type: "ADD_REACTION",
        payload: {
          username: otherUser,
          reaction,
        },
      });
    }
  }, [reactionError, reactionData]);

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        {!user && (
          <React.Fragment>
            <Link to="/login">
              <Button variant="link">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="link">register</Button>
            </Link>
          </React.Fragment>
        )}
        <Button variant="link" onClick={logout}>
          logout
        </Button>
      </Row>
      <Row className="bg-white">
        {/* <Col xs={2} md={4} className="p-0 bg-secondary"> */}
        <User />
        {/* </Col> */}
        <Col xs={12} sm={12}>
          <Messages />
        </Col>
      </Row>
    </Fragment>
  );
}

export default Home;
