import React, { useState } from 'react';
import { connect } from 'react-redux';
import moment from "moment";
import SweetAlert from 'sweetalert2-react';
import { setPost } from '../actions/posts';
import Loader from './Loader';
import { setComposerModal } from "../actions/composer";
import SocialAccountsPrompt from "./SocialAccountsPrompt";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

// const DraggableCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment)

export const PostListCalendar = ({
    action,
    setAction,
    destroyPost,
    publishPost,
    approvePost,
    error,
    setError,
    posts,
    loading,
    type,
    events,
    titleDate,
    changeView,
    onPrevDate,
    onNextDate,
    setPost,
    setComposerModal,
    viewTypes,
    viewType,
    Navigate,
    calendarDate
}) => {
    return (
        <div>
            <SweetAlert
                show={!!action.id}
                title={`Do you wish to ${action.type} this item?`}
                text="To confirm your decision, please click one of the buttons below."
                showCancelButton
                type="warning"
                confirmButtonText="Yes"
                cancelButtonText="No"
                onConfirm={() => {
                    if (action.type === 'delete') {
                        destroyPost(action.id);
                    } else if (action.type === 'post') {
                        publishPost(action.id);
                    } else {
                        console.log('something went wrong');
                    }

                    setAction();
                }}
                onCancel={() => {
                    setAction();
                }}
                onClose={() => setAction()}
            />

            <SweetAlert
                show={!!error}
                title={`Error`}
                text={`${error}`}
                type="error"
                confirmButtonText="Ok"
                cancelButtonText="No"
                onConfirm={() => {
                    setError(false);
                }}
            />

            {(posts.length < 1 && !loading) &&
                <SocialAccountsPrompt
                    image="/images/connect_twitter_accounts.svg"
                    title={type !== "past-scheduled" ? "Save time with scheduled post" : "You have no old posts"}
                    description={type == "unapproved-posts" ? "You have no post in approval queue" : "Use Compose box to schedule posts and publish automatically throughout the day or week"}
                    buttonTitle="Publish now and get started"
                    action={() => setComposerModal(true)}
                />
            }

            {loading && <Loader />}

            <div className="row">
                <div className="col-xs-12 col-md-12 col-lg-9">
                    {(events.length > 0 && !loading) &&
                        <div className="calendar-events ">
                            <div className="calendar-events-head row">
                                <div className="calendar-navigation  col-12 col-md-6">
                                    <button className="prev-day" onClick={(e) => { onPrevDate() }}>
                                        <i className="fa fa-angle-left" aria-hidden="true"></i>
                                    </button>
                                    <div className="date-bar">
                                        <span className="formated-date">{titleDate}</span>
                                    </div>
                                    <button className="next-day" onClick={(e) => { onNextDate() }}>
                                        <i className="fa fa-angle-right" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div className="calendar-view col-12 col-md-6">
                                    <label htmlFor="name">Display by</label>
                                    <select type="text"
                                        value={viewType}
                                        onChange={(e) => changeView(e)} name="type"
                                        className="form-control whiteBg" id="type">
                                        <option disabled>Choose type</option>
                                        {viewTypes.map(view => (
                                            <option value={view.id}>{view.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                defaultView='week'
                                view={viewType}
                                popup={false}
                                selectable={true}
                                defaultDate={calendarDate}
                                date={calendarDate}
                                onNavigate={() => ({ calendarDate, viewType, Navigate })}
                                onSelectSlot={(slotInfo) => {
                                    setComposerModal(true, slotInfo.start)
                                }}
                                eventPropGetter={
                                    (event) => {
                                        let newStyle = {
                                            borderColor: '#0073B1',
                                            padding: 8
                                        };
                                        return {
                                            style: newStyle,
                                        };
                                    }
                                }
                                components={{
                                    event: ({ event: event }) => {
                                        let timeEvent = new Date(event.scheduled_at);
                                        return (
                                            <div className="card-event-calendar">
                                                <span>{moment(timeEvent).format("h:mm A")}</span>
                                                <h2>{(event.content).substring(0, 40) + "..."}</h2>
                                                <div className="open-event">
                                                    <div className="event-header">
                                                        <label>Bussines</label>
                                                        <div className="event-action">
                                                            <a onClick={() => {
                                                                setComposerModal(true);
                                                                setPost(
                                                                    {
                                                                        id: event.id,
                                                                        content: event.content,
                                                                        images: typeof (event.payload.images) !== "undefined" ? event.payload.images.map((image) => image.absolutePath) : [],
                                                                        scheduled_at: event.scheduled_at,
                                                                        scheduled_at_original: event.scheduled_at_original,
                                                                        type: type !== 'past-scheduled' ? 'edit' : 'store'
                                                                    });
                                                            }} className="link-cursor">
                                                                {type === 'past-scheduled' ?
                                                                    <i class="fas fa-history flip-h"></i>
                                                                    :
                                                                    <i class="fas fa-pen"></i>
                                                                }
                                                            </a>
                                                            <a className="link-cursor danger-btn"
                                                                onClick={() => setAction({ type: 'delete', id: event.id })}>
                                                                <i class="far fa-trash-alt"></i>
                                                            </a>

                                                            <a onClick={() => {
                                                                let element = document.getElementsByClassName("rbc-selected");
                                                                element[0].classList.remove("rbc-selected");
                                                            }}>
                                                                <i class="fas fa-times"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <span>
                                                        {moment(timeEvent).format("ddd DD, LT")}
                                                    </span>
                                                    <p>{event.content}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                }}

                            />
                        </div>
                    }
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3">
                    {posts.map((postGroup, index) => (
                        <div key={index} className="item-list shadow-box">
                            <div className="item-header schedule-header">
                                <h4>{
                                    moment(postGroup[0].scheduled_at_original).calendar(null, {
                                        sameDay: '[Today]',
                                        nextDay: '[Tomorrow]',
                                        nextWeek: 'dddd',
                                        lastDay: '[Yesterday]',
                                        lastWeek: '[Last] dddd',
                                        sameElse: 'DD/MM/YYYY'
                                    })
                                }</h4>
                            </div>

                            {postGroup.map((post) => (
                                <div key={post.id} className={`item-row schedule-row ${type}`}>
                                    <div className="profile-info pull-left">

                                        <h4>{moment(post.scheduled_at_original).format("h:mm A")}<small className="red-txt">{post.status < 0 ? ' (failed)' : ''}</small></h4>

                                        {!!(typeof (post.payload.images) !== "undefined") && post.payload.images.map((image, index) => (
                                            <img key={index} src={image.absolutePath} />
                                        ))}

                                    </div>
                                    <div className="item-actions pull-right">
                                        <ul>
                                            <li className="text-links link-inactive">
                                                <a onClick={() => {
                                                    setComposerModal(true);
                                                    setPost(
                                                        {
                                                            id: post.id,
                                                            content: post.content,
                                                            images: typeof (post.payload.images) !== "undefined" ? post.payload.images.map((image) => image.absolutePath) : [],
                                                            scheduled_at: post.scheduled_at,
                                                            scheduled_at_original: post.scheduled_at_original,
                                                            type: type !== 'past-scheduled' ? 'edit' : 'store'
                                                        });
                                                }} className="link-cursor">
                                                    {`${type === 'past-scheduled' ? 'Reschedule' : 'Edit'}`}
                                                </a>
                                            </li>
                                            <li className="text-links link-inactive"><a className="link-cursor danger-btn" onClick={() => setAction({ type: 'delete', id: post.id })}>Delete</a></li>
                                            {type !== "unapproved-posts" ?
                                                <li className="text-links"><a className="link-cursor" onClick={() => setAction({ type: 'post', id: post.id })}>Post Now</a></li>
                                                :
                                                <li className="text-links"><a className="link-cursor" onClick={() => approvePost(post.id)}>Approve</a></li>
                                            }
                                        </ul>
                                    </div>
                                    <div className="profile-info pull-left">
                                        <span>{post.content}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
const mapDispatchToProps = (dispatch) => ({
    setPost: (post) => dispatch(setPost(post)),
    setComposerModal: (modal, data = null) => dispatch(setComposerModal(modal, data))
});

export default connect(undefined, mapDispatchToProps)(PostListCalendar);