/** @jsx React.DOM */
var SideNavBarItem = React.createClass({
  generateLink: function(){
    return <SideNavBarLink url={this.props.url} text={this.props.text} />;
  },
  generateSubmenu: function(){
    return <SideNavBar items={this.props.submenu} />
  },
  generateContent: function(){
    var content = [this.generateLink()];
    if(this.props.submenu){
      content.push(this.generateSubmenu());
    }else if(this.props.subitem){
		content.push(this.generateSubmenu());
	}
    return content;
  },
  render: function() {
    var content = this.generateContent();
    return (
      <li className="dropdown dropdown-class">
        {content}
      </li>
    );
  }
})
