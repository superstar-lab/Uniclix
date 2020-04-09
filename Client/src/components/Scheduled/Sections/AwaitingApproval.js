import React from 'react';
import { connect } from 'react-redux';

import { unapprovedPosts } from '../../../requests/channels';

import { LoaderWithOverlay } from '../../Loader';
import PostAwaitingApproval from '../components/PostAwaitingApproval';

class AwaitingApproval extends React.Component {

  state = {
    pendingPosts: [],
    page: 1,
    isLoading: false
  };

  componentDidMount() {
    this.getAwaitingPosts();
  }

  getAwaitingPosts = () => {
    const { page } = this.state;

    this.setState({ isLoading: true });
    unapprovedPosts(page)
      .then(response => {
        console.log(response);
        this.setState({ pendingPosts: response.items, isLoading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { pendingPosts, isLoading } = this.state;
    const { timezone, channels } = this.props;

    return !isLoading ? (
      <div className="awaiting-approval-container">
        {
          !!pendingPosts.length ? (
            <div>
              <div className="table-header">
                <div>Content</div>
                <div>Category</div>
                <div>Networks</div>
                <div>Publish date</div>
              </div>
              <div>
                {
                  pendingPosts.map(post =>
                    <PostAwaitingApproval
                      timezone={timezone}
                      channels={channels}
                      { ...post }
                    />
                  )
                }
              </div>
            </div>
          ) : (
            <div className="no-pendings">
              <img src="/images/alone.svg" />
              <div className="text">No posts wating for approval</div>
            </div>
          )
        }
      </div>
    ) : (
      <LoaderWithOverlay />
    );
  }
};

const mapStateToProps = (state) => {
  return {
    channels: state.channels.list
  };
};

export default connect(mapStateToProps, null)(AwaitingApproval);
