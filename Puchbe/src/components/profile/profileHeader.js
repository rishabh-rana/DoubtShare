import React from "react";
import styled from "styled-components";
import colorParser from "../ui/color/colorParser";

const Container = styled.div`
  width: 100%;
  text-align: center;
  background: ${colorParser("primary")};
  color: ${colorParser("dark")};
  padding-top: 120px;
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
  background: ${colorParser("dark")};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const Options = styled.div`
  opacity: ${props => (props.active ? 1 : 0.4)};
  color: ${colorParser("light")};
  text-align: center;
  padding: 20px;
  font-size: 18px;
  padding-bottom: ${props => (props.active ? "10px" : "15px")};
`;

const HighlightBar = styled.div`
  width: 100%;
  height: 2px;
  background: ${colorParser("light")};
  box-shadow: 0 0 15px ${colorParser("light")};
  margin-top: 5px;
  display: ${props => (props.active ? "block" : "none")};
`;

const OptionsButton = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 50px;
  height: 30px;
  padding-top: 10px;
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
`;

// props.selectSection("ANS")
// props.selected
// props.auth.displayName
// <i className="fas fa-user" />

const ProfileHeader = props => {
  return (
    <Container>
      <OptionDropDown signout={props.signout} />
      <ProfilePic>
        <i className="fas fa-user" />
      </ProfilePic>

      <NameLabel>{props.auth.displayName}</NameLabel>

      <OptionsBar>
        <Options
          active={props.selected === "FOL" ? true : false}
          onClick={() => props.selectSection("FOL")}
        >
          Followed
          <HighlightBar active={props.selected === "FOL" ? true : false} />
        </Options>
        <Options
          active={props.selected === "ASK" ? true : false}
          onClick={() => props.selectSection("ASK")}
        >
          Asked
          <HighlightBar active={props.selected === "ASK" ? true : false} />
        </Options>
        <Options
          active={props.selected === "BKM" ? true : false}
          onClick={() => props.selectSection("BKM")}
        >
          Bookmarked
          <HighlightBar active={props.selected === "BKM" ? true : false} />
        </Options>
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
