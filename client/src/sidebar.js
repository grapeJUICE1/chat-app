import React from "react";
import { slide as Menu } from "react-burger-menu";
import "./App.scss";

const Sidebar = (props) => {
  return (
    // Pass on our props
    <Menu width={"100%"}>{props.children}</Menu>
  );
};
export default Sidebar;
