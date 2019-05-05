import React from "react";
import { connect } from "react-redux";
import Tagging from "../../tagging/tagging";
import * as actions from "../../../actions/feed/getFeedChron";
import * as err from "../../../actions/error/errorHandler";
import FeedView from "../feed/feedView";
import Button from "../../ui/button";
import styled from "styled-components";
import mixpanel from "../../../config/mixpanel";
import ErrorBoundary from "../../errorHandler/ErrorBoundary";
import GhostUIFeedCard from "../feed/ghostUI";

const Taglist = styled.div`
  margin-top: 20px;
`;
const Header = styled.div`
  font-size: 22px;
  text-align: center;
  margin-top: 20px;
  color: grey;
  opacity: 0.8;
  margin-bottom: 20px;
`;

const Headertag = styled.div`
  font-size: 25px;
  margin-top: 40px;
`;

const Tags = styled.div`
  font-size: 12px;
  padding: 8px 20px;
  background-color: #e0e0e0;
  display: inline-block;
  border-radius: 4px;
  margin-right: 10px;
  margin-top: 10px;
`;

class SearchScreen extends React.Component {
  state = {
    tags: [],
    active: false
  };

  taglist = [
    "circular motion",
    "Permutations and combinations",
    "newton's laws of motion",
    "Friction"
  ];

  validateSubmission = () => {
    if (this.state.tags.length === 0) {
      this.props.throwerror({
        message: "Please add a tag"
      });
      return false;
    }

    return true;
  };
  syncTags = taglist => {
    this.setState({
      tags: taglist
    });
  };

  prepTags = () => {
    // pull tags from state
    let array = [...this.state.tags];
    // sort by alphabet
    array.sort(function(a, b) {
      var nameA = a.toLowerCase(),
        nameB = b.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    let string = "";

    for (var i in array) {
      string += array[i] + "$";
    }

    return string.slice(0, string.length - 1);
  };

  handleSearch = async () => {
    mixpanel.track("pressedSearchButtonOnSearchScreen");
    if (!this.validateSubmission()) return;
    this.setState({
      loading: true
    });
    this.props.flushFeed();
    await this.props.getFeed("tags." + this.prepTags());
    this.setState({
      active: true,
      loading: false,
      tags: [],
      currentFilter: this.prepTags()
    });
  };

  handleTagPress = tag => {
    this.setState({ tags: [tag] }, () => {
      this.handleSearch();
    });
  };

  componentDidMount() {
    if (this.props.searchFilter) {
      this.handleTagPress(this.props.searchFilter);
      this.props.setFilter(null);
    }
  }

  render() {
    console.log(this.state.tags);
    let content = (
      <ErrorBoundary>
        <div
          style={{
            padding: "16px"
          }}
        >
          <Header>Select a topic from the list</Header>
          <Tagging syncTags={this.syncTags} tags={this.state.tags} />

          <Button
            label="Search by Topic"
            onClick={this.handleSearch}
            marginTop="10px"
            color="primary"
          />

          <Headertag>Popular Topics</Headertag>

          <Taglist>
            {this.taglist.map(tag => {
              return (
                <Tags key={tag} onClick={() => this.handleTagPress(tag)}>
                  #{tag}{" "}
                </Tags>
              );
            })}
          </Taglist>
        </div>
      </ErrorBoundary>
    );

    if (this.state.loading) {
      content = <GhostUIFeedCard />;
    } else if (!this.state.loading && this.state.active) {
      content = (
        <div style={{ overflowY: "scroll" }}>
          <div
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              zIndex: 1000
            }}
          >
            <Button
              label="Back"
              color="secondary"
              onClick={() => this.setState({ active: false })}
            />
          </div>
          <FeedView
            history={this.props.history}
            stopRefresh={true}
            filter={"tags." + this.state.currentFilter}
          />
        </div>
      );
    }

    return content;
  }
}

const mapstate = state => {
  return {
    searchFilter: state.feed.searchFilter
  };
};

export default connect(
  mapstate,
  { ...actions, ...err }
)(SearchScreen);
