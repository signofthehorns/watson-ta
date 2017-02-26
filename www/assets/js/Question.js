import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export class QuestionBox extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
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
  }

  generateId() {
    return Math.floor(Math.random()*90000) + 10000;
  }

  handleSubmit(task) {
    var data = this.state.data;
    var id = this.generateId().toString();
    data = data.concat([{id, task}]);
    this.setState({data});
  }
  
  render() {
    return (
      <div>
        <QuestionForm onTaskSubmit={this.handleSubmit} />
        <QuestionList data={this.state.data} />
      </div>
    );
  }
};

class QuestionList extends React.Component {
  render() {
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
};

export default class QuestionItem extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tag_loading: true,
      ent_loading : false,
      has_ent_data: false,
      concepts: [],
      keywords: [],
      words: [],
    };
  }

  componentDidMount() {
    axios.get('/api/nlc/'+encodeURIComponent(this.props.task)+'/')
      .then(res => {
        this.setState({ 
          tag_loading : false,
          tag : res.data.tag
        });
      });
  }

  updateClass() {
  }

  alchemify(e) {
    this.setState({ 
      ent_loading : true
    });
    axios.get('/api/alchemy/'+encodeURIComponent(this.props.task)+'/')
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
  }

  render() {
    var spinner = this.state.tag_loading ? <i className="fa fa-refresh fa-spin" /> : <code>{this.state.tag}</code>;
    
    // default text if not alchemified
    var text = this.props.task;

    var collapsekey = this.props.nodeId.toString();
    var data_expander = this.state.has_ent_data ?
      <a className="glyphicon" data-toggle="collapse" href={"#collapse"+collapsekey}>&#x2b;</a>
      : <span/>

    var alchemy = this.state.ent_loading ? <i className="fa fa-refresh fa-spin" /> : <i className="fa fa-flask"/>;
    var alchemy = !this.state.tag_loading ? 
      <span className="alchemy" data-toggle="tooltip" data-placement="top" title="alchemify" onClick={() => this.alchemify() }>{alchemy}</span> : <span/>;


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
};

class QuestionForm extends React.Component {
  doSubmit(e) {
    e.preventDefault();
    var task = ReactDOM.findDOMNode(this.refs.task).value.trim();
    if (!task) {
      return;
    }
    this.props.onTaskSubmit(task);
    ReactDOM.findDOMNode(this.refs.task).value = '';
    return;
  }

  render() {
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
};
