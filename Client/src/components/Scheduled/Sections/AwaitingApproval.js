import React from 'react';
import { connect } from 'react-redux';

import { LoaderWithOverlay } from '../../Loader';
import PostAwaitingApproval from '../components/PostAwaitingApproval';

class AwaitingApproval extends React.Component {

  state = {
    pendingPosts: [],
    page: 1,
    isLoading: false
  };

  render() {
    const { isLoading } = this.state;
    const { timezone, channels, pendingPosts } = this.props;

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
                      getAwaitingPosts={this.props.getAwaitingPosts}
                      { ...post }
                    />
                  )
                }
              </div>
            </div>
          ) : (
            <div className="no-pendings">
              <img src="/images/alone.svg" />
              <div className="text">You are all set! There are no pending approvals at this time.</div>
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
