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

    /** 
     * NOTE - Bill said these are all Alchemy related
     * isSelected       -- bool       -- Is the user rr searching the  question
     * loadedAlchemy    -- bool       -- Alchemy data loaded
     * loadingAlchemy   -- bool       -- Alchemy data loading (request in transit)
     * displayAlchemy   -- bool       -- Should the Alchemy data be displayed?
     * tag_loading      -- bool       -- NLC Loading
     * id               -- number     -- Question ID
     * type             -- string     -- Question Type: [ "sa", "tf", "mc" ]
     * question         -- string     -- Question Text: "Will we get an A?"
     * choices          -- [strings]  -- Choices for the question
     * answer           -- [strings]  -- Answer for the question
     * alchemy          -- object     -- Alchemy data elements of the question
     *    concepts      -- [strings]  -- Alchemy's identified concepts
     *    keywords      --            -- Alchemy's identified keywords
     *    words         --            -- Alchemy's format of the questions prompt
     */
    this.state = {
      isSelected: false,
      loadedAlchemy: false,
      loadingAlchemy: false,
      displayAlchemy: false,
      tag_loading: true,
      // ent_loading : false,
      id: this.props.id,
      type: this.props.type,
      prompt: this.props.question,
      choices: [],
      answer: this.props.type.class_name,
      alchemy: {
        concepts: [],
        keywords: [],
        words: []
      }
    };

    this.save_answer = this.save_answer.bind(this);
    this.handle_change_sa_question = this.handle_change_sa_question.bind(this);
    this.display_sa_question = this.display_sa_question.bind(this);
    this.display_question = this.display_question.bind(this);
  }

  componentDidMount() {
    this.token = EditDispatcher.register((payload) => {
      switch (payload.type) {
        case 'HIGHLIGHT':
          this.rr_search_highlight(payload.id);
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
    if (!this.state.loadedAlchemy) {
      // TODO - If the survice is down does this or the backend retry?
      if (!this.state.loadingAlchemy) {
        this.setState({ 
          loadingAlchemy: true
        });
        axios.get('/api/alchemy/'+encodeURIComponent(this.state.prompt)+'/')
          .then(res => {
            console.log(res)
            this.setState({
              loadedAlchemy: true,
              loadingAlchemy: false,
              displayAlchemy: true,
              alchemy: {
                concepts: res.data.concepts,
                keywords: res.data.keywords,
                words: res.data.words,
              }
            });
          });
        }
    } else {
      this.setState({
        displayAlchemy: !this.state.displayAlchemy
      })
    }
    return;
  }

  rr_search_highlight(id) {
    this.setState({
      isSelected: id==this.state.id
    });
  }

  rr_search() {
    EditActions.highlightQuestion(this.state.id);
    EditActions.queryRetrieveAndRank(this.state.prompt);
  }

  save_answer() {
    $("questionAnswer"+this.state.id).submit();
  }

  handle_change_sa_question(event) {
    this.setState({ answer: event.target.value });
  }

  display_concepts() {
    var concepts = <span />;
    if (this.state.displayAlchemy && this.state.loadedAlchemy) {
      if (this.state.alchemy.concepts.length > 0) {
        var conceptParts = []
        this.state.alchemy.concepts.forEach(function(concept) {
          conceptParts.push(<li className="conceptlistitem">
            <a href="">{concept.text}</a>
          </li>);
        });
        var style = this.state.isSelected ? 'conceptlist': 'conceptlist-dimmed';
        concepts = <ul id={ style }>
              { conceptParts }
            </ul>;
      }
    }
    return concepts;
  }

  display_prompt() {
    var prompt = <span>{ this.state.prompt }</span>;
    if (this.state.displayAlchemy && this.state.loadedAlchemy) {
      // display prompt with highlighted entities
      var promptParts = [];
      this.state.alchemy.words.forEach(function(w) {
        if (w.tag) {
          promptParts.push(<span className={ w.tag }>{ w.fragment }</span>);
        } else {
          promptParts.push(<span>{ w.fragment }</span>);
        }
      });
      promptParts.push("?");
      prompt = promptParts;
    }
    return prompt;
  }

  display_sa_question() {
    return <form id={ "questionAnswer"+this.state.id }>
      <textarea value={this.state.answer} onChange={this.handle_change_sa_question}></textarea>
    </form>
  }

  display_question() {
    // if (this.state.type === 'SA') {
    //   return this.display_sa_question();
    // } else if (this.state.type === 'TF') {
    //   return this.display_tf_question();
    // } else {
    //   return this.display_mc_question();
    // }
    return this.display_sa_question();
  }

  render() {
  	var rr_search_highlight = this.state.isSelected ? " question-rr" : "";

    var prompt = this.display_prompt();
    var concepts = this.display_concepts();
    var answer_section = this.display_question(); 

    // TODO David - 3/4 - Switch to bootstrap card
    return <div className = { "card question" + rr_search_highlight }>
        { /* Question options -- id, edit, alchemy, etc. */ }
        <div className="card-header">
          <ul className="nav nav-pills card-header-pills question-options">
            <li className="nav-item question-id">
              Question { this.state.id }
            </li>
            <li className="nav-item">
              |<i className="fa fa-pencil" title="Edit Question" data-toggle="tooltip" data-placement="bottom"></i>
            </li>
            <li className="nav-item">
              |<i class="fa fa-floppy-o" title="save progress" data-toggle="tooltip" data-placement="bottom" onClick={ () => this.save_answer() }></i>
            </li>
            <li className="nav-item">
              |<i className="fa fa-flask" title="Alchemify" onClick={ () => this.alchemify() } data-toggle="tooltip" data-placement="bottom"></i >
            </li>
            <li className="nav-item">
              |<i className="fa fa-search" title="Retrieve and Rank" onClick={ () => this.rr_search() } data-toggle="tooltip" data-placement="bottom"></i >
            </li>
          </ul>
        </div>
        <div className="card-block">
          { /* Question itself */ }
          <h4 className="card-title">{ prompt }</h4>
          <div className="card-text">
            { /* TODO - Render question choices based on type */ }
            { answer_section }
          </div>
          <div>
            { /* Question content */ }
            <div>
              { concepts }
            </div>
          </div>
        </div>
    </div>
  }
};

export default QuestionBase;