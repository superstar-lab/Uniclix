import React from 'react';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";
import moment from "moment";
import momentTz from "moment-timezone";
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { hours, minutes, dayTime } from "../fixtures/time";

class PublishButton extends React.Component {

    state = {
        canSchedule: false,
        showCalendar: false,
        calendarFocused: false,
        calendarData: {
            time: {
                hour: moment().add(1, "hours").format("hh"),
                minutes: minutes[Math.floor(Math.random() * minutes.length)],
                time: moment().format("A")
            }
        },
        publishState: {
            name: "Post at Best Time",
            value: "best"
        },
        postDate: moment(),
        publishTimestamp: null,
        publishDateTime: null,
        publishUTCDateTime: null,
        publishTimezone: momentTz.tz.guess()
    }

    componentDidMount() {
        if (this.props.post) {

            const postDate = (this.props.post ? this.props.post.type : 'store') === 'edit' ?
                this.props.post.scheduled_at_original :
                moment().add(1, "hours");
            let publishState = {
                name: "Custom Time",
                value: "date"
            };

            if (this.props.post.type == 'store') {
                publishState = {
                    name: "Post at Best Time",
                    value: "best"
                }
            }

            this.setState(() => ({
                postDate: moment(postDate),
                calendarData: {
                    time: {
                        hour: moment(postDate).format("hh"),
                        minutes: moment(postDate).format("mm"),
                        time: moment(postDate).format("A"),
                    }
                },
                publishState
            }), () => this.setPublishTimestamp());
        }

        if (!this.state.publishTimestamp) {
            this.setPublishTimestamp();
        }

        if (this.props.startAt) {
            this.setState({
                canSchedule: true,
                publishState: {
                    name: "Custom Time",
                    value: "date"
                },
                publishDateTime: this.props.startAt,
                postDate: moment(this.props.startAt),
                calendarData: {
                    time: {
                        hour: moment(this.props.startAt).format("hh"),
                        minutes: moment(this.props.startAt).format("mm"),
                        time: moment(this.props.startAt).format("A"),
                    }
                },
            })
            this.onDateChange(this.props.startAt)
            setTimeout(() => {
                this.setScheduledLabel()
            }, 1)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.post !== this.props.post && this.props.post) {
            const postDate = (this.props.post ? this.props.post.type : 'store') === 'edit' ?
                this.props.post.scheduled_at_original :
                moment().add(1, "hours");
            let publishState = {
                name: "Custom Time",
                value: "date"
            };

            if (this.props.post.type == 'store') {
                publishState = {
                    name: "Post at Best Time",
                    value: "best"
                }
            }

            this.setState(() => ({
                postDate: moment(postDate),
                calendarData: {
                    time: {
                        hour: moment(postDate).format("hh"),
                        minutes: moment(postDate).format("mm"),
                        time: moment(postDate).format("A"),
                    }
                },
                publishState
            }), () => this.setPublishTimestamp());
        }
    }

    setPublishState = (publishState, close = false) => {
        this.setState(() => ({
            publishState,
            showCalendar: false
        }), () => {

            this.setScheduledLabel();

            if (close) {
                close();
            }
        });
    };

    setScheduledLabel = () => {

        let scheduledLabel = "";

        if (this.state.canSchedule && this.state.publishState.value === "date") {
            scheduledLabel = `Scheduled: ${moment(this.state.publishDateTime).format("DD MMMM YYYY hh:mmA")}`;
        }

        if (typeof this.props.onChange !== "undefined") {
            this.props.onChange(scheduledLabel);
        }
    }

    setPublishTimestamp = () => {
        const postDate = this.state.postDate;
        const date = moment(postDate).format("YYYY-MM-DD");
        const time = this.state.calendarData.time;
        const formatted24HTime = moment(`${time.hour}:${time.minutes} ${time.time}`, "hh:mm a").format("HH:mm");
        const dateTime = date.concat(`T${formatted24HTime}`);

        this.setState(() => ({
            publishTimestamp: moment(dateTime).unix(),
            publishDateTime: moment(dateTime).format("YYYY-MM-DDTHH:mmZ"),
            publishUTCDateTime: moment(dateTime).utc().format("YYYY-MM-DDTHH:mm")
        }),
            () => {
                if (this.state.publishTimestamp > moment().unix()) {
                    this.setState(() => ({
                        canSchedule: true
                    }), () => {
                        this.setScheduledLabel();
                    });
                } else {
                    this.setState(() => ({
                        canSchedule: false
                    }));
                }
            });
    };

    onFocusChange = ({ focused }) => {
        this.setState((prevState) => ({
            calendarFocused: focused,
            showCalendar: !focused ? focused : prevState.showCalendar
        }));
    };

    onDateChange = (postDate) => {
        this.setState(() => ({ postDate }), () => this.setPublishTimestamp());
    };

