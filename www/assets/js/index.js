import ReactDOM from 'react-dom';
import {QuestionBox} from './Question';
import PDFUploadDemo from './PDFUpload';
import RRSearch from './RRSearch';
import SolrInfo from './SolrInfo';
import EditQuizContainer from './EditQuizContainer';
import UploadEditQuestions from './UploadEditQuestions';

ReactDOM.render(<QuestionBox />, document.getElementById('react-comp'));
ReactDOM.render(<PDFUploadDemo />, document.getElementById('react-pdf'));
ReactDOM.render(<RRSearch />, document.getElementById('rr-search'));
ReactDOM.render(<SolrInfo />, document.getElementById('solr-collections'));
ReactDOM.render(<EditQuizContainer />, document.getElementById('edit-quiz'));
ReactDOM.render(<UploadEditQuestions question={'What are the Deathly Hallows?'} id={0}/>, document.getElementById('upload-questions'));

// Example of dispatching an action via flux in order to set the retrieve and rank question
import EditActions from './EditActions';
// EditActions.queryRetrieveAndRank('horcruxes');