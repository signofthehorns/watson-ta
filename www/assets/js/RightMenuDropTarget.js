import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

const RightDropTarget = {
  drop(props, monitor, component) {
  	return props;
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class RightMenuDropTarget extends React.Component {
  render() {
  	const { connectDropTarget, isOver, canDrop } = this.props;
	return connectDropTarget(
	  <div >
	    {
	    <div className="right-widget right-widget-shaded" style={{
	          opacity: canDrop ? 0.1 : 0.0,
	          backgroundColor: isOver ? 'black' : 'grey',
	          paddingBottom: canDrop ? '10px' : '0px'
		    }}>
        </div>
	    }
      </div>
    );
  }
};

RightMenuDropTarget.propTypes = {
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired
};

export default DropTarget('RIGHT_MENU', RightDropTarget, collect)(RightMenuDropTarget);
