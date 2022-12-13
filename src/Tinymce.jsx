/**
 * Tinymce Component for uxcore
 * Inspired by react-tinymce: https://github.com/mzabriskie/react-tinymce
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import assign from 'object-assign';
import PropTypes from 'prop-types';
import util from './util';
import EditorConfig from './editorConfig';


// Include all of the Native DOM and custom events from:
// https://github.com/tinymce/tinymce/blob/master/tools/docs/tinymce.Editor.js#L5-L12
const EVENTS = [
  'focusin', 'focusout', 'click', 'dblclick', 'mousedown', 'mouseup',
  'mousemove', 'mouseover', 'beforepaste', 'paste', 'cut', 'copy',
  'selectionchange', 'mouseout', 'mouseenter', 'mouseleave', 'keydown',
  'keypress', 'keyup', 'contextmenu', 'dragend', 'dragover', 'draggesture',
  'dragdrop', 'drop', 'drag', 'BeforeRenderUI', 'SetAttrib', 'PreInit',
  'PostRender', 'init', 'deactivate', 'activate', 'NodeChange',
  'BeforeExecCommand', 'ExecCommand', 'show', 'hide', 'ProgressState',
  'LoadContent', 'SaveContent', 'BeforeSetContent', 'SetContent',
  'BeforeGetContent', 'GetContent', 'VisualAid', 'remove', 'submit', 'reset',
  'BeforeAddUndo', 'AddUndo', 'change', 'undo', 'redo', 'ClearUndos',
  'ObjectSelected', 'ObjectResizeStart', 'ObjectResized', 'PreProcess',
  'PostProcess', 'focus', 'blur',
];

// Note: because the capitalization of the events is weird, we're going to get
// some inconsistently-named handlers, for example compare:
// 'onMouseleave' and 'onNodeChange'
const HANDLER_NAMES = EVENTS.map(event => `on${util.uc_first(event)}`);


class Tinymce extends React.Component {
  constructor(props) {
    super(props);
    if (typeof window.tinymce !== 'object') {
      console.warn('TinyMCE is not found in global, init failed');
    }
    this.id = this.id || util.uuid();
  }

  componentDidMount() {
    // 延迟初始化的过程，防止初始化后立刻被卸载导致的卸载失败问题
    this.initTimer = setTimeout(() => {
      this.init(this.props.config);
    }, 200);
    console.log(`uxcore tinymce mount, id is ${this.id}`);
  }

  shouldComponentUpdate(nextProps) {
    return (
      !util.isEqual(this.props.content, nextProps.content) ||
      !util.isEqual(this.props.config, nextProps.config)
    );
  }


  componentDidUpdate(prevProps) {
    const { config, content } = this.props;
    if (prevProps.content !== content && window.tinymce) {
      if (this.isInited) {
        const editor = window.tinymce.get(this.id);
        const currentContent = editor.getContent();
        if (content !== currentContent) {
          this.setTinymceContent(content); // 调用后会打断中文输入
        }
      } else {
        this.contentToBeSet = content;
      }
    }
    if (!util.isEqual(config, prevProps.config)) {
      this.init(config, content);
    }
  }

  componentWillUnmount() {
    this.remove();
    console.log(`uxcore tinymce unmount, id is ${this.id}`);
  }


  setTinymceContent(value) {
    const me = this;
    const editor = window.tinymce.get(me.id);
    editor.setContent(value);
    editor.selection.select(editor.getBody(), true);
    editor.selection.collapse(false);
  }

  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
    };
  }

  resetValue(value) {
    const me = this;
    if (this.setValueTimer) {
      clearTimeout(this.setValueTimer);
    }
    this.setValueTimer = setTimeout(() => {
      if (me.isInited) {
        me.setTinymceContent(value);
      } else {
        me.contentToBeSet = value;
      }
    }, me.props.changeDelay);
  }

  init(config, content) {
    const me = this;
    if (me.isInited) {
      me.remove();
    }
    // hide the textarea until init finished
    me.root.style.visibility = 'hidden';

    let external_plugins = {
      ...EditorConfig.external_plugins,
      ...(config.external_plugins || {})
    };
    let uploadConfig = {
      ...EditorConfig.uploadConfig,
      ...(config.uploadConfig || {})
    };
    const trueConfig = assign({}, EditorConfig, config, {external_plugins, uploadConfig});
    trueConfig.selector = `#${me.id}`;
    if (!trueConfig.language) {
      trueConfig.language = 'zh_CN';
    }
    trueConfig.setup = (editor) => {
      this.editor = editor;
      EVENTS.forEach((event, index) => {
        const handler = me.props[HANDLER_NAMES[index]];
        if (typeof handler !== 'function') return;
        editor.on(event, (e) => {
          // native DOM events don't have access to the editor so we pass it here
          handler(e, editor);
        });
      });
      // need to set content here because the textarea will still have the
      // old `this.props.content`
      editor.on('init', () => {
        me.isInited = true;
        if (me.contentToBeSet) {
          editor.setContent(me.contentToBeSet);
        } else if (content) {
          editor.setContent(content);
        }
      });
    };
    window.tinymce.baseURL = 'https://g.alicdn.com/platform/c/tinymce/4.3.12';
    window.tinymce.init(trueConfig);
    me.root.style.visibility = '';
  }

  remove() {
    if (this.initTimer) {
      clearTimeout(this.initTimer);
      this.initTimer = undefined;
    }
    if (window.tinymce) {
      window.tinymce.EditorManager.execCommand('mceRemoveEditor', true, this.id);
    }
    this.isInited = false;
  }

  render() {
    return (
      <textarea
        ref={this.saveRef('root')}
        id={this.id} defaultValue={this.props.content}
        placeholder={this.props.placeholder}
      />
    );
  }
}

Tinymce.defaultProps = {
  config: {},
  changeDelay: 500,
};


// http://facebook.github.io/react/docs/reusable-components.html
Tinymce.propTypes = {
  config: PropTypes.object,
  placeholder: PropTypes.string,
  content: PropTypes.string,
  changeDelay: PropTypes.number,// eslint-disable-line
};

// add handler propTypes
HANDLER_NAMES.forEach((name) => {
  Tinymce.propTypes[name] = PropTypes.func;
});

Tinymce.displayName = 'Tinymce';

export default Tinymce;
