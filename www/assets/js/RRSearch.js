import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

// We want to receive actions from this dispatcher in order to 
// react to when a user clicks a component
import EditDispatcher from './EditDispatcher';

/* ----------------------------------------------------*
 *  Retrieve and Rank Component 
 * ----------------------------------------------------*/
/* 
Will problably want to integrate this component later with the
quiz editing component to show documents related to the currently 
highlighted question.
*/ 
class RRSearch extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        question: null,
        results: [],
        loading: false
      };
  };

  componentDidMount() {
    this.token = EditDispatcher.register((payload) => {
      switch (payload.type) {
        case 'RR_QUERY':
          this.get_search_results(payload.query);
      }
    });
  }

  get_search_results(query) {
    // handle submission of the query
    axios.get('/api/rr_search/'+encodeURIComponent(query))
      .then(res => {
        // TODO: do error/ null checking
        this.setState({ 
          results : res.data.docs,
          loading : false,
        });
      });
    this.setState({
      question: query,
      results: [],
      loading: true,
    });
  }

  doSubmit(e) {
    e.preventDefault();
    var query = ReactDOM.findDOMNode(this.refs.rr_query).value.trim();
    if (!query) {
      return;
    }
    this.get_search_results(query);
    ReactDOM.findDOMNode(this.refs.rr_query).value = '';
    return;
  }

  tagifyBody(text_fragments) {
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
  }

  render() {
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
    var search_metadata = this.state.question != null ? <h4>{'"' + this.state.question + '"'}</h4> : <span/>;
    var num_results = this.state.question != null && !this.state.loading ? <p>Displaying {this.state.results.length} top ranked results matching the query...</p> : <span/>;
    var loading = this.state.loading ? <i className="fa fa-refresh fa-spin"></i> : <span/>;
    
    var dropdown = <span className="dropdown">
          <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Change Collection
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
            <h6 className="dropdown-header">Sherlock Collections</h6>
            <button className="dropdown-item" type="button">Action</button>
            <button className="dropdown-item" type="button">Another action</button>
            <button className="dropdown-item" type="button">Something else here</button>
          </div>
        </span>;

    return (
      <div className="right-widget">
        <h2 style={{'display': 'inline-block'}}><i className="fa fa-file-text" aria-hidden="true" ></i> Retrieve and Rank { dropdown }</h2>
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
        <ul className='rr-search-results'>
          { search_results }
        </ul>
      </div>
    );
  }
};

export default RRSearch;