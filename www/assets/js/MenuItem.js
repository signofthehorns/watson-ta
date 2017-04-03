import React from 'react';
import UserMenu from './UserMenu';

export default class MenuItem extends React.Component {
  generateLink() {
	if(this.props.doc == "True"){
		return (<a href={this.props.url}>
      {this.props.text}
    </a>)
	}else{
    return (<a className="dropdown-toggle" data-toggle="dropdown" href={this.props.url}>
      {this.props.text}<b className="caret"></b>
    </a>)
	}
  }

  generateSubmenu() {
    if (this.props.submenu !== null)
      return <UserMenu menu = {this.props.submenu} />
  }

  render() {
	if(this.props.classcategory == "True"){
		return (<li className = "dropdown dropdown-menu dropdown-header">
      { this.generateLink() }
      { this.generateSubmenu() }
    </li>)
	}else{
    return (<li className = "dropdown dropdown-class">
      { this.generateLink() }
      { this.generateSubmenu() }
    </li>)
	}
  }
};
