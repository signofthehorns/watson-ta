import EditQuestion from './EditQuestion';
import MessengerLink from './MessengerComponent';
import PDFUploadDemo from './PDFUpload';
import PDFView from './PDFView';
import ReactDOM from 'react-dom';
import RRSearch from './RRSearch';
import SideUserMenu from './SideUserMenu';
import SolrInfo from './SolrInfo';
import TemporaryDragComponent from './TemporaryDragComponent';

// The following statements check whether an element exists before attempting to render them
// This prevents silent JS null element errors

var elm = null;
if (elm = document.getElementById('react-pdf'))
  ReactDOM.render(<PDFUploadDemo />, elm);

if (elm = document.getElementById('upload-questions'))
  ReactDOM.render(<EditQuestion question={'What are the Deathly Hallows?'} id={0}/>, elm);

if (elm = document.getElementById('side-user-menu'))
  ReactDOM.render(<SideUserMenu />, elm);

if (elm = document.getElementById('right-side-menu'))
  ReactDOM.render(<TemporaryDragComponent />, elm);

// Example of dispatching an action via flux in order to set the retrieve and rank question
import EditActions from './EditActions';
// EditActions.queryRetrieveAndRank('horcruxes');
