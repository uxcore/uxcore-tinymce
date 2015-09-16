---

## uxcore-tinymce [![Dependency Status](http://img.shields.io/david/uxcore/uxcore-tinymce.svg?style=flat-square)](https://david-dm.org/uxcore/uxcore-tinymce) [![devDependency Status](http://img.shields.io/david/dev/uxcore/uxcore-tinymce.svg?style=flat-square)](https://david-dm.org/uxcore/uxcore-tinymce#info=devDependencies) 

## TL;DR

uxcore-tinymce ui component for react, inspired by react-tinymce

#### setup develop environment

```sh
$ git clone https://github.com/uxcore/uxcore-tinymce
$ cd uxcore-tinymce
$ npm install
$ gulp server
```

## Usage

### demo
http://uxcore.github.io/uxcore/components/uxcore-tinymce/

### API

### props

| 配置项 | 类型 | 必填 | 默认值 | 功能/备注 |
|---|---|---|---|---|
|config|object|optional|{}|tinyMCE 的配置项，官方文档中所有 init 部分的配置在这里完成|
|content|string|optional|""|输入框中的默认值|
|onXXX|function|optional|-|tinyMCE 所有在 setup 中绑定的事件可以使用此属性来完成。如 onChange、onKeyup 等，会传入两个参数：e 和 editor 实例。|

### Events 包括

```javascript
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
```
> 事件的具体含义和触发机制参考：`https://github.com/tinymce/tinymce/blob/master/tools/docs/tinymce.Editor.js#L5-L12`

### FAQ

* Q1: 如何能够准确地监听输入框的变化？
  A1: 建议同时监听 onChange 和 onKeyup 事件，更复杂的讨论见：https://github.com/uxcore/uxcore-tinymce/issues/1