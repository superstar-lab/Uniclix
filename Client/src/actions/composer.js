export const setComposerModal = (modal = false, data = null) => ({
    type: "SET_COMPOSER_MODAL",
    modal,
    data: data
});