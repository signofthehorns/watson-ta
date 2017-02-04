import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';

import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { HelpBlock } from 'react-bootstrap';
import { InputGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';


var QuestionBox = React.createClass({
  getInitialState: function () {
    return {
      data: []
    };
  },
  generateId: function () {
    return Math.floor(Math.random()*90000) + 10000;
  },

  handleSubmit: function (task) {
    var data = this.state.data;
    var id = this.generateId().toString();
    var complete = 'false';
    data = data.concat([{id, task, complete}]);
    this.setState({data});
  },
  handleToggleComplete: function (nodeId) {
    var data = this.state.data;
    for (var i in data) {
      if (data[i].id == nodeId) {
        data[i].complete = data[i].complete === 'true' ? 'false' : 'true';
        break;
      }
    }
    this.setState({data});
    return;
  },
  render: function() {
    return (
      <div>
        <QuestionForm onTaskSubmit={this.handleSubmit} />
        <QuestionList data={this.state.data} toggleComplete={this.handleToggleComplete} />
      </div>
    );
  }
});

var QuestionList = React.createClass({
  toggleComplete: function (nodeId) {
    this.props.toggleComplete(nodeId);
    return;
  },
  render: function() {
    var listNodes = this.props.data.map(function (listItem) {
      return (
        <QuestionItem key={listItem.id} nodeId={listItem.id} task={listItem.task} complete={listItem.complete} toggleComplete={this.toggleComplete} />
      );
    },this);
    return (
      <ul className="list-group">
        {listNodes}
      </ul>
    );
  }
});

var QuestionItem = React.createClass({
  componentDidMount: function() {
    axios.get('http://localhost:8080/pdfupload/classify/'+this.props.text+'/')
      .then(res => {
        this.setState({ 
          loading : false,
          tag : res.data.tag
        });
      });
  },

  getInitialState: function () {
    return {
      loading: true
    };
  },

  toggleComplete: function (e) {
    e.preventDefault();
    this.props.toggleComplete(this.props.nodeId);
    return;
  },
  updateClass: function () {
    
  },
  render: function() {
    var classes = 'list-group-item clearfix';
    if (this.props.complete === 'true') {
      classes = classes + ' list-group-item-success';
    }
   var spinner = this.state.loading ? <i className="fa fa-refresh fa-spin"></i> : <code>{this.state.tag}</code>;
    return (
      <li className={classes}>
        {this.props.task}
        <div className="pull-right" role="group">
          { spinner }
        </div>
      </li>
    );
  }
});

var QuestionForm = React.createClass({
  doSubmit: function (e) {
    e.preventDefault();
    var task = ReactDOM.findDOMNode(this.refs.task).value.trim();
    if (!task) {
      return;
    }
    this.props.onTaskSubmit(task);
    ReactDOM.findDOMNode(this.refs.task).value = '';
    return;
  },
  render: function() {
    return (
      <form className="form-horizontal" onSubmit={this.doSubmit}>
        <div className="form-group">
          <label htmlFor="clasify" className="col-md-2 control-label">Classify</label>
          <div className="col-md-10">
            <input type="text" id="task" ref="task" className="form-control" placeholder="Create a new sentence." />
          </div>
        </div>
        <div className="row">
          <div className="col-md-10 col-md-offset-2 text-right">
            <input type="submit" value="Submit" className="btn btn-primary" />
          </div>
        </div>
      </form>
    );
  }
});

ReactDOM.render(
  <QuestionBox />,
    document.getElementById('react-comp')
);



