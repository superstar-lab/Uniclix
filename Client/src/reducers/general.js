import categories from '../config/postCategories';

const defaultState = {
  composerCategories: categories
};

// A reducer to store any dropdown options or config coming from the backend
export default (state = defaultState, action) => {
  switch(action.type) {
    default:
      return state;
  }
}
