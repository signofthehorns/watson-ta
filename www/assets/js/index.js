import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Well } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
var Dropzone = require('react-dropzone');

var QuestionBox = React.createClass({
  getInitialState: function () {
    return {
      data: [
        {"id":"0","task":"explain why Jimmy Fallon always seems to be fake laughing."},
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
        {"id":"1","task":"What is a television?"},
        {"id":"3","task":"How can we eliminate disease from the human genome?"},
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
      <ol className="dl-horizontal">
        {listNodes}
      </ol>
    );
  }
});

var QuestionItem = React.createClass({
  componentDidMount: function() {
    axios.get('http://localhost:8000/pdfupload/classify/'+encodeURIComponent(this.props.task)+'/')
      .then(res => {
        this.setState({ 
          tag_loading : false,
          tag : res.data.tag
        });
      });
  },

  getInitialState: function () {
    return {
      tag_loading: true,
      ent_loading : false,
      has_ent_data: false,
      concepts: [],
      keywords: [],
      words: [],
    };
  },
  updateClass: function () {
    
  },

  alchemify: function (e) {
    this.setState({ 
      ent_loading : true
    });
    axios.get('http://localhost:8000/pdfupload/alchemify/'+encodeURIComponent(this.props.task)+'/')
      .then(res => {
        this.setState({ 
          ent_loading : false,
          has_ent_data: true,
          concepts: res.data.concepts,
          keywords: res.data.keywords,
          words: res.data.words,
        });
      });
    return;
  },

  render: function() {
    // var classes = 'list-group-item clearfix';
    var spinner = this.state.tag_loading ? <i className="fa fa-refresh fa-spin" /> : <code>{this.state.tag}</code>;
    
    // default text if not alchemified
    var text = this.props.task;

    var collapsekey = this.props.nodeId.toString();
    var data_expander = this.state.has_ent_data ?
      <a className="glyphicon" data-toggle="collapse" href={"#collapse"+collapsekey}>&#x2b;</a>
      : <span/>

    var alchemy = this.state.ent_loading ? <i className="fa fa-refresh fa-spin" /> : <i className="fa fa-flask"/>;
    var alchemy = !this.state.tag_loading ? 
      <span className="alchemy" data-toggle="tooltip" data-placement="top" title="alchemify" onClick={this.alchemify}>{alchemy}</span> : <span/>;


    var ent_data = <span/>;

    // handle the state if entity data is present
    if (this.state.has_ent_data) {
      alchemy = <i className="fa fa-check-circle alchemy-done"/>;

      // TODO(bill): extract logic below into separate functions
      // display text with highlighted entities
      var sentence = []
      this.state.words.forEach(function(w) {
        if (w.tag) {
          sentence.push(<span className={ w.tag }>{ w.fragment }</span>);
        } else {
          sentence.push(<span>{ w.fragment }</span>);
        }
      });
      text = sentence;

      // handle keywords
      // should do length check      
      var keywords = [];
      this.state.keywords.forEach(function(kw) {
        var objkeys = [];
        Object.keys(kw).forEach(function(key,index) {
          objkeys.push(
            <ul>
              <li>{ key }: { kw[key].toString() }</li>
            </ul>);
        });

        keywords.push(<div><strong>{kw.text}</strong>{objkeys}</div>);
      });
      var keyword_format = 
        <li>
          <a className="glyphicon" data-toggle="collapse" href={"#collapsekeyword"+collapsekey}>&#x2b;</a><kbd>Keywords</kbd>
          <div id={"collapsekeyword"+collapsekey} className="panel-collapse collapse">
            { keywords }
          </div>
        </li>;


      // concepts
      // should do length check      
      var concepts = [];
      this.state.concepts.forEach(function(conc) {
        var objkeys = [];
        Object.keys(conc).forEach(function(key,index) {
          objkeys.push(
            <ul>
              <li>{ key }: { conc[key].toString() }</li>
            </ul>);
        });
        concepts.push(<div><strong>{conc.text}</strong>{objkeys}</div>);
      });
      var concept_format = 
        <li>
          <a className="glyphicon" data-toggle="collapse" href={"#collapseconcepts"+collapsekey}>&#x2b;</a><kbd>Concepts</kbd>
          <div id={"collapseconcepts"+collapsekey} className="panel-collapse collapse">
            { concepts }
          </div>
        </li>;

      var content = <ul className="list-group">{ keyword_format }{ concept_format }</ul>
      var collapsable = 
        <div id={"collapse"+collapsekey} className="panel-collapse collapse">
          { content }
        </div>;
      ent_data = collapsable;
    }


    return (
      <li>
        { data_expander }
        <code>{ spinner }</code>
        { text }
        { alchemy }
        { ent_data }
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















// Need a way for user to change question type if computer got it wrong
// plus alchemy capabilities.

// every question should have at least text + tags
// var Question = React.createClass({
//   render: function() {
//   },
// });

var MuiltipleChoice = React.createClass({
  // have a special watson suggested choice if possible
  getInitialState: function () {
      return {
        question: 'Which of the following presidents, famously held the office for the least amount of time?',
        options: ['James Monroe', 'Willia Henry Harrison', 'James Garfield', 'Chester A. Arthur'],
        selection: 1
      };
  },
  render: function () {
    return <p>Multiple Choice!</p>;
  },
});

var TrueFalse = React.createClass({
  render: function () {
    return <p>True False!</p>;
  },
});

var ShortAnswer = React.createClass({
  render: function () {
    return <p>ShortAnswer!</p>;
  },
});


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
        questions: []
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
          questions: res.data.text
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
          <ul className="media-list">
            <li className="media bottomborder">
              <div className="media-left">
                <a href="#">
                  <img className="shrink d-flex mr-3 media-object upload_img" src={this.state.files[0].preview} />
                </a>
              </div>
              <div className="media-body">
                <h4>{this.state.files[0].name}</h4>
                <p>The following questions were extracted from the pdf</p>
              </div>
            </li>
          </ul>


          <ListGroup>
          { this.state.questions.map(function(object, i){
              return <ListGroupItem><QuestionItem key={i} nodeId={i} task={object.text}/></ListGroupItem>;
          })}
          </ListGroup>
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
        <MuiltipleChoice/>
        <TrueFalse/>
        <ShortAnswer/>
      </div>
    );
  }
});
ReactDOM.render(<PDFUploadDemo />, document.getElementById('react-pdf'));



/* ----------------------------------------------------*
 *  Retrieve and Rank Component 
 * ----------------------------------------------------*/

/* 
Will problably want to integrate this component later with the
quiz editing component to show documents related to the currently 
highlighted question.
*/ 
var RRSearch = React.createClass({
  getInitialState: function () {
      return {
        question: null,
        results: [],
        loading: false
      };
  },

  doSubmit: function(e) {
    e.preventDefault();
    var query = ReactDOM.findDOMNode(this.refs.rr_query).value.trim();
    if (!query) {
      return;
    }
    // handle submission of the query
    axios.get('http://localhost:8000/rr_search/'+encodeURIComponent(query))
      .then(res => {
        // TODO: do error/ null checking
        this.setState({ 
          results : res.data.docs,
          loading : false,
        });
        console.log(res);
      });
    this.setState({
      question: query,
      results: [],
      loading: true,
    })
    ReactDOM.findDOMNode(this.refs.rr_query).value = '';
    return;
  },

  tagifyBody: function(text_fragments) {
    var frags = [];
    Object.keys(text_fragments).forEach(function(key,index) {
      var obj = text_fragments[key];
      if (obj && obj.tag != null) {
        frags.push(<mark>{ obj.fragment }</mark>);
      } else {
        frags.push(<span>{ obj.fragment }</span>);
      }
    });
    return <span>{ frags }</span>;
  },

  render: function () {
    var search_results = [];
    // TODO @javascript expert: is there better way to pass in this to loop?
    var self = this;
    this.state.results.forEach(function(res) {
      var format_body = self.tagifyBody(res.body);
      search_results.push(
        <span>
          <li><strong>{ res.title }</strong> <i className="fa fa-file-pdf-o" aria-hidden="true"></i></li>
            <ul>
              <li>
                <blockquote className="blockquote">
                  { format_body }
                </blockquote>
              </li>
            </ul>
        </span>
      );
    });

    // <mark>Au. afarensis</mark>
    var search_metadata = this.state.question != null ? <h4>{'"' + this.state.question + '"'}</h4> : <span/>;
    var num_results = this.state.question != null && !this.state.loading ? <p>Displaying {this.state.results.length} top ranked results matching the query...</p> : <span/>;
    var loading = this.state.loading ? <i className="fa fa-refresh fa-spin"></i> : <span/>;

    return (
      <div className="right-widget">
        <h2><i className="fa fa-file-text concept" aria-hidden="true"></i> Retrieve and Rank (Harry Potter)</h2>
        <form className="form-horizontal" onSubmit={this.doSubmit}>
          <div className="form-group" >
            <i className="fa fa-search" aria-hidden="true"></i> Solr search
            <br/>
            <div className="input-group">
              <input type="text" id="rr_query" ref="rr_query" className="form-control" placeholder="Tale of the Three Brothers"/>
              <span className="input-group-btn">
                <button className="btn btn-default btn-primary" type="submit">Search</button>
              </span>
            </div>
          </div>
        </form>
        { search_metadata }
        { loading }
        { num_results }
        <ul>
          { search_results }
        </ul>
        <br/>
        <br/>
      </div>
    );
  }
});
ReactDOM.render(<RRSearch />, document.getElementById('rr-search'));







