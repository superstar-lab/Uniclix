import React from 'react';
import PropTypes from 'prop-types';
import {Button, Select, TimePicker} from 'antd';
import moment from "moment";
import {connect} from "react-redux";
import { Draggable, Droppable } from 'react-drag-and-drop';

import PostsDayBestTime from './PostsDayBestTime';
import {setComposerModal, setComposerToEdit} from "../../../actions/composer";

const { Option } = Select;

class PostsDay extends React.Component {

  constructor(props) {
    super(props);

  }

  getDateTime = (time) => {
    const { timezone } = this.props;
    const dateTime = moment.tz(time, 'h:mm A', timezone).format('h:mm A');

    return dateTime;
  };

  render() {
    const { item : { day, settingTimes, weekdayNames }, timezone, indexI, selectedChannel, fetchMoreData, onResetPage, fetchPosts } = this.props;

    return (
      <div>
        {
          settingTimes.map((settingTime, index) => (
            <div
              id={day + ' ' + settingTime.time}
              className="infinite-time"
              onMouseEnter={() => this.props.onHover(indexI, index, false)}
              onMouseLeave={() => this.props.onHover(indexI, index, true)}
              style={{display: moment().tz(timezone).unix() > moment(day + ' ' + settingTime.time).tz(timezone).unix() ? "none" : ""}}
            >
              {
                settingTime.time === undefined ?
                  <PostsDayBestTime bestTime={settingTime} weekdayNames={weekdayNames} timezone={timezone} fetchMoreData={fetchMoreData} onResetPage={onResetPage} fetchPosts={fetchPosts}/>
                  :
                  settingTime.hover ?
                    <span>{this.getDateTime(settingTime.time)}</span>
                    :
                    <button className="btn-hover" id={day + ' ' + settingTime.time} onClick={(e)=>this.props.onBestPostClick(e)}>
                      <i id={day + ' ' + settingTime.time} className={`fab fa-${selectedChannel.type} ${selectedChannel.type}_bg`}/>
                      <div id={day + ' ' + settingTime.time}>Schedule a Post</div>
                    </button>
              }
            </div>
          ))
        }
      </div>
    );
  }
}

export default PostsDay;