import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';

import FacebookPreview from './FacebookPreview';
import TwitterPreview from './TwitterPreview';
import LinkedinPreview from './LinkedinPreview';

class Preview extends React.Component {
  static propTypes = {
    publishChannels: PropTypes.array.isRequired,
    channels: PropTypes.array.isRequired,
    text: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    timezone: PropTypes.string.isRequired,
    pictures: PropTypes.array.isRequired,
    videos: PropTypes.array.isRequired
  }

  slider = React.createRef();

  getSelectedChannels() {
    const selectedChannels = [];
    const { publishChannels, channels } = this.props;

    publishChannels && publishChannels.forEach(chId => {
      const chIndex = channels.findIndex(channel => channel.id === chId);
      if (chIndex !== -1) {
        selectedChannels.push(channels[chIndex]);
      }
    });

    return selectedChannels;
  }


  getSocialMediaFromChannels = (socialMedia, channels) => {
    return channels.find(channel => channel.type === socialMedia);
  }

  render() {
    const {
      text,
      date,
      timezone,
      pictures,
      videos
    } = this.props;
    const selectedChannels = this.getSelectedChannels();

    return (
      <div className="preview-container">
        <Carousel ref={this.slider}>
          {
            !!selectedChannels && selectedChannels.map(channel => {
              switch(channel.type) {
                case 'facebook':
                  return (
                    <FacebookPreview
                      text={text}
                      date={date}
                      timezone={timezone}
                      channel={channel}
                      pictures={pictures}
                      videos={videos}
                    />
                  );
                case 'twitter':
                  return (
                    <TwitterPreview
                      channel={channel}
                      text={text}
                      pictures={pictures}
                      videos={videos}
                    />
                  );
                case 'linkedin':
                  return (
                    <LinkedinPreview
                      channel={channel}
                      text={text}
                      pictures={pictures}
                      videos={videos}
                    />
                  );
              }
            })
          }
        </Carousel>
        {
          selectedChannels.length > 1 && (
            <div className="arrows-container">
              <div className="arrow arrow-right" onClick={() => {this.slider.current.prev()}}>
                <i className="fa fa-angle-left"></i>
                <span>Previous</span>
              </div>
              <div className="arrow arrow-left" onClick={() => {this.slider.current.next()}}>
                <span>Next</span>
                <i className="fa fa-angle-right"></i>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default Preview;
