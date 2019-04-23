import React from "react";
import styled, { css } from "styled-components";
import { connect } from "react-redux";
import * as actions from "../../actions/feed/getFeedChron";
import colorParser from "./color/colorParser";
import mixpanel from "../../config/mixpanel";

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

const NameText = styled.h6`
  padding: 0;
  margin: 4px 0 0 0;
  font-size: 8px;
  font-weight: 400;
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
  display: flex;
  flex-direction: column;
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
    mixpanel.track("navigateTo" + identifier);
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
          onClick={() => {
            this.props.flushFeed();
            this.props.getFeed();
            this.handleClick("feed");
          }}
        >
          <i className="fas fa-home" />
          <NameText>Home</NameText>
        </Navigator>
        <Navigator
          active={this.state.active === "search" ? true : false}
          onClick={() => this.handleClick("search")}
        >
          <i className="fas fa-search" />
          <NameText>Search</NameText>
        </Navigator>
        <Navigator
          active={this.state.active === "ask" ? true : false}
          onClick={() => this.handleClick("ask")}
          style = {{
            backgroundColor: colorParser("primary"),
            height: "60px",
            width: "60px",
            marginBottom: "32px",
            borderRadius: "60px",
            display: "flex",
            flexDirection: "Column",
            justifyContent: "center",
            color: "#fff",
            border: "4px white solid"

          }}
        >
          {this.props.uploadingImage ? (
            <i className="fas fa-cloud-upload-alt" />
          ) : (
            <i className="fas fa-question" />
          )}
          <NameText>Ask</NameText>
        </Navigator>
        <Navigator
          active={this.state.active === "notifications" ? true : false}
          onClick={() => this.handleClick("notifications")}
        >
          <i className="fas fa-bell" />
          <NameText>Notify</NameText>
        </Navigator>
        <Navigator
          active={this.state.active === "profile" ? true : false}
          onClick={() => this.handleClick("profile")}
        >
          <i className="fas fa-user" />
          <NameText>Profile</NameText>
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

export default connect(
  mapstate,
  actions
)(BottomNavigator);
