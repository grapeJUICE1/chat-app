import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Image } from "react-bootstrap";
import classNames from "classnames";

import { useMessageDispatch, useMessageState } from "../../context/message";
import Sidebar from "../../sidebar";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        content
        createdAt
        from
        to
      }
    }
  }
`;
function User() {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.username;

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),
    onError: (err) => {
      if (Array.isArray(err.graphQLErrors)) {
        if (typeof err.graphQLErrors[0] === "object") {
          if (err.graphQLErrors[0].hasOwnProperty("key")) {
            if (err.graphQLErrors[0].message === "Unauthenticated")
              window.location = "/login";
          }
        }
      }
    },
  });

  let usersMarkup;

  if (!users || loading) {
    usersMarkup = <p>Loading ..........</p>;
  } else if (users.length === 0) {
    usersMarkup = <p>No users joined yet.......</p>;
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          role="button"
          className={classNames(
            //
            "d-flex justify-content-start p-3 user-div",
            {
              "bg-white": selected,
            }
          )}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image
            src={
              user.imageUrl ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            className="user-image"
          />
          <div className="ml-2">
            <p className="text-success pl-4">{user.username}</p>
            <p className="font-weight-light pl-4">
              {user.latestMessage
                ? user.latestMessage.content
                : "You are now connected!"}
            </p>
          </div>
        </div>
      );
    });
  }
  return (
    <React.Fragment>
      <Sidebar>
        <div>{usersMarkup}</div>
      </Sidebar>
    </React.Fragment>
  );
}

export default User;
