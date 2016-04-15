/**
 * Tinymce Component for uxcore
 * Inspired by react-tinymce: https://github.com/mzabriskie/react-tinymce
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let React = require('react'); 
let ReactDOM = require('react-dom');
let util = require('./util');
let EditorConfig = require('./editorConfig');
let assign = require('object-assign');
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
  'PostProcess', 'focus', 'blur'
];

// Note: because the capitalization of the events is weird, we're going to get
// some inconsistently-named handlers, for example compare:
// 'onMouseleave' and 'onNodeChange'
var HANDLER_NAMES = EVENTS.map(function(event) {
  return 'on' + util.uc_first(event);
});


class Tinymce extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (typeof tinymce !== 'object') {
            console.warn("TinyMCE is not found in global, init failed");
        }
        this.id = this.id || util.uuid();
    }

    componentDidMount() {
        this._init(this.props.config);
    }

    componentWillUnmount() {
        this._remove();
    }

    componentWillReceiveProps(nextProps) {
        if (!util.isEqual(nextProps.config, this.props.config)) {
            this._init(nextProps.config, nextProps.content);
        }
    }

    shouldComponentUpdate(nextProps) {
        return (
            !util.isEqual(this.props.content, nextProps.content) ||
            !util.isEqual(this.props.config, nextProps.config)
        );
    }

    resetValue(value) {
        tinymce.get(this.id).setContent(value)
    }

    _init(config, content) {
        let me = this;
        if (me._isInit) {
            me._remove();
        }
        // hide the textarea until init finished
        ReactDOM.findDOMNode(me).style.visibility = 'hidden';
        config.selector = '#' + me.id;
        config = assign({}, EditorConfig, config);
        if (!config.language) {
            config.language = 'zh_CN';
        }
        config.setup = (editor) => {
            EVENTS.forEach((event, index) => {
                let handler = me.props[HANDLER_NAMES[index]];
                if (typeof handler !== 'function') return;
                editor.on(event, (e) => {
                    // native DOM events don't have access to the editor so we pass it here
                    handler(e, editor);
                });
            });
            // need to set content here because the textarea will still have the
            // old `this.props.content`
            if (content) {
                editor.on('init', () => {
                    editor.setContent(content);
                });
            }
        };
        tinymce.baseURL = '//g.alicdn.com/uxcore/uxcore-lib/tinymce/4.2.5/'
        tinymce.init(config);
        ReactDOM.findDOMNode(me).style.visibility = "";
        me._isInit = true;
    }

    _remove() {
        tinymce.EditorManager.execCommand("mceRemoveEditor", true, this.id);
        this._isInit = false;
    }

    render() {
        return (
            <textarea id={this.id} defaultValue={this.props.content} placeholder={this.props.placeholder}></textarea>
        );
    }
}

Tinymce.defaultProps = {
    config: {}
};


// http://facebook.github.io/react/docs/reusable-components.html
Tinymce.propTypes = {
    config: React.PropTypes.object,
    content: React.PropTypes.string
};

//add handler propTypes
HANDLER_NAMES.forEach((name) => {
    Tinymce.propTypes[name] = React.PropTypes.func;
});

Tinymce.displayName = "Tinymce";

module.exports = Tinymce;
