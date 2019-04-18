import React from "react";
import styled, { css } from "styled-components";
import { connect } from "react-redux";
import colorParser from "./color/colorParser";

const Bar = styled.div`
  position: fixed;
  bottom: 0;
  left: 4px;
  right: 4px;
  height: 55px;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
  border-radius: 8px 8px 0 0;
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
`;

const Navigator = styled.div`
  height: 24px;
  width: auto;
  min-width: 15%;
  text-align: center;
  font-size: 20px;
  color: ${colorParser("lessdark")};
  ${props =>
    props.active &&
    css`
      color: ${colorParser("primary")};
    `};
`;

class BottomNavigator extends React.Component {
  state = {
    active: "feed"
  };

  componentDidMount() {
    let path = this.props.location.pathname.slice(1);

    this.setState({
      active: path === "" ? "feed" : path
    });
  }

  handleClick = identifier => {
    this.props.history.push("/" + identifier);
    this.setState({
      active: identifier
    });
  };
  render() {
    return (
      <Bar>
        <Navigator
          active={this.state.active === "feed" ? true : false}
          onClick={() => this.handleClick("feed")}
        >
          <i className="fas fa-home" />
        </Navigator>
        <Navigator
          active={this.state.active === "search" ? true : false}
          onClick={() => this.handleClick("search")}
        >
          <i className="fas fa-search" />
        </Navigator>
        <Navigator
          active={this.state.active === "ask" ? true : false}
          onClick={() => this.handleClick("ask")}
        >
          {this.props.uploadingImage ? (
            <i className="fas fa-cloud-upload-alt" />
          ) : (
            "Pucho"
          )}
        </Navigator>
        <Navigator
          active={this.state.active === "notifications" ? true : false}
          onClick={() => this.handleClick("notifications")}
        >
          <i className="fas fa-bell" />
        </Navigator>
        <Navigator
          active={this.state.active === "profile" ? true : false}
          onClick={() => this.handleClick("profile")}
        >
          <i className="fas fa-user" />
        </Navigator>
      </Bar>
    );
  }
}

const mapstate = state => {
  return {
    uploadingImage: state.ask.uploading
  };
};

export default connect(mapstate)(BottomNavigator);
