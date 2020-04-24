import { getCategories } from '../requests/channels';

export const setComposerCategories = (categories) => ({
  type: 'SET_COMPOSER_CATEGORIES',
  categories
});

export const startGeneral = () => {
  return (dispatch) => {
      return getCategories().then((res) => {
          dispatch(setComposerCategories(res.categories));
          return Promise.resolve(res.categories);
      }).catch((error) => {
          console.log(error);
      });
  };
};
