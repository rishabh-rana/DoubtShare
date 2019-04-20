import React from "react";
import { connect } from "react-redux";
import Tagging from "../ask/tagging";
import * as actions from "../../actions/feed/getFeedChron";
import * as err from "../../actions/error/errorHandler";
import FeedView from "../feed/feedView";
import Loader from "../ui/loader/loader";
import Button from "../ui/button";

import mixpanel from "../../config/mixpanel";
import ErrorBoundary from "../errorHandler/ErrorBoundary";
import GhostUIFeedCard from "../feed/ghostUI";

class SearchScreen extends React.Component {
  state = {
    tags: [],
    active: false
  };
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
      tags: []
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
    let content = (
      <ErrorBoundary>
        <div
          style={{
            padding: "16px",
            overflowY: "scroll",
            height: window.screen.height
          }}
        >
          <Tagging syncTags={this.syncTags} tags={this.state.tags} />

          <Button
            label="Search by Tags"
            onClick={this.handleSearch}
            marginTop="10px"
            color="primary"
          />
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
          <FeedView history={this.props.history} />
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