    onHourChange = (e) => {
        const value = e.target.value;
        this.setState((prevState) => {

            const calendarData = prevState.calendarData;
            calendarData.time.hour = value;

            return {
                calendarData
            }
        }, () => this.setPublishTimestamp());
    };

    onMinutesChange = (e) => {
        const value = e.target.value;
        this.setState((prevState) => {
            const calendarData = prevState.calendarData;
            calendarData.time.minutes = value;

            return {
                calendarData
            }
        }, () => this.setPublishTimestamp());
    };

    onTimeChange = (e) => {
        const value = e.target.value;
        this.setState((prevState) => {
            const calendarData = prevState.calendarData;
            calendarData.time.time = value;

            return {
                calendarData
            }
        }, () => this.setPublishTimestamp());
    };


    render() {
        return (
            <div className="publish-group gradient-background-teal-blue link-cursor">

                <Popup
                    trigger={<button className="picker-btn fa fa-caret-up naked-button btn-side-arrow"></button>}
                    on="click"
                    position="top center"
                    arrow={!this.state.showCalendar}
                    closeOnDocumentClick={true}
                >
                    {
                        close => (
                            <div className="popup-options">

                                {!this.state.showCalendar ?

                                    <div className="tooltip-menu">
                                        <div onClick={() => this.setPublishState({ name: "Post right now", value: "now" }, close)} className="menu-item">
                                            <h4>Post now</h4>
                                            <p>Share right away</p>
                                        </div>
                                        <div onClick={() => { this.onFocusChange({ focused: true }); this.setState(() => ({ showCalendar: true })) }} className="menu-item">
                                            <h4>Post at Custom Time</h4>
                                            {!(this.state.canSchedule && this.state.publishState.value === "date") ?
                                                <p>Schedule at a specific time</p>
                                                :
                                                <p className="schedule-info">{moment(this.state.publishDateTime).format("DD MMMM YYYY hh:mmA")}</p>
                                            }
                                        </div>
                                        <div onClick={() => this.setPublishState({ name: "Post at Best Time", value: "best" }, close)} className="menu-item">
                                            <h4>Post at Best Time</h4>
                                            <p>Share when your audience is most active</p>
                                        </div>
                                    </div>

                                    :

                                    <div className="uc-calendar">
                                        <SingleDatePicker
                                            onDateChange={this.onDateChange}
                                            date={this.state.postDate}
                                            focused={this.state.calendarFocused}
                                            onFocusChange={this.onFocusChange}
                                            numberOfMonths={1}
                                            showDefaultInputIcon={false}
                                            keepOpenOnDateSelect={true}
                                            keepFocusOnInput={true}
                                            inputIconPosition="after"
                                            readOnly={true}
                                            small={true}
                                            customInputIcon={
                                                <div>
                                                    <div className="uc-calendar-time-picker">
                                                        <select onChange={this.onHourChange} value={this.state.calendarData.time.hour} className="hours">
                                                            {hours.map((hour) => (
                                                                <option key={hour} value={hour}>{hour}</option>
                                                            ))}

                                                        </select>

                                                        <select onChange={this.onMinutesChange} value={this.state.calendarData.time.minutes} className="minutes">
                                                            {minutes.map((minute) => (
                                                                <option key={minute} value={minute}>{minute}</option>
                                                            ))}
                                                        </select>

                                                        <select onChange={this.onTimeChange} value={this.state.calendarData.time.time} className="dayTime">
                                                            {dayTime.map((time) => (
                                                                <option key={time} value={time}>{time}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div
                                                        onClick={() => {
                                                            if (this.state.canSchedule) {
                                                                this.setPublishState({ name: "Custom Time", value: "date" }, close)
                                                            }
                                                        }
                                                        }
                                                        className={`btn naked-button date-btn ${!this.state.canSchedule ? 'disabled' : ''}`}>
                                                        Done
                                            </div>
                                                </div>
                                            }
                                        />
                                    </div>
                                }

                            </div>
                        )
                    }
                </Popup>

                <button onClick={() => {
                    if (!this.props.restricted && (this.state.canSchedule || this.state.publishState.value !== 'date')) {
                        this.props.action({
                            publishState: this.state.publishState,
                            publishTimestamp: this.state.publishTimestamp,
                            publishDateTime: this.state.publishDateTime,
                            publishUTCDateTime: this.state.publishUTCDateTime,
                            publishTimezone: this.state.publishTimezone
                        }, this.state.publishState.value);
                    }
                }} className={`publish-btn naked-button half-btn ${
                    !this.props.restricted && (this.state.canSchedule || this.state.publishState.value !== 'date') ?
                        '' : 'disabled-btn'}`}>
                    {this.state.publishState.name}</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        post: state.posts.post
    }
};

export default connect(mapStateToProps)(PublishButton);