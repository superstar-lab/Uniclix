
// A reducer to store any dropdown options or config coming from the backend
export default (state = {}, action) => {
  switch(action.type) {
    case 'SET_COMPOSER_CATEGORIES':
      return { ...state, composerCategories: [ ...action.categories ]};
    default:
      return state;
  }
}
