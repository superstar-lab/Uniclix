export const setComposerModal = (startsAt = null, selectedTimezone) => ({
    type: 'SET_COMPOSER_MODAL',
    startsAt,
    selectedTimezone
});

export const setComposerToEdit = (postData) => ({
    type: 'SET_COMPOSER_TO_EDIT',
    postData
});

export const setComposerForArticle = (postData) => ({
    type: 'SET_COMPOSER_FOR_ARTICLE',
    postData
});

export const closeModal = () => ({
    type: 'CLOSE_MODAL'
});

export const updatePublishChannels = (publishChannels) => ({
    type: 'UPDATE_PUBLISH_CHANNELS',
    publishChannels
});

export const setShowSelectAccount = (state) => ({
    type: 'SET_SHOW_SELECT_ACCOUNTS',
    showSelectAccounts: state
});

export const setContent = (content) => ({
    type: 'SET_CONTENT',
    content
});

export const setPictures = (pictures) => ({
    type: 'SET_PICTURES',
    pictures
});

export const setCategory = (category) => ({
    type: 'SET_CATEGORY',
    category
});

export const setDate = (date) => ({
    type: 'SET_DATE',
    date
});

export const setPostAtBestTime = (postAtBestTime) => ({
    type: 'SET_POST_AT_BEST_TIME',
    postAtBestTime
});

export const setPostNow = (postNow) => ({
    type: 'SET_POST_NOW',
    postNow
})
