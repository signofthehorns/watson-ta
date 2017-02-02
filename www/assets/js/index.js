import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';

const App = React.createClass({
    getInitialState() {
        return {
            tags: [ {id: 1, text: "Physics"} ],
            suggestions: ["Mathematics", "Computer Science", "Electrical Engineering"]
        }
    },
    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    },
    handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    },
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    },
    render() {
        let tags = this.state.tags;
        let suggestions = this.state.suggestions;
        return (
            <div>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} />
            </div>
        )
    }
});

ReactDOM.render(<App />, document.getElementById('react-comp'));


/*var React = require('react')
var ReactDOM = require('react-dom')

var Hello = React.createClass({
  render: function() {
    return (
        <h3>It Works!!</h3>
      )
  }
})

ReactDOM.render(<Hello />, document.getElementById('react-comp'))*/
