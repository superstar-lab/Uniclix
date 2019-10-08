import React from 'react';
import ContentLoader from "react-content-loader"

const Loader = () => (
	<div>
		<img className="fixed-center" src="/images/uniclix_loader.svg" />
	</div>
);

export const LoaderWithOverlay = () => (
    <div>
		<img className="fixed-center" src="/images/uniclix_loader.svg" />
        <div id="overlay"></div>
    </div>
);

export const ArticleLoader = props => (

	<ContentLoader 
		height={160}
		width={400}
		speed={0.5}
		primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        className="article-loader"
		{...props}
	>
		<rect x="189.69" y="40.67" rx="0" ry="0" width="0" height="0" /> 
		<rect x="0.31" y="0.67" rx="0" ry="0" width="443" height="88" /> 
		<rect x="-4.31" y="98.67" rx="0" ry="0" width="309" height="7" /> 
		<rect x="-0.31" y="118.67" rx="0" ry="0" width="394" height="3.99" /> 
		<rect x="-5.31" y="126.67" rx="0" ry="0" width="394" height="3.99" />
	</ContentLoader>
);

export const PostLoader = () => (
	<ContentLoader 
    height={160}
    width={400}
    speed={2}
    primaryColor="#d8d8d8"
    secondaryColor="#ecebeb"
  >
    <rect x="70" y="15" rx="4" ry="4" width="117" height="6" /> 
    <rect x="70" y="35" rx="3" ry="3" width="85" height="6" /> 
    <rect x="0" y="80" rx="3" ry="3" width="350" height="6" /> 
    <rect x="0" y="100" rx="3" ry="3" width="380" height="6" /> 
    <rect x="0" y="120" rx="3" ry="3" width="201" height="6" /> 
    <circle cx="30" cy="30" r="30" />
  </ContentLoader>
  );

export const AvatarWithText = () => (
  <ContentLoader 
    height={100}
    width={400}
    speed={2}
    primaryColor="#f9f9f9"
    secondaryColor="#ecebeb"
  >
    <circle cx="24" cy="23" r="18" /> 
    <rect x="48" y="16" rx="0" ry="0" width="332" height="7" /> 
    <rect x="48" y="29" rx="0" ry="0" width="245" height="7" /> 
    <circle cx="60" cy="64" r="13" /> 
    <rect x="85" y="51" rx="0" ry="0" width="255" height="9" /> 
    <rect x="85" y="68" rx="0" ry="0" width="185" height="6" />
  </ContentLoader>
  )

//export const UniclixLoader
export default Loader;
