import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { ProgressBar } from 'react-bootstrap';
import QuestionBase from './EditQuestion'

class PDFUploadDemo extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      files: [],
      progresses: [],
      finished: false,
      questions: [],
      classifierId: ""
    };

    this.onFileDrop = this.onFileDrop.bind(this);
    this.renderEditor = this.renderEditor.bind(this);
    this.renderLoadingBar = this.renderLoadingBar.bind(this);
    this.renderDropzone = this.renderDropzone.bind(this);
    this.renderUpload = this.renderUpload.bind(this);
  }

  onFileDrop(acceptedFiles) {
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

    var self = this;
    // upload the file to the server 
    axios.post('/api/upload/questions/', data, config)
      .then(function (res) {
        self.setState({
          files: acceptedFiles,
          finished: res.data.success,
          questions: res.data.questions
        })
      }.bind(this));
  }

  renderEditor() {
    return (
        <div>
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
              return <QuestionBase question={object.prompt} type={object.type} id={i+1} key={i}/>;
          })}
          </ListGroup>
        </div>
      )
  }

  renderLoadingBar() {
    return <div>
      <h4>Analyzing {this.state.files.length} files...</h4>
      <div>{
        <div>
          <p>{this.state.files[0].name}</p>
          <ProgressBar active now={this.state.progress} bsStyle="success"/>
          <img className="upload_img" src={this.state.files[0].preview} />
        </div>}
      </div>
    </div>
  }

  renderDropzone() {
    return <Dropzone className="" ref={(node) => { this.dropzone = node; }} onDrop={this.onFileDrop} rejectStyle='true'>
      <Alert bsStyle="warning">
        Drag a <strong>PDF</strong> here to extract the text from it.
      </Alert>
    </Dropzone>
  }

  renderUpload() {
    return (
      <div>
        { this.state.files.length > 0 ? this.renderLoadingBar() : this.renderDropzone() }
      </div>
    );
  }

  render() {
    return this.state.finished ? this.renderEditor() : this.renderUpload();
  }
};

export default PDFUploadDemo;
