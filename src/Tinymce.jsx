/**
 * Tinymce Component for uxcore
 * Inspired by react-tinymce: https://github.com/mzabriskie/react-tinymce
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const assign = require('object-assign');

const util = require('./util');
const EditorConfig = require('./editorConfig');
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

  componentWillMount() {
    if (typeof window.tinymce !== 'object') {
      console.warn('TinyMCE is not found in global, init failed');
    }
    this.id = this.id || util.uuid();
  }

  componentDidMount() {
    this.init(this.props.config);
  }


  componentWillReceiveProps(nextProps) {
    if (!util.isEqual(nextProps.config, this.props.config)) {
      this.init(nextProps.config, nextProps.content);
    }
    if (nextProps.content !== this.props.content && window.tinymce) {
      if (this.isInited) {
        // this.resetValue(nextProps.content);
      } else {
        this.contentToBeSet = nextProps.content;
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      !util.isEqual(this.props.content, nextProps.content) ||
      !util.isEqual(this.props.config, nextProps.config)
    );
  }

  componentWillUnmount() {
    this.remove();
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
      const editor = window.tinymce.get(me.id);
      editor.setContent(value);
      editor.selection.select(editor.getBody(), true);
      editor.selection.collapse(false);
    }, me.props.changeDelay);
  }

  init(config, content) {
    const me = this;
    if (me.isInited) {
      me.remove();
    }
    // hide the textarea until init finished
    me.root.style.visibility = 'hidden';
    const trueConfig = assign({}, EditorConfig, config);
    trueConfig.selector = `#${me.id}`;
    if (!trueConfig.language) {
      trueConfig.language = 'zh_CN';
    }
    trueConfig.setup = (editor) => {
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
    window.tinymce.baseURL = '//g.alicdn.com/platform/c/tinymce/4.3.12';
    window.tinymce.init(trueConfig);
    me.root.style.visibility = '';
  }

  remove() {
    window.tinymce.EditorManager.execCommand('mceRemoveEditor', true, this.id);
    this.isInited = false;
  }

  render() {
    return (
      <textarea ref={this.saveRef('root')} id={this.id} defaultValue={this.props.content} placeholder={this.props.placeholder} />
    );
  }
}

Tinymce.defaultProps = {
  config: {},
  changeDelay: 500,
};


// http://facebook.github.io/react/docs/reusable-components.html
Tinymce.propTypes = {
  config: React.PropTypes.object,
  placeholder: React.PropTypes.string,
  content: React.PropTypes.string,
  changeDelay: React.PropTypes.number,
};

// add handler propTypes
HANDLER_NAMES.forEach((name) => {
  Tinymce.propTypes[name] = React.PropTypes.func;
});

Tinymce.displayName = 'Tinymce';

module.exports = Tinymce;
