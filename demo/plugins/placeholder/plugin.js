tinymce.PluginManager.add('placeholder', function(editor) {
    editor.on('init', function() {
        var label = new Label;
        
        onBlur();

        tinymce.DOM.bind(label.el, 'click', onFocus);
        editor.on('focus', onFocus);
        editor.on('blur', onBlur);
        editor.on('change', onBlur);
        editor.on('keyup', onBlur);

        function onFocus(){
            label.hide();
            tinyMCE.execCommand('mceFocus', false, editor);
        }

        function onBlur(){
            var emptyContent = '<div>&nbsp;</div>';
            if(editor.getContent() == emptyContent) {
                label.show();
            }else{
                label.hide();
            }
        }
    });

    var Label = function(){
        // Create label el
        this.text = editor.getElement().getAttribute("placeholder");
        this.contentAreaContainer = editor.getContentAreaContainer();

        tinymce.DOM.setStyle(this.contentAreaContainer, 'position', 'relative');

        attrs = {id: 'tinymce-placeholder', style: {position: 'absolute', top:'7px', left:0, color: '#888', paddingLeft: '9px', width:'98%', overflow: 'hidden'} };
        var labelEl = tinymce.DOM.$.find('#tinymce-placeholder');
        this.el = labelEl.length ? labelEl[0] : tinymce.DOM.add( this.contentAreaContainer, "label", attrs, this.text );
    }

    Label.prototype.hide = function(){
        tinymce.DOM.setStyle( this.el, 'display', 'none' );
    }

    Label.prototype.show = function(){
        tinymce.DOM.setStyle( this.el, 'display', '' );   
    }
});