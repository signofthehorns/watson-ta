/** @jsx React.DOM */
var SideNavBarLink = React.createClass({
  render: function() {
    return (
      <a className="dropdown-toggle" data-toggle="dropdown" href={this.props.url}>{this.props.text}<b className="caret"></b></a>
    );
  }
})
