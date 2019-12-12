'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _eventSupport = require('./event-support');

var _eventSupport2 = _interopRequireDefault(_eventSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __TouchSupported = void 0;
var touchSupport = function touchSupport() {
    if (typeof __TouchSupported === 'boolean') return __TouchSupported;

    __TouchSupported = (0, _eventSupport2.default)("touchstart"); //("ontouchstart" in document.documentElement)
    return __TouchSupported;
};

exports.default = touchSupport;
