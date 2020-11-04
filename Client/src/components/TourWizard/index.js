import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Modal from 'react-modal';

import { getOffset } from '../../utils/helpers';

class TourWizard extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(
      PropTypes.objectOf({
        target: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        imageLocation: PropTypes.string.isRequired,
        cardPosition: PropTypes.oneOf('bottom-left', 'bottom-right'),
        offsetPosition: PropTypes.number
      })
    ),
    generalClassName: PropTypes.string.isRequired,
    closeTutorial: PropTypes.func.isRequired,
    finalMessage: PropTypes.objectOf({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      buttonLabel: PropTypes.string.isRequired
    }),
    actions: PropTypes.arrayOf(
      PropTypes.objectOf({
        callback: PropTypes.func.isRequired,
        atStepNumber: PropTypes.number.isRequired
      })
    )
  }

  state = {
    currentStepNumber: 0,
    spotLightPosition: {},
    tourCardPosition: {},
    showCard: true
  }

  componentDidMount() {
    this.calculatePosition();
    window.addEventListener('resize', this.calculatePosition);
    document.querySelector('#tour-wizard-node').setAttribute('class', 'open');
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculatePosition);
    document.querySelector('#tour-wizard-node').setAttribute('class', '');
  }

  calculatePosition = () => {
    const { steps } = this.props;
    const { currentStepNumber } = this.state;
    const currentStep = steps[currentStepNumber];

    const elem = document.querySelector(currentStep.target);
    const boundings = elem ? elem.getBoundingClientRect() : {};
    const realPosition = getOffset(elem);
    const spotLightStyles = {
      top: realPosition.top - 20,
      left: realPosition.left - 20,
      height: boundings.height + 40,
      width: boundings.width + 40
    };
    let tourCardStyles = {};
    // This is used to correct the position of the card
    const offset = currentStep.offsetPosition ? currentStep.offsetPosition : 0;

    switch(currentStep.cardPosition) {
      case 'bottom-left':
        tourCardStyles = {
          top: boundings.height + realPosition.top + 30,
          left: realPosition.left - 20
        }
        break;
      case 'bottom-right':
        tourCardStyles = {
          top: boundings.height + realPosition.top + 30,
          left: realPosition.left - boundings.width + offset - 20
        }
        break;
    }

    this.setState(
      {
        spotLightPosition: spotLightStyles,
        tourCardPosition: tourCardStyles
      },
      () => {
        setTimeout(() => {
          document
            .querySelector('.tour-card')
            .scrollIntoView({behavior: 'smooth', block: "end"});
        }, 100);
      }
  );
  }

  onNextClick = () => {
    this.setState(
      { currentStepNumber: this.state.currentStepNumber + 1 },
      () => {
        const { steps, actions } = this.props;
        const { currentStepNumber } = this.state;
        // We check if there are any actions to take
        const action = actions ? actions.filter(
          (action) => currentStepNumber === action.atStepNumber
        )[0] : null;

        if (steps.length <= currentStepNumber) {
          // we check if there is an action for when
          // the tour finishes
          if (action) {
            action.callback();
          }

          return;
        };

        if (action) {
          action.callback(this.calculatePosition, this.toggleCard);
        } else {
          this.calculatePosition();
        }
      }
    );
  }

  onSkipClick = () => {
    this.props.closeTutorial();
  }

  toggleCard = () => {
    this.setState({ showCard: !this.state.showCard });
  }

  renderOverlayContent = () => {
    return (
      <div className={`tour-wizard-overlay`}>
        {
          this.state.showCard && <div
            className="spot-light"
            style={this.state.spotLightPosition}>
          </div>
        }
      </div>
    )
  }

  renderCardContent = () => {
    const { steps, generalClassName } = this.props;
    const { currentStepNumber, tourCardPosition } = this.state;
    const currentStep = steps[currentStepNumber];

    return (        
      <div
        className={`tour-card ${generalClassName} step-${currentStepNumber + 1}`}
        style={tourCardPosition}
      >
        <div className="info-section">
          <img src={currentStep.imageLocation} />
          <div className="tour-text">
            <div className="tour-card-title">{currentStep.title}</div>
            <div className="tour-card-message">{currentStep.message}</div>
          </div>
        </div>
        <div className="buttons-section">
          <Button onClick={this.onSkipClick} type="link">Skip tutorial</Button>
          <Button onClick={this.onNextClick} className="next-btn" type="link">
            <span>Next</span>
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { steps, finalMessage, closeTutorial } = this.props;
    const { currentStepNumber, showCard } = this.state;

    // We want to close the tutorial if there are no more steps to show
    // and there is no final message
    if (steps.length === currentStepNumber && !finalMessage) {
      closeTutorial();
    }

    return steps.length > currentStepNumber ? (
      <React.Fragment>
        {
          ReactDOM.createPortal(
            this.renderOverlayContent(),
            document.getElementById('tour-wizard-node')
          )
        }
        {
          showCard && ReactDOM.createPortal(
            <div className="tour-card-holder">
              {this.renderCardContent()}
            </div>,
            document.getElementById('tour-wizard-step')
          )
        }
      </React.Fragment>
    ) : (
      <Modal isOpen className="tour-wizard-finish-modal">
        <img src={finalMessage.image} />
        <div className="modal-title">{finalMessage.title}</div>
        <div className="modal-message">{finalMessage.message}</div>
        <Button
          onClick={closeTutorial}
          type="primary" 
          hape="round"
        >
            {finalMessage.buttonLabel}
        </Button>
      </Modal>
    );
  }
}

export default TourWizard;
