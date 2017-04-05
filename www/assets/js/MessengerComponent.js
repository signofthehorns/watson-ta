import React from 'react';
import MessengerPlugin from 'react-messenger-plugin';

export default class MessengerLink extends React.Component {
  render() {
  	console.log(`${PATH}`)
	return <div className="right-widget right-widget-shaded">
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
      </div>;
  }
};

