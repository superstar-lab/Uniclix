const moment = require.requireActual("moment");
export default (time = 0) => {
    return moment(time);
}