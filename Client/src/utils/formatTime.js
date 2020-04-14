import { isSafari } from '../utils/helpers';

function clearNumber(value = '') {
    return value.replace(/\D+/g, '')
}

export default (value) => {

    const clearValue = clearNumber(value)
    let hour = clearValue.slice(0, 2)
    let minutes = clearValue.slice(2, 4)
    if (clearValue.slice(0, 1) > 1) {
        hour = `0${clearValue.slice(0, 1)}`
    }
    if (clearValue.slice(0, 2) > 12) {
        hour = `0${clearValue.slice(0, 1)}`
    }
    if (clearValue.slice(2, 3) > 5) {
        minutes = `0${clearValue.slice(2, 3)}`
    }

    if (clearValue.length >= 3) {
        return `${hour}:${minutes}`
    } else {
        return hour
    }

}

// This help us to create a date object maintaining the timezon configured
// in the moment object.
export const momentToDate = (momentObj) => {
    let formattedDate = momentObj.format("YYYY-MM-DDTHH:mm:ss");

    // Safari always takes the timezone from the local machine, even
    // when the date is created as above. I'm changing the orientation
    // of the offset to cancel the timezone.
    if (isSafari()) {
        const offset = momentObj.format('Z');
        if (offset.indexOf('-') !== -1) {
            offset.replace('-', '+')
        } else {
            offset.replace('+', '-')
        }

        formattedDate += offset;
    }

    return new Date(formattedDate);
}
