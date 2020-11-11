import React from 'react';
import PropTypes from 'prop-types';

import TourWizard from '../../TourWizard';

class ScheduleWizard extends React.Component {
  static propTypes = {
    closeTour: PropTypes.func.isRequired
  }

  setUpTour = (nextStep, toggleCard) => {
    const isElmPresent = document.querySelectorAll('.new-post.step-1');

    // We don't want to delay the tour if is not necessary
    if (!!isElmPresent.length) return;
  
    // We click on the tab to navigate to it
    document.querySelectorAll('.ant-tabs-tab')[0].click();
    toggleCard();

    // We need to constantly check if the element is present,
    // that our way to know that the page loaded
    const intervalId = setInterval(() => {
      const el = document.querySelectorAll('.new-post.step-1');

      if (el) {
        nextStep();
        toggleCard();
        clearInterval(intervalId);
      }
    }, 1000);
  }

  openComposer = (nextStep, toggleCard) => {
    // We click on the tab to navigate to it
    document.querySelectorAll('.infinite-best-btn')[0].click();
    // We need to increase the z-index to overlap the composer's modal
    document.getElementById('tour-wizard-node').style = 'z-index: 1001';
    toggleCard();

    // We need to constantly check if the element is present,
    // that our way to know that the page loaded
    const intervalId = setInterval(() => {
      const el = document.querySelectorAll('.draft-body');

      if (el) {
        nextStep();
        toggleCard();
        clearInterval(intervalId);
      }
    }, 1000);
  }

  closeComposer = (nextStep, toggleCard) => {
    toggleCard();
    document.querySelectorAll('.composer-container #closeModal')[0].click();

    // We put the normal value back
    document.getElementById('tour-wizard-node').style = 'z-index: 1000';

    // We open the display-by dropdown to create the option elements
    document.querySelectorAll('.display-by .ant-select')[0].click();

    const intervalId = setInterval(() => {
      // We make sure to be on DAY view to continue with the tour
      const dayViewOption = document.querySelectorAll('.ant-select-dropdown-menu-item')[2];

      if (dayViewOption) {
        dayViewOption.click();
        const el = document.querySelectorAll('.infinite-scroll-component > div:first-child');

        if (el) {
          nextStep();
          toggleCard();
          clearInterval(intervalId);
        }
      }
    }, 300);
  }

  moveToScheduleSettings = (nextStep, toggleCard) => {
    // We click on the tab to navigate to it
    document.querySelectorAll('.ant-tabs-tab')[2].click();
    toggleCard();

    // We need to constantly check if the element is present,
    // that our way to know that the page loaded
    const intervalId = setInterval(() => {
      const el = document.querySelectorAll('.post-scheduling-time-section');

      if (el) {
        nextStep();
        toggleCard();
        clearInterval(intervalId);
      }
    }, 1000);
  }

  comeBackToSchedulePost = () => {
    document.querySelectorAll('.ant-tabs-tab')[0].click();
  }

  render() {
    return (
      <TourWizard
        setUp={this.setUpTour}
        steps={tourWizardConfig}
        generalClassName={'schedule-posts'}
        closeTutorial={this.props.closeTour}
        finalMessage={tutorialFinalMsg}
        actions={[
          {
            callback: this.openComposer,
            atStepNumber: 1
          },
          {
            callback: this.closeComposer,
            atStepNumber: 6
          },
          {
            callback: this.moveToScheduleSettings,
            atStepNumber: 9
          },
          {
            callback: this.comeBackToSchedulePost,
            atStepNumber: 11
          }
        ]}
      />
    )
  }
}

const tourWizardConfig = [
  {
    target: '.new-post.step-1',
    title: 'Create a new post',
    message: 'Create a post by clicking into the text box. You can add an emoji or an image and chose to post it now or schedule it for later.',
    imageLocation: '../images/tours/schedule-step-0.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.draft-body',
    title: 'Add content to your post',
    message: 'Start creating your content by adding text, links, emojis, photos or videos to your post.',
    imageLocation: '../images/tours/schedule-post-step-1.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.channels-section',
    title: 'Add multiple accounts',
    message: 'You can configure multiple accounts to publish your content at the same time. Just click on the + button and add as many as you want.',
    imageLocation: '../images/tours/schedule-post-step-2.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.category-section',
    title: 'Select a category',
    message: 'You have the option to categorize your content by selecting one of our pre-defined categories.',
    imageLocation: '../images/tours/schedule-post-step-3.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.preview-card-container',
    title: 'See how your post will look',
    message: 'Visualize a preview of your content on the social networks you have selected.',
    imageLocation: '../images/tours/schedule-post-step-4.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.post-button-container',
    title: 'Select a scheduling type',
    message: <div className="schedule-wizard-types">
      <div>By clicking on the button dropdown, you can display other scheduling options.</div>
      <ul>
        <li><span className="bold-text">Post now</span> - <i>instant share</i></li>
        <li><span className="bold-text">Schedule post</span> - <i>select a date and time</i></li>
        <li><span className="bold-text">Add to queue</span> - <i>add to next available spot</i></li>
      </ul>
    </div>,
    imageLocation: '../images/tours/schedule-post-step-5.svg',
    cardPosition: 'top-right',
    correctPositionX: 108,
    correctPositionY: 227
  },
  {
    target: '.infinite-scroll-component > div:first-child',
    title: 'Schedule a post',
    message: 'Schedule a post for a specific day and time by selecting a desired slot.',
    imageLocation: '../images/tours/schedule-step-1.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.display-by.step-3',
    title: 'Switch to calendar view',
    message: 'You can view your calendar by day, week or month.',
    imageLocation: '../images/tours/schedule-step-2.svg',
    cardPosition: 'bottom-right',
    correctPositionX: 70
  },
  {
    target: '.ant-tabs-nav.ant-tabs-nav-animated > div > div:nth-child(3)',
    title: 'Schedule settings',
    message: 'Choose frequency and timings of your posts by adjusting your settings.',
    imageLocation: '../images/tours/schedule-step-3.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.post-scheduling-time-section',
    title: 'Add a new posting time',
    message: 'Select time slots you want add to your Post Schedule - these are your recommended best times to post.',
    imageLocation: '../images/tours/schedule-step-4.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.post-scheduling-display-section',
    title: 'Manage your posting times',
    message: 'Visualize, edit and delete your slots.',
    imageLocation: '../images/tours/schedule-step-5.svg',
    cardPosition: 'bottom-left'
  }
];

const tutorialFinalMsg = {
  image: '../images/tours/schedule-final-img.svg',
  title: 'That\s all!',
  message: 'Now you know how to manage your posts easily. What will you share next?',
  buttonLabel: 'Got it!'
};


export default ScheduleWizard;
