import React from 'react';
import LeftMenuItem from './LeftMenuItem';

export default class LeftUserMenu extends React.Component {
  constructor(props) {
    super(props);
    this._generateMenu = this._generateMenu.bind(this);
  }

  _generateMenu(item, i) {
    return <LeftMenuItem text={item.text} url={item.url} submenu={item.submenu} classcategory={item.classcategory} doc={item.doc} key={i+1} />
  }

  render() {
    var menu = this.props.menu.map(this._generateMenu);

    return <ul className="nav navbar-nav" key={0} >
      	{ menu }
    </ul>
  }
};
