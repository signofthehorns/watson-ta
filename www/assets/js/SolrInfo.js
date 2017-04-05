import React, {Component, PropTypes} from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { DragSource } from 'react-dnd';
import SideMenuActions from './SideMenuActions';

const SolrInfoSource = {
  beginDrag(props) {
    return {};
  },
  
  endDrag(props, monitor, component) {
    var result = monitor.getDropResult();
    if (result && 'rowId' in result) {
      const startIndex = props.rowId;
      const targetIndex = result.rowId;
      SideMenuActions.permuteMenuItems(startIndex,targetIndex);
    }
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

/* ----------------------------------------------------*
 *  Solr Info Components
 * ----------------------------------------------------*/
// This component lists all of the currently active solr components
// Maybe later we can add additional functionality so it can act as 
// debug tool
class SolrInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.get_clusters();
    this.state = {
      clusters: [],
      loading_clusters: true,
      cluster_success: false,
      ccr_table: false,
    };
  };

  get_clusters() {
    axios.get('/api/list_clusters/')
      .then(res => {
        this.setState({
          clusters: res.data.clusters,
          loading_clusters: false,
          cluster_success: true,
          ccr_table: <ClusterTableInfo clusters={res.data.clusters}/>
        });
      });
  }

  render() {
    // get props for dragging
    const connectDragSource = this.props.connectDragSource;
    const isDragging = this.props.isDragging;

    var loading_cluster = this.state.loading_clusters ? <span><i className="fa fa-refresh fa-spin"></i> Loading Solr Clusters</span> : <span>current clusters and statuses</span>;
    var clusters = [];
    this.state.clusters.forEach(function(res) {
      var status_class = res.solr_cluster_status=='READY' ? 'solr-ready' : '';
      clusters.push(
        <tr>
          <th scope="row">{ res.cluster_name }</th>
          <td>{ res.solr_cluster_id }</td>
          <td>{ res.cluster_size }</td>
          <td><span className={status_class}>{ res.solr_cluster_status }</span></td>
        </tr>
      );
    });
    var cluster_table = this.state.loading_clusters ? <span/> : <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Cluster Size</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            { clusters }
          </tbody>
        </table>;
    var ccr_header = <h4>Per Cluster Info</h4>;
    var ccr_text = <span>more detailed infor about cluster configs, collections, and rankers</span>
    var ccr = this.state.cluster_success ? 
      <div>
        { ccr_header }
        { ccr_text }
        { this.state.ccr_table } 
      </div>
      : <span/>

    return connectDragSource(
      <div className="right-widget right-widget-shaded" style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move'
          }}>
        <h2 className="top-divider"><i className="fa fa-globe" aria-hidden="true"></i> Solr Info</h2>
        <h4>Clusters</h4>
        { loading_cluster }
        <ul>
        </ul>
        { cluster_table }
        <br/>
        { ccr }
      </div>
    );
  }
};

class ClusterTableInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      configs: new Array(props.clusters.length),
      collections: new Array(props.clusters.length),
      rankers: new Array(props.clusters.length),
    };
  }

  //TODO: Possible race condition when loaing clusters, rankers..
  componentWillMount() {
    var configs = this.state.configs;
    var collections = this.state.collections;
    var rankers = this.state.rankers;
    var self = this;
    this.props.clusters.forEach( function(cluster, i) {
      // send off async requests to get
      // ... configs...
      axios.get('/api/list_configs/'+encodeURIComponent(cluster.solr_cluster_id))
        .then(res => {
          configs[i] = res.data.configs;
          self.setState({
            configs: configs,
          });
        });

      // ... collections...
      axios.get('/api/list_collections/'+encodeURIComponent(cluster.solr_cluster_id))
        .then(res => {
          collections[i] = res.data.collections;
          self.setState({
            collections: collections,
          });
        });
      // ... rnakers...
      // axios.get('/api/list_rankers/'+encodeURIComponent(cluster.solr_cluster_id))
      //   .then(res => {
      //     rankers[i] = res.data.rankers;
      //     self.setState({
      //       rankers: rankers,
      //     });
      //   });
    });
  }

  get_formatted(arr) {
    var res = []
    arr.forEach(function(item) {
      res.push(<li>{ item }</li>)
    });
    return <ul>{ res }</ul>;
  }

  // TODO Show rankers in a separate table
  render() {
    // show table if |clusters| > 0
    var clusters = this.props.clusters;
    if (clusters.length == 0) {
      return <span/>;
    }
    var rows = []
    var configs = this.state.configs;
    var collections = this.state.collections;
    var self = this;
    clusters.forEach( function(cluster, i) {
      var name = cluster.cluster_name + ' ( ' + cluster.solr_cluster_id + ' )';
      var loading_icon = <i className="fa fa-refresh fa-spin" />;
      var row_configs = configs[i] ? self.get_formatted(configs[i]) : loading_icon;
      var row_collections = collections[i] ? self.get_formatted(collections[i]) : loading_icon;
      rows.push(
        <tr>
          <th scope="row"> { name } </th>
          <td>
            { row_configs }
          </td>
          <td>
           { row_collections }
          </td>
        </tr>
      );
    });
    return <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Configs</th>
          <th>Collections</th>
        </tr>
      </thead>
      <tbody>
        { rows }
      </tbody>
    </table>;
  }
};

SolrInfo.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource('SIDE_MENU', SolrInfoSource, collect)(SolrInfo);