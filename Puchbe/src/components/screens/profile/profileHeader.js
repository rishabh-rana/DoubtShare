import React from "react";
import styled from "styled-components";
import colorParser from "../../ui/color/colorParser";
import mixpanel from "../../../config/mixpanel";
import Button from "../../ui/button";

const Container = styled.div`
  width: 100%;
  text-align: center;
  background: ${colorParser("light")};
  color: ${colorParser("dark")};
  padding-top: 32px;
`;

const ProfilePic = styled.div`
  font-size: 50px;
  margin-bottom: 10px;
`;

const NameLabel = styled.div`
  font-size: 22px;
  margin-bottom: 20px;
`;

const OptionsBar = styled.div`
  margin-top: 20px;
  background: ${colorParser("light")};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid ${colorParser("dark")};
  border-top: 1px solid ${colorParser("dark")};
`;

const Options = styled.div`
  opacity: ${props => (props.active ? 1 : 0.4)};
  color: ${colorParser("dark")};
  text-align: center;
  padding: 20px 0;
  font-size: 18px;
`;

const OptionsButton = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 50px;
  height: 30px;
  padding: 10px 0;
  font-size: 25px;
  text-align: center;
`;

const OptionsMenu = styled.div`
  background: ${colorParser("light")};
  padding: 5px;
  padding-right: 10px;
  position: absolute;
  right: 30px;
  top: 55px;
  width: 100px;
`;

const MenuOptions = styled.div`
  width: 100%;
  font-size: 18px;
  text-align: right;
  padding: 8px;
  background: rgba(200, 200, 200, 0.2);
`;

const FollowBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const DisplayFollowerNumber = styled.div`
  color: ${colorParser("primary")};
  font-size: 20px;
  text-align: center;
  display: block;
`;

const DisplayFollowerLabel = styled.div`
  font-size: 18px;
  text-align: center;
  display: block;
`;

// props.selectSection("ANS")
// props.selected
// props.auth.displayName
// <i className="fas fa-user" />

const ProfileHeader = props => {
  return (
    <Container>
      <OptionDropDown
        signout={props.signout}
        onClick={() => mixpanel.track("pressed3DotsOnProfile")}
      />
      <ProfilePic
        onClick={() => mixpanel.track("pressedProfileHeaderNonClickableArea")}
      >
        <i className="fas fa-user" />
      </ProfilePic>

      <NameLabel>
        {props.otherPersonProfile
          ? props.data
            ? props.data.name
            : "User"
          : props.auth.displayName}
      </NameLabel>

      <FollowBar>
        <div onClick={() => props.changeDisplay("followers")}>
          <DisplayFollowerNumber>
            {props.data && props.data.followers
              ? Object.keys(props.data.followers).length
              : 0}
          </DisplayFollowerNumber>
          <DisplayFollowerLabel>Followers</DisplayFollowerLabel>
        </div>
        <div onClick={() => props.changeDisplay("followed")}>
          <DisplayFollowerNumber>
            {props.data && props.data.followed
              ? Object.keys(props.data.followed).length
              : 0}
          </DisplayFollowerNumber>
          <DisplayFollowerLabel>Followed</DisplayFollowerLabel>
        </div>
        {props.otherPersonProfile && (
          <Button
            label={props.isFollower ? "UnFollow" : "Follow"}
            color="dark"
            onClick={props.handleFollow}
            width="35%"
          />
        )}
      </FollowBar>

      <OptionsBar>
        {!props.otherPersonProfile && (
          <Options
            active={props.selected === "FOL" ? true : false}
            onClick={() => props.selectSection("FOL")}
          >
            Followed
          </Options>
        )}
        {props.otherPersonProfile && (
          <Options
            active={props.selected === "ANS" ? true : false}
            onClick={() => props.selectSection("ANS")}
          >
            Answered
          </Options>
        )}
        <Options
          active={props.selected === "ASK" ? true : false}
          onClick={() => props.selectSection("ASK")}
        >
          Asked
        </Options>
        {!props.otherPersonProfile && (
          <Options
            active={props.selected === "BKM" ? true : false}
            onClick={() => props.selectSection("BKM")}
          >
            Bookmarked
          </Options>
        )}
      </OptionsBar>
    </Container>
  );
};

class OptionDropDown extends React.Component {
  state = {
    open: false
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleclick, false);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleclick, false);
  }

  handleclick = () => {
    if (this.state.open) {
      setTimeout(() => {
        this.setState({ open: false });
      }, 0);
    }
  };

  render() {
    return (
      <React.Fragment>
        <OptionsButton onClick={() => this.setState({ open: true })}>
          <i className="fas fa-ellipsis-v" />
        </OptionsButton>
        {this.state.open && (
          <OptionsMenu>
            <MenuOptions onClick={() => this.props.signout()}>
              Sign Out
            </MenuOptions>
          </OptionsMenu>
        )}
      </React.Fragment>
    );
  }
}

export default ProfileHeader;
