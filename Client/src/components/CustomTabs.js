import React, { Component } from 'react';

export class Tabs extends Component {
	dragTarget = null;
	mouseMoveHandler = this.handleMouseMove.bind(this);
	mouseUpHandler = this.handleMouseUp.bind(this);
	tooltipTimeout = null;
	singleTabWidth = 150;
	tabTotal = 0;

	switchTab(index) {
		this.props.onTabSwitch(index);
	}

	handleMouseDown(event) {
		this.dragTarget = {
			target: event.currentTarget,
			x: event.currentTarget.offsetLeft,
			left: event.currentTarget.offsetLeft + 'px',
			mouseX: event.pageX,
			index: this.getIndexByLeft(event.currentTarget.offsetLeft),
		};
	}

	handleMouseUp() {
		this.dragTarget = null;
		this.forceUpdate();
	}

	handleMouseMove(event) {
		// Draggable
		if(this.dragTarget) {
			event.preventDefault();
			event.stopPropagation();

			const dragTarget = this.dragTarget;
			const maxLeft = this.singleTabWidth * (this.tabTotal - 1);

			let left = (dragTarget.x + event.pageX - dragTarget.mouseX);
			
			if(left < 1) {
				left = 1;
			}

			if(left > maxLeft) {
				left = maxLeft;
			}

			let index = this.getIndexByLeft(left);

			if(index != dragTarget.index) {
				const a = index, b = dragTarget.index;

				this.props.onTabPositionChange(a, b);

				dragTarget.index = index;
			}

			dragTarget.left = left + 'px';
			this.hideTooltip();
			this.forceUpdate();
		}
	}

	handleClose(index, event) {
		event.preventDefault();
        event.stopPropagation();
        this.hideTooltip();
		this.props.onTabClose(index);
	}

	handleAdd(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onTabAdd();
	}

	getLeftByIndex(index) {
		return 1 + this.singleTabWidth * index;
	}

	getIndexByLeft(left) {        
		return Math.round((left) / this.singleTabWidth);
	}

	showTooltip(event) {
		const text = event.currentTarget.getElementsByClassName('text')[0].innerText;
		const left = event.currentTarget.offsetLeft;

		if(!this.tooltipTimeout) {
			this.tooltipTimeout = window.setTimeout(() => {
				this.refs.tooltip.innerText = text;
				this.refs.tooltip.style.display = 'block';
				this.refs.tooltip.style.left = (left + 70) + 'px';
			}, 800);
		}
	}

	hideTooltip() {
		window.clearTimeout(this.tooltipTimeout);
		this.tooltipTimeout = null;
		this.refs.tooltip.style.display = 'none';
	}

	componentDidMount() {
		if(this.props.draggable) {
			window.addEventListener('mousemove', this.mouseMoveHandler);
			window.addEventListener('mouseup', this.mouseUpHandler);
		}
	}

	componentWillUnmount() {
		if(this.props.draggable) {
			window.removeEventListener('mousemove', this.mouseMoveHandler);
			window.removeEventListener('mouseup', this.mouseUpHandler);
		}
	}

	render() {
		let props = this.props;
        this.tabTotal = props.children.length;		

        let children = props.children;
        if (children.findIndex((item) => item.title == '+') == -1)
            children.push({title: '+'});

		let tabs = children.map((tab, index) => {
			let style = {};
			let position = index;
			let icon = null;

			if(tab.props && tab.props.icon) {
				if(typeof tab.props.icon === 'string') {
					icon = (<TabIcon type={ tab.props.icon }></TabIcon>);
				} else {
					icon = tab.props.icon;
				}
			}

			style['zIndex'] = this.tabTotal - position;
			style['left'] = this.getLeftByIndex(position) + 'px';
            style['width'] = this.singleTabWidth + 'px';

			if(this.dragTarget && this.dragTarget.index == position) {
				style['left'] = this.dragTarget.left;
            }
            
            if (index >= children.length - 1) {
                style['width'] = '40px';
                return (
                    <div
                        key={ index } 
                        className="tab-add-button"
                        style={ style }
                        onClick={ this.handleAdd.bind(this) }
                    >
                        <div className="text">                            
                            { tab.title }
                        </div>                        
                    </div>
                );
            }

			return (
				<div
					key={ index } 
					className={ "tab-button" + (props.active == index ? " active" : "") }
					style={ style } 
					onClick={ this.switchTab.bind(this, index) }
					onMouseDown={ this.handleMouseDown.bind(this) }
					onMouseEnter={ this.showTooltip.bind(this) }
                    onMouseLeave={ this.hideTooltip.bind(this) }
                    onDoubleClick={ this.props.onTabRename.bind(this) }
				>
					<div 
						className="tab"
						style={ this.props.color ? { borderColor: this.props.color } : null }
					></div>
					<div className={ "text" + (tab.props.showClose ? " with-close" : "") }>
						{ icon }
						{ tab.props.title }
					</div>
					{ tab.props.showClose ? (<div className="close" onClick={ this.handleClose.bind(this, index) }></div>) : null }
				</div>
			);
		});

		let panels = props.children.map((panel, index) => {
			if(props.active != index) {
				return null;
			}

			return (
				<div 
					className="panel active"
					key={ "panel-" + index }
				>
					{ panel }
				</div>
			);
		});

		return (
			<div 
				className="r-a-t"
			>
				<div className={ "tab-wrapper" + (this.props.showAdd ? " with-add" : "") } ref="tabs">
					{ tabs }                    
                    <div className="refresh-wrapper" onClick={() => this.props.onRefresh() }></div>
				</div>				
				<div 
					className="panel-wrapper"
					style={ this.props.color ? { borderColor: this.props.color } : null }
				>
					{ panels }
				</div>
				<div className="tooltip" ref="tooltip">
				</div>
			</div>
		);
	}
}

const Tab = ({ children }) => {
	return (
		<div>{ children }</div>
	);
}

const TabIcon = ({ type }) => {
	return (
		<div className={ "icon " + type }>
			{ type == 'loading' ? (<div className="mask"></div>) : null }
		</div>
	);
};

export default Tabs;
export { Tab };