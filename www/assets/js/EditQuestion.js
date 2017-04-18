import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
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
     * type             -- object     -- Question Type
     *    class_name    -- string     -- Question Type: [ "sa", "tf", "mc" ]
     *    confidence    -- float      -- Question Type's confidence from Watson NLC
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
      answer: '',
      alchemy: {
        concepts: [],
        keywords: [],
        words: []
      }
    };

    this.save_answer = this.save_answer.bind(this);
    this.handle_answer_change = this.handle_answer_change.bind(this);
    this.display_sa_question = this.display_sa_question.bind(this);
    this.display_tf_question = this.display_tf_question.bind(this);
    this.display_mc_question = this.display_mc_question.bind(this);
    this.display_question = this.display_question.bind(this);
    this.rr_search = this.rr_search.bind(this);
    this.display_concepts = this.display_concepts.bind(this);
    this.display_prompt = this.display_prompt.bind(this);
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

  rr_search(query) {
    EditActions.highlightQuestion(this.state.id);
    EditActions.queryRetrieveAndRank(query);
  }

  save_answer() {
    $("questionAnswer"+this.state.id).submit();
  }

  handle_answer_change(event) {
    var question = {
      id: this.state.id,
      type: this.state.type,
      prompt: this.state.prompt,
      choices: [],
      answer: event.target.value,
    };
    this.setState({ answer: event.target.value });
    EditActions.questionAnswerUpdate(question);
  }

  display_concepts() {
    var concepts = <span />;
    if (this.state.displayAlchemy && this.state.loadedAlchemy) {
      if (this.state.alchemy.concepts.length > 0) {
        var conceptParts = []
        this.state.alchemy.concepts.forEach((concept) => {
          conceptParts.push(<li className="conceptlistitem" onClick={ () => this.rr_search(concept.text) }>
            { concept.text }
          </li>);
        });
        //var style = this.state.isSelected ? 'conceptlist': 'conceptlist-dimmed';
		var style = 'conceptlist';
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
      this.state.alchemy.words.forEach((word) => {
        if (word.tag) {
          promptParts.push(<span className={ word.tag } onClick={ () => this.rr_search(word.fragment) }>{ word.fragment }</span>);
        } else {
          promptParts.push(<span>{ word.fragment }</span>);
        }
      });
      promptParts.push("?");
      prompt = promptParts;
    }
    return prompt;
  }

  display_sa_question() {
    return <form id={ "questionAnswer"+this.state.id }>
      <textarea value={this.state.answer} onChange={this.handle_answer_change}></textarea>
    </form>
  }

  display_tf_question() {
    return <form id={ "questionAnswer"+this.state.id } onChange={this.handle_answer_change} >
      <input type="radio" value="True" name="tf"/>True<br/>
      <input type="radio" value="False" name="tf"/>False
    </form>
  }

  display_mc_question() {
    return <form id={ "questionAnswer"+this.state.id } onChange={this.handle_answer_change} >
      <input type="radio" value="a" name="mc"/>a.<br/>
      <input type="radio" value="b" name="mc"/>b.<br/>
      <input type="radio" value="c" name="mc"/>c.<br/>
      <input type="radio" value="d" name="mc"/>d.
    </form>
  }

  display_question() {
    var type = this.state.type.class_name;
    { /* React Docs have great ReactForm help: https://facebook.github.io/react/docs/forms.html */}
    if (type === 'MC') {
      return this.display_mc_question();
    } else if (type === 'TF') {
      return this.display_tf_question();
    } else { // 'SA'
      return this.display_sa_question();
    }
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
            {/*<li className="nav-item">
              |<i className="fa fa-pencil" title="Edit Question" data-toggle="tooltip" data-placement="bottom"></i>
            </li>*/}
            <li className="nav-item">
              |<i className="fa fa-floppy-o" title="Save Answer" onClick={ () => this.save_answer() } data-toggle="tooltip" data-placement="bottom"></i>
            </li>
            <li className="nav-item">
              |<i className="fa fa-flask" title="Alchemify" onClick={ () => this.alchemify() } data-toggle="tooltip" data-placement="bottom"></i >
            </li>
            <li className="nav-item">
              |<i className="fa fa-search" title="Search Knowledge Base" onClick={ () => this.rr_search(this.state.prompt) } data-toggle="tooltip" data-placement="bottom"></i >
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
