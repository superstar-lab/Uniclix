'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _touchSupport = require('./touch-support');

var _touchSupport2 = _interopRequireDefault(_touchSupport);

var _touchStyles = require('./touch-styles');

var _touchStyles2 = _interopRequireDefault(_touchStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

var Tappable = function (_Component) {
    _inherits(Tappable, _Component);

    function Tappable(props, context) {
        _classCallCheck(this, Tappable);

        var _this = _possibleConstructorReturn(this, (Tappable.__proto__ || Object.getPrototypeOf(Tappable)).call(this, props, context));

        _this.state = _this.getInitialState();

        _this.touchable = (0, _touchSupport2.default)();
        return _this;
    }

    _createClass(Tappable, [{
        key: 'getInitialState',
        value: function getInitialState() {
            return {
                x: null,
                y: null,
                swiping: false,
                start: 0
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props,
                style = {};
            _extends(style, _touchStyles2.default, props.style);

            var newComponentProps = _extends({}, props, {
                style: style,
                className: props.className,
                disabled: props.disabled
                //, handlers: this.handlers
            }, this.handlers());

            delete newComponentProps.onTap;
            delete newComponentProps.onPress;
            delete newComponentProps.onPinchStart;
            delete newComponentProps.onPinchMove;
            delete newComponentProps.onPinchEnd;
            delete newComponentProps.moveThreshold;
            delete newComponentProps.pressDelay;
            delete newComponentProps.pressMoveThreshold;
            delete newComponentProps.preventDefault;
            delete newComponentProps.stopPropagation;
            delete newComponentProps.component;
            delete newComponentProps.flickThreshold;
            delete newComponentProps.delta;
            //delete newComponentProps.handlers

            return (0, _react.createElement)(props.component, newComponentProps, props.children);
        }
    }, {
        key: 'calculatePos',
        value: function calculatePos(e) {
            var x = e.changedTouches[0].clientX;
            var y = e.changedTouches[0].clientY;

            var xd = this.state.x - x;
            var yd = this.state.y - y;

            var axd = Math.abs(xd);
            var ayd = Math.abs(yd);

            return {
                deltaX: xd,
                deltaY: yd,
                absX: axd,
                absY: ayd
            };
        }
    }, {
        key: 'touchStart',
        value: function touchStart(e) {
            if (e.touches.length > 1) {
                return;
            }

            if (!this.touchable) {
                console.debug('Damn! You are using a non-touchable browser simulating touch events!');
                this.touchable = true;
            }

            this.setState({
                start: Date.now(),
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                swiping: false
            });
        }
    }, {
        key: 'touchMove',
        value: function touchMove(e) {
            if (!this.state.x || !this.state.y || e.touches.length > 1) {
                return;
            }

            var cancelPageSwipe = false;
            var pos = this.calculatePos(e);

            if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
                return;
            }

            if (pos.absX > pos.absY) {
                if (pos.deltaX > 0) {
                    if (this.props.onSwipingLeft) {
                        this.props.onSwipingLeft(e, pos.absX);
                        cancelPageSwipe = true;
                    }
                } else {
                    if (this.props.onSwipingRight) {
                        this.props.onSwipingRight(e, pos.absX);
                        cancelPageSwipe = true;
                    }
                }
            } else {
                if (pos.deltaY > 0) {
                    if (this.props.onSwipingUp) {
                        this.props.onSwipingUp(e, pos.absY);
                        cancelPageSwipe = true;
                    }
                } else {
                    if (this.props.onSwipingDown) {
                        this.props.onSwipingDown(e, pos.absY);
                        cancelPageSwipe = true;
                    }
                }
            }

            this.setState({ swiping: true });

            if (cancelPageSwipe) {
                e.preventDefault();
            }
        }
    }, {
        key: 'touchEnd',
        value: function touchEnd(ev) {
            if (this.state.swiping) {
                var pos = this.calculatePos(ev);

                var time = Date.now() - this.state.start;
                var velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time;
                var isFlick = velocity > this.props.flickThreshold;

                this.props.onSwiped && this.props.onSwiped(ev, pos.deltaX, pos.deltaY, isFlick);

                if (pos.absX > pos.absY) {
                    if (pos.deltaX > 0) {
                        this.props.onSwipedLeft && this.props.onSwipedLeft(ev, pos.deltaX);
                    } else {
                        this.props.onSwipedRight && this.props.onSwipedRight(ev, pos.deltaX);
                    }
                } else {
                    if (pos.deltaY > 0) {
                        this.props.onSwipedUp && this.props.onSwipedUp(ev, pos.deltaY);
                    } else {
                        this.props.onSwipedDown && this.props.onSwipedDown(ev, pos.deltaY);
                    }
                }
            } else {
                this._handleTap(ev);
            }

            this.setState(this.getInitialState());
        }
    }, {
        key: 'touchCancel',
        value: function touchCancel(ev) {
            this.setState(this.getInitialState());
        }
    }, {
        key: '_handleClick',
        value: function _handleClick(ev) {
            var _this2 = this;

            //!this.touchable && this._handleTap(ev)
            if (this.state.start === 0) {
                this._handleTap(ev);
            } else {
                setTimeout(function () {
                    _this2.state.start === 0 && _this2._handleTap(ev);
                }, 300);
            }
        }
    }, {
        key: '_handleTap',
        value: function _handleTap(ev) {
            this.props.onTap && this.props.onTap(ev);
        }
    }, {
        key: 'handlers',
        value: function handlers() {
            return {
                onTouchStart: this.touchStart.bind(this),
                onTouchMove: this.touchMove.bind(this),
                onTouchEnd: this.touchEnd.bind(this),
                onTouchCancel: this.touchCancel.bind(this),
                onClick: this._handleClick.bind(this)
            };
        }
    }]);

    return Tappable;
}(_react.Component);

Tappable.propTypes = {
    component: _propTypes2.default.any,
    onTap: _propTypes2.default.func,

    onSwiped: _propTypes2.default.func,
    onSwipingUp: _propTypes2.default.func,
    onSwipingRight: _propTypes2.default.func,
    onSwipingDown: _propTypes2.default.func,
    onSwipingLeft: _propTypes2.default.func,
    onSwipedUp: _propTypes2.default.func,
    onSwipedRight: _propTypes2.default.func,
    onSwipedDown: _propTypes2.default.func,
    onSwipedLeft: _propTypes2.default.func,
    flickThreshold: _propTypes2.default.number,
    delta: _propTypes2.default.number
};
Tappable.defaultProps = {
    component: 'div',
    flickThreshold: 0.6,
    delta: 10
};
exports.default = Tappable;
