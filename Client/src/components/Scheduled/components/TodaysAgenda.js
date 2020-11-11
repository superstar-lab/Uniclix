import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import AgendaItem from './AgendaItem';

class TodaysAgenda extends React.Component {
  state = {
    showAgenda: false
  }

  filterTodaysByTimezone = (post) => {
    const { timezone } = this.props;
    const currentDate = timezone ? moment().tz(timezone) : moment();
    const { payload: { scheduled: { publishUTCDateTime } } } = post;
    const postDateTime = moment(publishUTCDateTime).tz(timezone);

    return postDateTime.date() === currentDate.date() &&
      postDateTime.month() === currentDate.month();
  }

  toggleAgenda = () => {
    this.setState({ showAgenda: !this.state.showAgenda });
  }

  render() {
    const { posts, timezone, channelsList, startTour } = this.props;
    const { showAgenda } = this.state;
    const currentDate = timezone ? moment().tz(timezone) : moment();
    let lastDate = '';
    const agendaPosts = posts.filter(this.filterTodaysByTimezone);
    
    return (
      <div className="agenda-container">
        {
          showAgenda && (
            <div className="todays-agenda">
              { !!agendaPosts.length && (
                <React.Fragment>
                  <div className="ta-title">
                    <span className="ta-label">Today’s agenda,</span>
                    <span>{currentDate.format('MMM D.')}</span>
                  </div>
                  {
                    agendaPosts.map((post) => {
                      let showTime = false;
                      
                      if (lastDate !== post.payload.scheduled.publishUTCDateTime) {
                        lastDate = post.payload.scheduled.publishUTCDateTime;
                        showTime = true;
                      }

                      return (
                        <React.Fragment>
                          {
                            showTime && (
                              <div className="time-title">
                                <div className="time">
                                  {moment(post.payload.scheduled.publishUTCDateTime).tz(timezone).format("h.mm A")}
                                </div>
                                <div className="separator"></div>
                              </div>
                            )
                          }
                          <AgendaItem key={post.id} post={post} channelsList={channelsList} />
                        </React.Fragment>
                      )
                    })
                  }
                  </React.Fragment>
                )
              }
              {
                !agendaPosts.length && (
                  <div className="no-agenda">
                    <img src="../images/empty-agenda.svg"/>
                    <div className="no-agenda-title">Nothing here</div>
                    <div className="no-agenda-msg">Once you schedule posts they will show up here.</div>
                  </div>
                )
              }
            </div>
          )
        }
        <div className={`post-queue-bar ${showAgenda ? 'open' : ''}`}>
          <div
            className={`calendar-opt option ${showAgenda ? 'active' : ''}`}
            onClick={this.toggleAgenda}
          >
            <i className="fa fa-calendar-o" />
          </div>
          <div
            className={`calendar-opt option`}
            onClick={startTour}
          >
            <i className="fa fa-question-circle-o" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    channelsList: state.channels.list
  };
};

export default connect(mapStateToProps, null)(TodaysAgenda);
