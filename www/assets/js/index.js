import ReactDOM from 'react-dom';
import {QuestionBox} from './Question';
import PDFUploadDemo from './PDFUpload';
import RRSearch from './RRSearch';
import SolrInfo from './SolrInfo';
import EditQuizContainer from './EditQuizContainer';
import UploadEditQuestions from './UploadEditQuestions';

if (elm = document.getElementById('react-comp'))
  ReactDOM.render(<QuestionBox />, elm);

if (elm = document.getElementById('react-pdf'))
  ReactDOM.render(<PDFUploadDemo />, elm);

if (elm = document.getElementById('rr-search'))
  ReactDOM.render(<RRSearch />, elm);

if (elm = document.getElementById('solr-collections'))
  ReactDOM.render(<SolrInfo />, elm);

if (elm = document.getElementById('edit-quiz'))
  ReactDOM.render(<EditQuizContainer />, elm);

if (elm = document.getElementById('upload-questions'))
  ReactDOM.render(<UploadEditQuestions question={'What are the Deathly Hallows?'} id={0}/>, elm);

// Example of dispatching an action via flux in order to set the retrieve and rank question
import EditActions from './EditActions';
// EditActions.queryRetrieveAndRank('horcruxes');
