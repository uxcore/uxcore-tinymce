/**
 * Tinymce Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');

let Tinymce = require('../src');

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleKeyUp(e, editor) {
        console.log(editor.getContent());
    }

    handleChange(e, editor) {
        console.log(editor.getContent());
    }

    render() {
        let me = this;
        return (
            <div>
                <Tinymce
                    onKeyup={me.handleKeyUp.bind(me)}
                    onChange={me.handleChange.bind(me)}
                    placeholder={'placeholder'}/>
                <Tinymce
                    onKeyup={me.handleKeyUp.bind(me)}
                    onChange={me.handleChange.bind(me)}
                    config={{
                        menubar: false,
                        toolbar1: 'fontselect fontsizeselect | bold italic underline strikethrough removeformat | forecolor backcolor | variable',
                        toolbar2: '',
                        statusbar: false,
                        variable: {
                            "items": [{
                                text: '工号',
                                id: 'gh'
                            }, {
                                text: '姓名',
                                id: 'xm'
                            }]
                        },
                    }}/>
            </div>
        );
    }
};

module.exports = Demo;
