import React from 'react';
import { NavLink } from 'react-router-dom';

const UpgradeIntro = ({title, description, infoData, image, buttonLink}) => (
    <div className="upgrade-intro">
        <div className="heading-group">
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
        
        <div className="body-group">
            <div className="info">
                {infoData.map((section, index) => (
                    <div key={index} className="info-section">
                        <h4>{section.title}</h4> 
                        <p>{section.description}</p>
                    </div>
                ))}
            </div>
            <div className="image">
                <img src={image} />
            </div>
        </div>

        <div className="footer-group">
            <NavLink to={buttonLink}><button className="magento-btn">Upgrade Now</button></NavLink>
        </div>
    </div>
);

export default UpgradeIntro