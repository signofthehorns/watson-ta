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
      data: [
        {"id":"0","task":"Name three types of dogs."},
        {"id":"1","task":"What is a television?"},
        {"id":"2","task":"List the different themes present in Homers The Iliad."},
        {"id":"3","task":"How can we eliminate disease from the human genome?"},
        {"id":"4","task":"2+2=fish"},
        {"id":"5","task":"Donald Trump is a humble person."},
        {"id":"6","task":"Shapes have 4 90 degree angles."},
        {"id":"7","task":"A triangle by definition has 3 or more sides."},
        {"id":"8","task":"The internal temperature of the suns core is greater than 1 trillion degrees celsius"},
        {"id":"9","task":"Humans are descended from chimpanzees."},
        {"id":"10","task":"Small dogs live longer than older dogs."},
        {"id":"11","task":"Karen can tell if it is currently raining."},
        {"id":"12","task":"Excel can tell the difference between numbers and letters."},
        {"id":"13","task":"Bobo the gorilla can list the letters of the alphabet."},
        {"id":"14","task":"ackon Pollock revolutionized art with photo-realistic painting"},
        {"id":"15","task":"The assembly line made cars widely available and affordable."},
        {"id":"16","task":"George Washington said \"Can I cut down this tree?\""},
        {"id":"17","task":"The girls asked \"What is a television?\""},
        {"id":"18","task":"Describe how the assembly line made cars widely available and affordable."},
        {"id":"19","task":"Which of the following are related to space? a. saucers b. Mars c. dirt"},
        {"id":"20","task":"Select the most correct sentence. A) Lizards are primates. B) Science is subjective. C) Science rules."},
        {"id":"21","task":"How many people live in SF California? 1) 2000 2) 20000 3) 200000 4) 2000000 5) 20000000"},
        {"id":"22","task":"Which type of grass is most commonly found in Ohio? 1 Blue grass 2 alfalfa 3 green grass."},
        {"id":"23","task":"What is the solution to 0=x-1? 1. x=1 2. x=2 3. x=3"},
      ]
    };
  },
  generateId: function () {
    return Math.floor(Math.random()*90000) + 10000;
  },

  handleSubmit: function (task) {
    var data = this.state.data;
    var id = this.generateId().toString();
    data = data.concat([{id, task}]);
    this.setState({data});
  },
  render: function() {
    return (
      <div>
        <QuestionForm onTaskSubmit={this.handleSubmit} />
        <QuestionList data={this.state.data} />
      </div>
    );
  }
});

var QuestionList = React.createClass({
  render: function() {
    var listNodes = this.props.data.map(function (listItem) {
      return (
        <QuestionItem key={listItem.id} nodeId={listItem.id} task={listItem.task}/>
      );
    },this);
    return (
      <dl className="dl-horizontal">
        {listNodes}
      </dl>
    );
  }
});

var QuestionItem = React.createClass({
  componentDidMount: function() {
    axios.get('http://localhost:8080/pdfupload/classify/'+this.props.task+'/')
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
  updateClass: function () {
    
  },
  render: function() {
    // var classes = 'list-group-item clearfix';
    var spinner = this.state.loading ? <i className="fa fa-refresh fa-spin"></i> : <code>{this.state.tag}</code>;
    return (
      <div>
        <dt><code>{ spinner }</code></dt>
        <dd>{this.props.task}</dd>
      </div>
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





















