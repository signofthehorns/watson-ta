/** @jsx React.DOM */
var SideNavBar = React.createClass({
  generateItem: function(item){
    return <SideNavBarItem text={item.text} url={item.url} submenu={item.submenu} subitem={item.subitem}/>
  },
  render: function() {
    var items = this.props.items.map(this.generateItem);
    return (
      <ul className="nav navbar-nav">
      {items}
      </ul>
    );
  }
})
