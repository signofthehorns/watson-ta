import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

// We want to receive actions from this dispatcher in order to 
// react to when a user clicks a component
import EditDispatcher from './EditDispatcher';


/* dropdown component for listing the different collections available */
class CollectionDropdown extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  handleClick(e,name) {
    e.preventDefault();
    this.props.set_collection(name);
  }

  render() {
    var dropdown_items = [];
    for (var key in this.props.collections) {
      dropdown_items.push(<h6 className="dropdown-header">{key}</h6>);

      this.props.collections[key].forEach((res) => {
        var name = res;
        dropdown_items.push(<button className="dropdown-item" type="button" onClick={(e) => this.handleClick(e,name)}>{res}</button>);
      });
    }

    return <span className="dropdown">
        <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          { this.props.current_collection }
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
          {dropdown_items}
        </div>
      </span>;
  }
}

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
        loading: false,
        collection: 'hp_collection',
      };
  };

  set_collection(name) {
    this.setState({
      collection: name
    });
  }

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
    // console.log(query);
    axios.get('/api/rr_search/'+encodeURIComponent(query)+'/'+encodeURIComponent(this.state.collection))
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
            <i className="fa fa-cogs" aria-hidden="true"></i> conf .98567
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
    
    // TODO: don't hardcode
    var current_collections = {
      'sherlock' : ['hp_collection', 'example_collection', 'history_collection_with_rank', 'history_collection'],
    }

    var dropdown = <CollectionDropdown collections={current_collections} set_collection={(name) => this.set_collection(name)} current_collection={this.state.collection}/>;

    return (
      <div className="right-widget">
        <h2 style={{'display': 'inline-block'}}><i className="fa fa-file-text" aria-hidden="true" ></i> Retrieve and Rank { dropdown }</h2>
        <form className="form-horizontal" onSubmit={(e) => this.doSubmit(e)}>
          <div className="form-group" >
            <i className="fa fa-search" aria-hidden="true"></i> Solr search
            <br/>
            <div className="input-group">
              <input type="text" id="rr_query" ref="rr_query" className="form-control" placeholder="Search collection"/>
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