import EditQuestion from './EditQuestion';
import MessengerLink from './MessengerComponent';
import PDFUploadDemo from './PDFUpload';
import PDFView from './PDFView';
import ReactDOM from 'react-dom';
import RRSearch from './RRSearch';
import LeftSideMenu from './LeftSideMenu';
import SolrInfo from './SolrInfo';
import RightMenu from './RightMenu';
import HelpInformation from './HelpInformation';
import EditorOptions from './EditorOptions';

// The following statements check whether an element exists before attempting to render them
// This prevents silent JS null element errors

var elm = null;
if (elm = document.getElementById('react-pdf'))
  ReactDOM.render(<PDFUploadDemo />, elm);

if (elm = document.getElementById('upload-questions'))
  ReactDOM.render(<EditQuestion question={'What are the Deathly Hallows?'} id={0}/>, elm);

if (elm = document.getElementById('left-side-menu'))
  ReactDOM.render(<LeftSideMenu />, elm);

if (elm = document.getElementById('right-side-menu'))
  ReactDOM.render(<RightMenu />, elm);

if (elm = document.getElementById('help-information'))
  ReactDOM.render(<HelpInformation />, elm);

if (elm = document.getElementById('editor-options'))
  ReactDOM.render(<EditorOptions />, elm);

import EditActions from './EditActions';
