import React from 'react';
import PropTypes from 'prop-types';
import {Button, Select, TimePicker} from 'antd';
import moment from "moment";
import {connect} from "react-redux";
import {setComposerModal, setComposerToEdit} from "../../../actions/composer";

const { Option } = Select;

class PostsDayBestTime extends React.Component {

  constructor(props) {
    super(props);

  }

  getDateTime = (time) => {
    const { timezone } = this.props;
    const dateTime = moment.tz(time, 'yyyy-mm-dd h:mm A', timezone).format('h:mm A');

    return dateTime;
  };

  render() {
    const { channelsList, bestTime } = this.props;
    const { content, payload: { scheduled: { publishDateTime } }, category, channel_ids } = bestTime;
    const channels = channelsList.filter(channel => channel_ids.indexOf(channel.id) !== -1);

    return (
      <div className="infinite-best-time">
        <div className="infinite-best-time-title">
          <div className="col-xs-12 col-md-11">{content}</div>
          <i className="fa fa-close"/>
        </div>
        <div className="infinite-best-time-boundary" />
        <div className="infinite-best-time-body">
          <div className="infinite-best-time-channels col-xs-12 col-md-2">
            {
              channels.map(({ type, avatar }, index) => (
                <div key={`${type}-${index}`}>
                  <img src={avatar} />
                  <i className={`fab fa-${type} ${type}_bg`} />
                </div>
              ))
            }
          </div>
          <div className="infinite-best-time-category col-xs-12 col-md-1" style={{ backgroundColor: category.color }}>{category.category_name}</div>
          <div className="infinite-best-time-post col-xs-12 col-md-6"><p>This post will be published today at {this.getDateTime(publishDateTime)}</p></div>
          <div className="col-xs-12 col-md-1">
            <Button type="link">
              Edit
            </Button>
          </div>
          <div className="col-xs-12 col-md-1">
            <Button
              type="primary"
              shape="round"
              size="large"
            >
              Share Now
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    channelsList: state.channels.list,
  };
};

export default connect(mapStateToProps, { setComposerModal, setComposerToEdit })(PostsDayBestTime);