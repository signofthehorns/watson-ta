import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Well } from 'react-bootstrap';
var Dropzone = require('react-dropzone');

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


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// TODO: split up demo module below
import { ProgressBar } from 'react-bootstrap';
var PDFUploadDemo = React.createClass({
  getInitialState: function () {
      return {
        files: [],
        progresses: [],
        finished: false,
        doc_text: ''
      };
  },

  onDrop: function (acceptedFiles) {
    this.setState({
      files: acceptedFiles
    });

    var data = new FormData();
    data.append('file', acceptedFiles[0]);

    var config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: function(progressEvent) {
        var percentCompleted = Math.round( 
          (progressEvent.loaded * 100) / progressEvent.total );
        this.setState({
          progress: percentCompleted
        });
      }.bind(this)
    };

    // upload the file to the server 
    axios.post('/pdfupload/upload/', data, config)
      .then(function (res) {
        this.setState({
          finished: res.data.success,
          doc_text: res.data.text
        })
      }.bind(this))
      .catch(function (err) {
        // update state for error.
      }.bind(this));
  },

  render: function () {
    var header = <div>
      <h3>Document Upload Component</h3>
      <p>Starter React component for uploading a document and processing on the backend.</p>
      </div>;
    if (this.state.finished) {
      return (
        <div>
          { header }
          
          <Well>
            <code>{this.state.files[0].name}</code>
            <br/>
            { this.state.doc_text }
          </Well>
          <img className="upload_img" src={this.state.files[0].preview} />
        </div>
      )
    }
    return (
      <div>
        { header }
        { this.state.files.length > 0 
          ? <div>
              <h4>Analyzing {this.state.files.length} files...</h4>
              <div>{
                <div>
                  <p>{this.state.files[0].name}</p>
                  <ProgressBar active now={this.state.progress} bsStyle="success"/>
                  <img className="upload_img" src={this.state.files[0].preview} />
                </div>}
              </div>
            </div> 
          : <Dropzone className="" ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
              <Alert bsStyle="warning">
                Drag a <strong>PDF</strong> here to extract the text from it.
              </Alert>
            </Dropzone>
        }
      </div>
    );
  }
});
ReactDOM.render(<PDFUploadDemo />, document.getElementById('react-pdf'));
