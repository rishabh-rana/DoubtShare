import React from "react";
import Fuse from "fuse.js";
import { tags } from "../../tags";
import styled, { css } from "styled-components";
import DropDown from "./dropdownResults";
import { connect } from "react-redux";
import * as throwerror from "../../actions/error/errorHandler";
import colorParser from "../ui/color/colorParser";

const DropList = styled.div`
  display: block;
  position: relative;
  width: 100%;
  z-index: 1000;
`;

const Input = styled.input`
  width: 100%;
  padding: 7px;
  padding-right: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
  border-radius: 5px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  font-size: 18px;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box;
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.6);
  }
`;

const Taglist = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const Tag = styled.div`
  padding: 8px;
  padding-right: 18px;
  background: ${colorParser("secondary")};
  color: white;
  font-size: 16px;
  border-radius: 5px;
  width: auto;
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
`;

const TagCrossUI = styled.div`
  position: absolute;
  font-size: 10px;
  color: white;
  opacity: 0.8;
  top: 5px;
  right: 8px;
`;

class Tagging extends React.Component {
  state = {
    input: "",
    matchedRecords: [],
    inFocus: false
  };
  //fuse.js options
  options = {
    threshold: 0.1,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: ["t"]
  };
  // the fuse object, initialised as public property
  fuse = null;
  //the number of results to be displayed in the dropdown
  numberofResults = 3;
  maxTags = 3;

  handleBlur = () => {
    setTimeout(() => {
      this.setState({
        inFocus: false
      });
    }, 10);
  };
  handleFirstType = () => {
    this.setState({
      inFocus: true
    });
  };

  handleChange = e => {
    this.setState(
      {
        input: e.target.value
      },
      () => {
        this.handleMatching();
      }
    );
  };

  //handle fuzzy search with fuse.js
  //stopDelayMatchingTimeout ensures that only after ;matchDelay' milliseconds, the dropdown is calculated
  handleMatching = () => {
    var match = this.fuse
      .search(this.state.input)
      .slice(0, this.numberofResults);

    //if match is an exact match, remove the dropdown results
    if (match && match[0] && match[0].t === this.state.input) {
      var newinputParser = [...this.props.tags, this.state.input];

      this.setState({
        matchedRecords: [],
        input: ""
      });

      // sync tags with parent
      this.props.syncTags(newinputParser);

      // exits to prevent calling setState below
      return;
    }
    // if new matches are found, set them as new options
    if (match !== this.state.matchedRecords) {
      this.setState({
        matchedRecords: match
      });
    }
  };

  //handle the tag selection from dropdown
  handleTagSelection = tag => {
    if (!this.validateTagAddition(tag)) return;

    var newinputParser = [...this.props.tags];

    newinputParser.push(tag);

    this.setState({
      input: "",
      matchedRecords: []
    });

    // sync tags with parent
    this.props.syncTags(newinputParser);
  };

  componentDidMount() {
    this.fuse = new Fuse(tags, this.options);
  }

  handleTagPop = index => {
    let newinputParser = [...this.props.tags];
    newinputParser.splice(index, 1);

    // sync tags with parent
    this.props.syncTags(newinputParser);
  };

  validateTagAddition = tag => {
    if (this.props.tags.indexOf(tag) !== -1) {
      this.props.throwerror({
        message: "Cannot add duplicate tags"
      });
      return false;
    }

    if (this.props.tags.length > this.maxTags) {
      this.props.throwerror({
        message: "Cannot add more than " + this.maxTags + " tags"
      });
      return false;
    }
    return true;
  };

  render() {
    return (
      <div>
        <Input
          autoComplete="off"
          value={this.state.input}
          onChange={e => this.handleChange(e)}
          onFocus={this.handleFirstType}
          onBlur={this.handleBlur}
          placeholder="search topics from list"
        />

        {this.state.inFocus && (
          <DropList>
            <DropDown
              main={this.state.matchedRecords}
              handleTagSelection={this.handleTagSelection}
            />
          </DropList>
        )}
        <Taglist>
          {this.props.tags.map((tagged, index) => {
            return (
              <Tag onClick={() => this.handleTagPop(index)} key={index}>
                <TagCrossUI>
                  <i className="fas fa-times" />
                </TagCrossUI>
                {tagged}
              </Tag>
            );
          })}
        </Taglist>
      </div>
    );
  }
}
export default connect(
  null,
  throwerror
)(Tagging);
