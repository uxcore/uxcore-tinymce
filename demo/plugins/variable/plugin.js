tinymce.PluginManager.add('variable', function (editor, url) {
    var config = editor.settings.variable;
    if (config.items) {
        var menu = [];
        console.log(config);
        for (var i = 0; i < config.items.length; i++) {
            menu.push({
                text: config.items[i].text,
                onclick: (function(index) {
                    return function() {
                        editor.insertContent('<span>&nbsp;</span><span data-id="' + config.items[index].id + '" class="insert_variable mceNonEditable"><strong>${' + config.items[index].text + '}$</strong></span><span>&nbsp;</span>')
                    }
                })(i)
            });
        }
        editor.addButton('variable', {
            type: 'menubutton',
            title: '插入变量',
            image: 'http://gtms01.alicdn.com/tps/i1/TB1b5eNKXXXXXcuXVXXTyVt9VXX-128-128.png',
            menu: menu
        });
    }
})