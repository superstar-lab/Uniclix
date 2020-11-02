import React from 'react';
import { Select, Button } from 'antd';

import { saveOnBoardingQuestions } from '../requests/profile';

import { LoaderWithOverlay } from '../components/Loader';

const howDidYouFindUsOptions = [
  'Friend, family or work college',
  'Google search',
  'Online advertisement',
  'Blog post',
  'Social media post',
  'Podcast',
  'Other',
  'I prefer not to answer'
];

const businessDescriptionOptions = [
  'Personal use (not a business)',
  'Direct-to-consumer brand (e.g online store)',
  'Physical store or location (e.g retail store, cafe, tourist attraction)',
  'B2B online brand',
  'Publisher (e.g newspapper, magazine, blogger, YouTube channel)',
  'SaaS (software as a service)',
  'Government Entity/Public Sector',
  'Agency/marketing consultant',
  'I prefer not to answer'
];

const { Option } = Select;

class OnBoarding extends React.Component {
  state = {
    howDidYouFindUs: '',
    businessDescription: '',
    isLoading: false
  }

  componentDidMount() {
    const { location: { state: { comingFromRegister } = { comingFromRegister: false }}} = this.props;

    // if we are not getting here from the register screen
    // we want to redirect the user to the schedules page
    if (!comingFromRegister) {
      this.props.history.push({
        pathname: '/scheduled/posts',
        state: {
          comingFromOnBoarding: true
        }
      });
    }
  }

  onSubmit = () => {
    const { howDidYouFindUs, businessDescription } = this.state;

    this.setState({ isLoading: true })
    saveOnBoardingQuestions({ howDidYouFindUs, businessDescription })
      .then(() => {
        this.setState({ isLoading: false });
        this.props.history.push({
          pathname: '/scheduled/posts',
          state: {
            comingFromOnBoarding: true
          }
        });
      });
  }

  onSkipStep = () => {
    this.props.history.push({
      pathname: '/scheduled/posts',
      state: {
        comingFromOnBoarding: true
      }
    });
  }

  render() {
    const { howDidYouFindUs, businessDescription, isLoading } = this.state;

    return (
      <div className="on-boarding">
        { isLoading && <LoaderWithOverlay /> }
        <div className="left-side">
          <div className="header">
            <div className="logo">
                <span className="minimalist-logo">Uniclix.</span>
            </div>
          </div>
          <div className="on-boarding-form">
            <div className="on-boarding-title">
              Let's get your account set up
            </div>
            <div className="fields">
              <div className="input-set">
                <label>How did you first hear about us</label>
                <Select
                  value={howDidYouFindUs}
                  placeholder="Select an option"
                  onChange={(ans) => this.setState({ howDidYouFindUs: ans })}
                  size="large"
                  style={{ width: '529px' }}
                >
                  {
                    howDidYouFindUsOptions.map(option => (
                      <Option key="topic" value={option} title={option}>
                        {option}
                      </Option>
                    ))
                  }
                </Select>
              </div>
              <div className="input-set">
                <label>Which option best describes your business?</label>
                <Select
                  value={businessDescription}
                  placeholder="Select an option"
                  onChange={(ans) => this.setState({ businessDescription: ans })}
                  size="large"
                  style={{ width: '529px' }}
                >
                  {
                    businessDescriptionOptions.map(option => (
                      <Option key="topic" value={option} title={option}>
                        {option}
                      </Option>
                    ))
                  }
                </Select>
              </div>
            </div>
            <div className="buttons">
            <Button
              onClick={this.onSubmit}
              className="continue"
              type="primary"
              shape="round"
              size="large"
            >
              Continue
            </Button>
            <Button type="link" size="large" onClick={this.onSkipStep}>
              Skip this step
            </Button>
            </div>
          </div>
        </div>
        <div className="col-md-5 login-side on-boarding-side"></div>
      </div>
    );
  }
}

export default OnBoarding;
