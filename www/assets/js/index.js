import EditQuestion from './EditQuestion';
import MessengerLink from './MessengerComponent';
import PDFUploadDemo from './PDFUpload';
import PDFView from './PDFView';
import ReactDOM from 'react-dom';
import RRSearch from './RRSearch';
import SideUserMenu from './SideUserMenu';
import SolrInfo from './SolrInfo';
import TemporaryDragComponent from './TemporaryDragComponent';
import HelpInformation from './HelpInformation';

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

if (elm = document.getElementById('help-information'))
  ReactDOM.render(<HelpInformation />, elm);

import EditActions from './EditActions';
