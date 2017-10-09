tinymce.PluginManager.add('placeholder', (editor) => {
  const Label = function () {
        // Create label el
    this.text = editor.getElement().getAttribute('placeholder');
    this.contentAreaContainer = editor.getContentAreaContainer();

    tinymce.DOM.setStyle(this.contentAreaContainer, 'position', 'relative');

    this.id = `tinymce-placeholder-${editor.id}`;

    const attrs = {
      id: this.id,
      style: {
        position: 'absolute',
        top: '7px',
        left: 0,
        color: '#888',
        paddingLeft: '9px',
        width: '98%',
        overflow: 'hidden',
      },
    };
    const labelEl = tinymce.DOM.$.find(`# ${this.id}`);
    this.el = labelEl.length ?
     labelEl[0] :
     tinymce.DOM.add(this.contentAreaContainer, 'label', attrs, this.text);
  };

  Label.prototype.hide = function () {
    tinymce.DOM.setStyle(this.el, 'display', 'none');
  };

  Label.prototype.show = function () {
    tinymce.DOM.setStyle(this.el, 'display', '');
  };

  editor.on('init', () => {
    const label = new Label;

    function onFocus() {
      label.hide();
      editor.focus();
    }

    function onBlur() {
      const emptyContent = '<div>&nbsp;</div>';
      if (editor.getContent() === emptyContent) {
        label.show();
      } else {
        label.hide();
      }
    }

    onBlur();

    tinymce.DOM.bind(label.el, 'click', onFocus);
    editor.on('focus', onFocus);
    editor.on('blur', onBlur);
    editor.on('change', onBlur);
    editor.on('keyup', onBlur);
    editor.on('setContent', onBlur);
  });
});
