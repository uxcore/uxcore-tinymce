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

    render() {
        return (
            <div>
                <Tinymce onChange={(e)=>{console.log(e.target.getContent())}}/>
            </div>
        );
    }
};

module.exports = Demo;
