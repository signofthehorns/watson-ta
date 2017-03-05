import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

// We want to send actions from the dispatcher in order to update
// the content of our retrieve and rank component dynamicall
import EditActions from './EditActions';
import EditDispatcher from './EditDispatcher';

/* ----------------------------------------------------*
 *  Quiz Editing Questions
 * ----------------------------------------------------*/
class QuestionBase extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: false,
      tag_loading: true,
      ent_loading : false,
      has_ent_data: false,
      concepts: [],
      keywords: [],
      words: [],
    };
  }

  componentDidMount() {
    this.token = EditDispatcher.register((payload) => {
      switch (payload.type) {
        case 'HIGHLIGHT':
          this.maybe_highlight(payload.id);
      }
    });

    // getting tag
    // axios.get('/api/nlc/'+encodeURIComponent(this.props.task)+'/')
    // .then(res => {
    //   this.setState({ 
    //     tag_loading : false,
    //     tag : res.data.tag
    //   });
    // });
  }

  alchemify(e) {
    this.setState({ 
      ent_loading : true
    });
    axios.get('/api/alchemy/'+encodeURIComponent(this.props.question)+'/')
      .then(res => {
        console.log(res)
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

  maybe_highlight(id) {
    this.setState({
      selected: id==this.props.id
    });
  }

  clicked() {
  	if (!this.state.selected) {
      EditActions.highlightQuestion(this.props.id);
  	  EditActions.queryRetrieveAndRank(this.props.question);
  	} else {
      EditActions.highlightQuestion(-1);
    }
  }

  get_concepts() {
    if (this.state.concepts && this.state.concepts.length > 0) {
      var concepts = []
      this.state.concepts.forEach(function(concept) {
        concepts.push(<li className="conceptlistitem"><a href="">{concept.text}</a></li>);
      });
      var div_id = this.state.selected ? 'conceptlist': 'conceptlist-dimmed';
      return <div>
          <ul id={div_id}>
            { concepts }
          </ul>
        </div>;
    }
    return <span />;
  }

  get_question_text() {
    var text = <span>{this.props.question}</span>;
    if (this.state.has_ent_data) {
      // display text with highlighted entities
      var sentence = [];
      this.state.words.forEach(function(w) {
        if (w.tag) {
          sentence.push(<span className={ w.tag }>{ w.fragment }</span>);
        } else {
          sentence.push(<span>{ w.fragment }</span>);
        }
      });
      text = sentence;
    }
    return text;
  }

  render() {
  	var num_widgets = 3;
  	var offset = -32 * num_widgets;
  	var highlight_css = this.state.selected ? 'pdf-question-selected' : '';

    var concepts = this.get_concepts();
    var question_text = this.get_question_text();


    return <div className={"pdf-question "+highlight_css} onClick={() => this.clicked()}>
    	<h4 className="glyphicon glyphicon-asterisk q_anchor" style={{left: offset+'px'}}>{this.props.id}<i className="fa fa-pencil iconbarl iconbarr" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="edit question type"></i> <i className="fa fa-flask q_alchemy" data-toggle="tooltip" data-placement="bottom" title="alchemify" onClick={() => this.alchemify()}></i></h4>
    	  <h4 className="glyphicon" style={{left: offset+'px'}} >{ question_text }</h4>
        {concepts}
    </div>
  }
};

export default QuestionBase;