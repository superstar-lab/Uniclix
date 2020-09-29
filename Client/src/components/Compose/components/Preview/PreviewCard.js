import React from 'react';
import PropTypes from 'prop-types';

import { LINK_REG_EX } from '../../../../utils/constants';

const socialMediaTexts = {
  'linkedin': 'LinkedIn',
  'facebook': 'Facebook',
  'twitter': 'Twitter'
};

class PreviewCard extends React.Component {
  static propTypes = {
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    text: PropTypes.string,
    pictures: PropTypes.array,
    videos: PropTypes.array,
    socialMedia: PropTypes.string.isRequired
  }

  // We replace all the links for anchors
  prepareText = () => {
    let { text } = this.props;
    const matches = text ? text.matchAll(LINK_REG_EX) : [];

    if (!matches) return text;

    for (const match of matches) {
      const link = !!match[0].match(/http:\/\/|https:\/\//) ? match[0] : `http://${match[0]}`;
      text = text.replace(match[0], `<a href="${link}" target="_blank">${match[0]}</a>`);
    }

    return text;
  }

  render() {
    const { avatar, name, subTitle, pictures, socialMedia, videos } = this.props;
    const text = this.prepareText();

    return (
      <div className={`preview-card-container ${socialMedia}`}>
        <div className="header">
          <div className="account-data">
            <img src={avatar} />
            <div className="info">
              <div className="name">{ name }</div>
              { !!subTitle && <div className="sub-title">{ subTitle }</div> }
            </div>
          </div>
        <div className={`social-media-label ${socialMedia}`}>
          { socialMediaTexts[socialMedia] }
        </div>
        </div>
        <div className="text" dangerouslySetInnerHTML={{__html: text}}></div>
        {
          !!pictures.length && (
            <div className={`images amount-${pictures.length}`}>
              {
                pictures.map(pic => <img src={pic} />)
              }
            </div>
          )
        }
        {
          !!videos.length && (
            <div className="video">
              {
                videos.map(vid =>
                  <video
                    controls
                    loop
                    src={`${vid}#t=0.1`}
                  />
                )
              }
            </div>
          )
        }
      </div>
    );
  }
}

export default PreviewCard;
