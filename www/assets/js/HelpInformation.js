import React from 'react';

class HelpInformation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
        <h4>What does X mean?</h4>
        <ul className="help-information">
            <li><i className="fa fa-floppy-o"></i> Have extra piece of mind and save your answer!</li>
            <li><i className="fa fa-flask"></i> What does Watson TA think is the focus of the question? Click on the resulting highlighted content to search it in the knowledge base!</li>
            <li><i className="fa fa-search"></i> Search the question in the knowledge base!</li>
        </ul>
    </div>
  }
};

export default HelpInformation;
