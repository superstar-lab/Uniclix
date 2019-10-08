export const setMiddleware = (middleware = "loading") => ({
    type: "SET_MIDDLEWARE",
    middleware
});