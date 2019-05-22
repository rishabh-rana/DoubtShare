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
  console.log(props.data);

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
        {props.data ? props.data.displayName || "User" : "User"}
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
        <div>
          <DisplayFollowerNumber>
            {(props.data && props.data.points) || 0}
          </DisplayFollowerNumber>
          <DisplayFollowerLabel>Points</DisplayFollowerLabel>
        </div>
        <div onClick={() => props.changeDisplay("followed")}>
          <DisplayFollowerNumber>
            {props.data && props.data.followed
              ? Object.keys(props.data.followed).length
              : 0}
          </DisplayFollowerNumber>
          <DisplayFollowerLabel>Followed</DisplayFollowerLabel>
        </div>
      </FollowBar>

      {!props.otherPersonProfile && props.displayFoll !== null && (
        <ShowFoll
          history={props.history}
          data={props.data}
          type={props.displayFoll}
        />
      )}

      {props.otherPersonProfile && (
        <div style={{ padding: "10px" }}>
          <Button
            label={props.isFollower ? "UnFollow" : "Follow"}
            color="dark"
            onClick={props.handleFollow}
          />
        </div>
      )}

      <OptionsBar>
        {!props.otherPersonProfile && (
          <Options
            active={props.selected === "FOL" ? true : false}
            onClick={() => props.selectSection("FOL")}
          >
            Reasked
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

const ScrollHorizontal = styled.div`
  width: 100%;
  height: 30px;
  background: ${colorParser("primary")};
  overflow-x: scroll;
  margin-top: 30px;
  margin-bottom: 10px;
  padding-top: 10px;
  display: ${props => (props.hide ? "none" : "block")};
`;
const SingleFoll = styled.div`
  width: 150px;
  text-align: center;
  overflow: hidden;
  display: inline-block;
  text-decoration: underline;
`;

const Triangle = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid ${colorParser("primary")};
  position: absolute;
  top: -8px;
  left: ${props => (props.left ? "15%" : "80%")};
  display: ${props => (props.hide ? "none" : "block")};
`;

const ShowFoll = props => {
  let items, data;
  if (props.type === "followers") {
    items = Object.keys(props.data.followers);
    data = props.data.followers;
  } else if (props.type === "followed") {
    items = Object.keys(props.data.followed);
    data = props.data.followed;
  }

  return (
    <div style={{ position: "relative" }}>
      <Triangle
        hide={items.length === 0 ? true : false}
        left={props.type === "followers" ? true : false}
      />
      <ScrollHorizontal hide={items.length === 0 ? true : false}>
        <div style={{ width: items.length * 150 + "px" }}>
          {items.map(foll => {
            return (
              <SingleFoll
                onClick={() => {
                  props.history.push("/view_profile/" + foll);
                }}
              >
                {data[foll]}
              </SingleFoll>
            );
          })}
        </div>
      </ScrollHorizontal>
    </div>
  );
};

export default ProfileHeader;
