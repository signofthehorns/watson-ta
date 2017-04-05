import React, {Component, PropTypes} from 'react';
import MessengerPlugin from 'react-messenger-plugin';
import { DragSource } from 'react-dnd';
import SideMenuActions from './SideMenuActions';

const MessengerLinkSource = {
  beginDrag(props) {
    return {};
  },

  endDrag(props, monitor, component) {
    const startIndex = props.rowId;
    const targetIndex = monitor.getDropResult().rowId;
    SideMenuActions.permuteMenuItems(startIndex,targetIndex);
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class MessengerLink extends React.Component {
  render() {
  	const { connectDragSource, isDragging } = this.props;

	return connectDragSource(
		<div 
		  className="right-widget right-widget-shaded" 
		  style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move'
          }}>
        <div className ="container-fluid">
          <div className ="row">
            <div className ="col-md-2 col-sm-2">
                <img src="http://localhost:8000/media/watson.jpg" alt="" style={{width:'100px', height:'100px', 'borderRadius':'50%'}}/>
            </div>
            <div className ="col-md-10 col-sm-10">
                <h3><i className="fa fa-comments-o" aria-hidden="true"></i> Need Help? <MessengerPlugin
				  appId="1804020893258037"
				  pageId="1410293972322382"
				  type="message-us"/></h3>
                <p>You can now chat with me on Messenger to help with further questions you may have!</p>
             </div>
          </div>
        </div>
      </div>
    );
  }
};

MessengerLink.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource('SIDE_MENU', MessengerLinkSource, collect)(MessengerLink);