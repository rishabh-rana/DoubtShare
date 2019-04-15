import React from "react";
import styled, { css } from "styled-components";

//styled divs
const DropItemTray = styled.div`
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.25rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-top: none;
  height: auto;
  overflow: hidden;
`;

const DropItem = styled.div`
  display: block;
  width: 100%;
  padding: 7px;
  padding-top: 10px;
  height: 28px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
  cursor: pointer;
  background: rgba(100, 100, 100, 0.1);
  ${props =>
    props.active &&
    css`
      background: rgba(100, 100, 100, 0.2);
    `};
`;

// main class
class DropDown extends React.Component {
  // state: main contains the records to be displayed
  // active is the current active item
  state = {
    main: [],
    active: 0
  };
  // handle list traversal using keyboard
  handleKeyboardInput = e => {
    if (e.key === "ArrowDown" && this.state.active < 2) {
      e.preventDefault();
      // set the item below as active
      this.setState({
        active: this.state.active + 1
      });
    } else if (e.key === "ArrowUp" && this.state.active > 0) {
      e.preventDefault();
      this.setState({
        active: this.state.active - 1
      });
    } else if (e.key === "Enter") {
      // e.preventDefault();
      // ensure myTag exists before trying to append it
      if (this.state.main.length !== 0 && this.state.main[this.state.active]) {
        var myTag = this.state.main[this.state.active].t;
        this.props.handleTagSelection(myTag);
      }
    }
  };

  //Lifecycle hooks

  // //renderblocker
  // shouldComponentUpdate(nextProps, nextState) {
  //   // if the active property changes, update
  //   if (this.state.active !== nextState.active) {
  //     return true;
  //   }
  //   // if number of options in the main changes, update
  //   if (this.state.main.length !== nextProps.main.length) {
  //     return true;
  //   }
  //   //if the options changes, update PLUS if no update, DO nOT update

  //   // if here, implies that currently there are no options in the state
  //   //id any option in passed, update
  //   if (nextProps.main[0]) {
  //     return true;
  //   }
  //   // if here, do not update
  //   return true;
  // }

  //on updating,
  componentDidUpdate() {
    console.log(this.state.main);
    //if options changes, update options
    if (this.state.main !== this.props.main) {
      //set options and active to first element
      this.setState({
        main: this.props.main,
        active: 0
      });
    }
  }

  //on mounting, wire up to keyboard events
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyboardInput);
  }
  //unwire keyboard events
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyboardInput);
  }
  // render the dropdown
  render() {
    return (
      <DropItemTray key={this.state.active}>
        {this.state.main.map((item, index) => {
          return (
            <DropItem
              key={index}
              active={index === this.state.active}
              onClick={() => this.props.handleTagSelection(item.t)}
            >
              {item.t}
            </DropItem>
          );
        })}
      </DropItemTray>
    );
  }
}

export default DropDown;
