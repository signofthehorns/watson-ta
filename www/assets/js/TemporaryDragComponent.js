import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import MessengerLink from './MessengerComponent';
import RRSearch from './RRSearch';
import SolrInfo from './SolrInfo';
import TemporaryDropTarget from './TemporaryDropTarget';

import SideMenuDispatcher from './SideMenuDispatcher';
import SideMenuActionTypes from './SideMenuActionTypes';

class TemporaryDragComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      items: []
    };

    this.token = SideMenuDispatcher.register((payload) => {
      switch (payload.type) {
        case SideMenuActionTypes.PERMUTE:
          this.permute_items(payload.startIndex, payload.targetIndex);
      }
    });
  }

  componentDidMount() {
    this.setState({
      items: [
        this.get_search.bind(this),
        this.get_solr.bind(this),
        this.get_messenger.bind(this),
      ]
    });
  }

  get_search(rowId) {
    return  <RRSearch rowId={rowId}/>;
  }

  get_solr(rowId) {
    return  <SolrInfo rowId={rowId}/>;
  }

  get_messenger(rowId) {
    return  <MessengerLink rowId={rowId}/>;
  }


  permute_items(start,target) {
    var curr = this.state.items;
    var nodes = curr[start];
    var nodet = curr[target];
    curr[start] = nodet;
    curr[target] = nodes;
    this.setState({
      items: curr
    });
  }

  render() {
    var elems = []
    this.state.items.forEach( function(row, i) {
      elems.push(<TemporaryDropTarget rowId={i}/>);
      var comp = row(i);
      elems.push(comp);
    });
  	return (
      <div>
        <div>
          {elems}
        </div>
      </div>
    );
  }
};

export default DragDropContext(HTML5Backend)(TemporaryDragComponent);