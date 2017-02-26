import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

// We want to send actions from the dispatcher in order to update
// the content of our retrieve and rank component dynamicall
import EditActions from './EditActions';

/* ----------------------------------------------------*
 *  Quiz Editing Questions
 * ----------------------------------------------------*/
class QuestionBase extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: false,
    };
  }

  clicked() {
  	if (!this.state.selected) {
  	  EditActions.queryRetrieveAndRank(this.props.question);
  	}
    this.setState(prevState => ({
      selected: !prevState.selected
    }));
  }

  render() {
  	var num_widgets = 3;
  	var offset = -32 * num_widgets;
  	var highlight_css = this.state.selected ? 'pdf-question-selected' : '';
    return <div className={"pdf-question "+highlight_css} onClick={() => this.clicked()}>
    	<h4 className="glyphicon glyphicon-asterisk q_anchor" style={{left: offset+'px'}}>{this.props.id}<i className="fa fa-pencil iconbarl iconbarr" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="edit question type"></i> <i className="fa fa-flask q_alchemy" data-toggle="tooltip" data-placement="bottom" title="alchemify"></i></h4>
    	<h4 className="glyphicon" style={{left: offset+'px'}}>{ this.props.question }</h4>
    </div>
  }
};

export default QuestionBase;