import React, { Profiler } from 'react';
import moment from "moment";
import timeFormats from './timeFormats';

export function linkify(text) {
    if(typeof(text) === "undefined") return;
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return '<a href="'+url+'" target="_blank">' + url + '</a>';
    });
}

export function removeUrl(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return '';
    });
}

export function getUrlFromText(text){
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.match(urlRegex);
}

export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function truncate(string, length){
    if(typeof(string) === "undefined" || !string) return;
    if (string.length > length)
       return string.substring(0,length)+'...';
    else
       return string;
};

export function hashLink(text, onTagClick){
    if(typeof(text) === "undefined") return;
    return text.replace(/([@#])([a-z\d_]+)/ig, (function(_, marker, tag){
        if (marker === "@")
            return '<a href="https://twitter.com/'+tag+'" target="_blank">@' + tag + '</a>';

        if(typeof onTagClick === 'function')
            return '<a href="javascript:void(0)">#' + tag+'</a>';
        
             
        return '<a href="https://twitter.com/hashtag/'+tag+'" target="_blank">#' + tag+'</a>';
    }));
}

export function parseTextWithLinks(text, onTagClick = false){
    return hashLink(linkify(text), onTagClick);
}

export function chunk(array, size) {
    if (!array) return [];
    const firstChunk = array.slice(0, size); // create the first chunk of the given array
    if (!firstChunk.length) {
      return array; // this is the base case to terminal the recursive
    }
    return [firstChunk].concat(chunk(array.slice(size, array.length), size)); 
}

export function isEmptyObject(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function toHumanTime(time){
    return moment.utc(Date.now()).to(moment.utc(time, timeFormats));
}

export function isOwner(accessLevel) {
    return accessLevel === 'owner';
}

export function isOwnerOrAdmin(accessLevel) {
    return accessLevel === 'owner' || accessLevel === 'admin';
}

export function filterFacebookProfiles(channels) {
    return channels.filter(channel => {
        if (channel.type === 'facebook') {
            // From facebook we only want the pages
            return channel.details.account_type !== 'profile';
        }

        // We want to retrieve all the channels that are not
        // facebook profiles
        return true;
    });
}

export function isSafari() {
    return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf('CriOS') == -1 &&
        navigator.userAgent.indexOf('FxiOS') == -1;
}
