import React from 'react'
import {NavLink} from 'react-router-dom';

const SocialAccountsPrompt = ({
    image = "/images/connect_twitter_accounts.svg", 
    title, 
    description, 
    buttonTitle, 
    buttonLink = false, 
    action = false, 
    buttonText="Get Started",
    text = false}) => (
    <div className="social-account-prompt">
        <img src={image} />
        <h1>{title}</h1>
        <p>{description}</p>
        {text && 
            <p>{text}</p>
        }
        <h5>{buttonTitle}</h5>
        { action ? 
            <button className="magento-btn" onClick={action}>{buttonText}</button>
            :
            buttonLink && <NavLink to={buttonLink}><button className="magento-btn">{buttonText}</button></NavLink>
        }
        
    </div>
);

export default SocialAccountsPrompt;