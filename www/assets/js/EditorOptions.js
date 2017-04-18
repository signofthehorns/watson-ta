import React from 'react';
import pdfMake from 'pdfmake/build/pdfmake.min.js';
import vfsFonts from 'pdfmake/build/vfs_fonts.js';
import EditActions from './EditActions';
import ActionTypes from './EditActionTypes';
import EditDispatcher from './EditDispatcher';

class EditorOptions extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            questions: {}
        };

        this.loadPDFData = this.loadPDFData.bind(this);
        this.openPDF = this.openPDF.bind(this);
        this.printPDF = this.printPDF.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
        this.getPDFDocument = this.getPDFDocument.bind(this);
    }

    componentDidMount() {
        EditDispatcher.register((payload) => {
            switch (payload.type) {
                case ActionTypes.EDITOR__QUESTION_ANSWER_UPDATED:
                    this.loadPDFData(payload.question);
            }
        });
    }

    loadPDFData(question) {
        this.state.questions[question.id] = question;
        // Not going to re-render but who cares!
    }

    openPDF() {
        // open the PDF in a new window
        pdfMake.createPdf(this.getPDFDocument()).open();
    }

    printPDF() {
        // print the PDF
        pdfMake.createPdf(this.getPDFDocument()).print();
    }

    downloadPDF() {
        // download the PDF
        pdfMake.createPdf(this.getPDFDocument()).download('watsonta.pdf');
    }

    getPDFDocument() {
        var renderedContent = [];
        var ids = Object.keys(this.state.questions);
        ids.map((id) => {
            var question = this.state.questions[id];
            if (id === 1) {
                renderedContent.push({text: question.prompt, style: 'header'});
            } else {
                renderedContent.push({text: '\n\n' + question.prompt, style: 'header'});
            }
            if (question.type.class_name === 'MC') {
                renderedContent.push({
                    columns: [
                        {
                            type: 'none',
                            ul: [
                                // TODO: Change to question.choices once that is parsed
                                {text: ' A ', style: (question.answer[0] === 'a' ? 'selected' : 'normal')},
                                {text: ' B ', style: (question.answer[0] === 'b' ? 'selected' : 'normal')}
                            ]
                        },
                        {
                            type: 'none',
                            ul: [
                                {text: ' C ', style: (question.answer[0] === 'c' ? 'selected' : 'normal')},
                                {text: ' D ', style: (question.answer[0] === 'd' ? 'selected' : 'normal')}
                            ]
                        }
                    ],
                    style: 'answer'
                });
            } else if (question.type.class_name === 'TF') {
                var [tStyle, fStyle] = question.answer === 'True' ? ['selected', 'normal'] : ['normal', 'selected'];
                renderedContent.push({
                    type: 'none',
                    ul: [
                        {text: ' True ', style: tStyle},
                        {text: ' False ', style: fStyle}
                    ],
                    style: 'answer'
                });
            } else { // 'SA'
                renderedContent.push({
                    text: (question.answer),
                    style: 'answer'
                });
            }
        });

        var document = {
            content: renderedContent,
            styles: {
                header: {
                    bold: true,
                    fontSize: 18
                },
                selected: {
                    bold: true,
                    background: '#bbb',
                    margin: 5
                },
                normal: {
                    margin: 5
                },
                answer: {
                    marginLeft: 30,
                }
            },
            defaultStyle: {
                fontSize: 12
            }
        };

        return document;
    }

    render() {
        return <div className="edit-icons">
            <i className="fa fa-eye edit-icon edit-icon-right-bar" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="view resulting pdf" onClick={ () => this.openPDF() }></i>
            <i className="fa fa-floppy-o edit-icon edit-icon-right-bar" aria-hidden="true" data-toggle="tooltip" data-placement="bottom"
            title="save progress"></i>
            <i className="fa fa-print edit-icon edit-icon-right-bar" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="print current pdf" onClick={ () => this.printPDF() }></i>
            <i className="fa fa-download edit-icon edit-icon-right-bar" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="download current pdf" onClick={ () => this.downloadPDF() }></i>
            {/*<i className="fa fa-check-square-o edit-icon" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="mark as complete"></i>*/}
        </div>;
    }
};

export default EditorOptions;
