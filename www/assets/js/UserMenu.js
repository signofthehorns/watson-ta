import React from 'react';
import MenuItem from './MenuItem';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this._generateMenu = this._generateMenu.bind(this);
  }

  _generateMenu(item, i) {
    return <MenuItem text={item.text} url={item.url} submenu={item.submenu} classcategory={item.classcategory} doc={item.doc} key={i+1} />
  }

  render() {
    var menu = this.props.menu.map(this._generateMenu);

    return <ul className="nav navbar-nav" key={0} >
      	{ menu }
    </ul>
  }
};
