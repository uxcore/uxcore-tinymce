/**
 * Tinymce Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

const Button = require('uxcore-button');
const React = require('react');

const Tinymce = require('../src');


class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: 'default content',
    };
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  handleKeyUp(e, editor) {
    console.log(editor.getContent());
    this.setState({
      content: editor.getContent(),
    });
  }

  handleChange(e, editor) {
    console.log(editor.getContent());
    this.setState({
      content: editor.getContent(),
    });
  }

  handleContentChange() {
    this.setState({
      content: 'content has been changed',
    });
  }

  render() {
    const me = this;
    return (
      <div>
        <Tinymce
          onKeyup={me.handleKeyUp.bind(me)}
          onChange={me.handleChange.bind(me)}
          content={me.state.content}
          placeholder={'placeholder'}
        />
        <Button onClick={this.handleContentChange}>修改默认值</Button>
        <Tinymce
          onKeyup={me.handleKeyUp.bind(me)}
          onChange={me.handleChange.bind(me)}
          config={{
            menubar: false,
            toolbar1: 'fontselect fontsizeselect | bold italic underline strikethrough removeformat | forecolor backcolor | variable',
            toolbar2: '',
            statusbar: false,
            variable: {
              items: [{
                text: '工号',
                id: 'gh',
              }, {
                text: '姓名',
                id: 'xm',
              }],
            },
          }}
        />
      </div>
    );
  }
}

module.exports = Demo;
