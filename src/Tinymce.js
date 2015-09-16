/**
 * Tinymce Component for uxcore
 * Inspired by react-tinymce: https://github.com/mzabriskie/react-tinymce
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let util = require('./util');
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
        this.id = this.id || util.uuid();
    }

    componentDidMount() {
        this._init(this.props.config);
    }

    componentWillUnmount() {
        this._remove();
    }

    componentWillReceiveProps(nextProps) {
      this._init(nextProps.config, nextProps.content);
    }

    _init(config, content) {
        let me = this;
        if (me._isInit) {
            me._remove();
        }
        // hide the textarea until init finished
        React.findDOMNode(me).style.hidden = "hidden";
        config.selector = '#' + me.id;
        if (!config.language) {
            config.language = "zh_CN"
        }
        config.setup = (editor) => {
            EVENTS.forEach((event, index) => {
                let handler = me.props[HANDLER_NAMES[index]];
                if (typeof handler != 'function') return;
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
        }
        tinymce.init(config);
        React.findDOMNode(me).style.hidden = "";
        me._init = true;
    }

    _remove() {
        tinymce.EditorManager.execCommand("mceRemoveEditor", true, this.id);
        this._init = false;
    }

    render() {
        return (
            <textarea id={this.id} defaultValue={this.props.content}></textarea>
        );
    }
}

Tinymce.defaultProps = {
    config: {},
    content: ''
}


// http://facebook.github.io/react/docs/reusable-components.html
Tinymce.propTypes = {
    config: React.PropTypes.object,
    content: React.PropTypes.string,
};

//add handler propTypes
HANDLER_NAMES.forEach((name) => {
    Tinymce.propTypes[name] = React.PropTypes.func;
})

Tinymce.displayName = "Tinymce";

module.exports = Tinymce;