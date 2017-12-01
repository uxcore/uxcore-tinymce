/**
 * Tinymce Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import Button from 'uxcore/lib/Button';
import Dialog from 'uxcore/lib/Dialog';

import React from 'react';
import Tinymce from '../src';


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
          placeholder="不是 placeholder"
          config={{
            menubar: false,
            paste_remove_styles_if_webkit: false,
            toolbar1: 'fontselect fontsizeselect | bold italic underline strikethrough removeformat | forecolor backcolor | upload',
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
        <Button onClick={() => { this.setState({ visible: true }); }}>在 Dialog 中</Button>
        <Dialog visible={this.state.visible}>
          <Tinymce
            onKeyup={me.handleKeyUp.bind(me)}
            onChange={me.handleChange.bind(me)}
            content={me.state.content}
            placeholder={'placeholder'}
          />
        </Dialog>
      </div>
    );
  }
}

export default Demo;
