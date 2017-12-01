/* eslint-disable */
var iframeCount = 0;
var doc = document;

function Uploader(options) {
    if (!(this instanceof Uploader)) {
        return new Uploader(options);
    }
    if (isString(options)) {
        options = {
            trigger: options
        };
    }

    var settings = {
        trigger: null,
        name: null,
        action: null,
        data: null,
        accept: null,
        change: null,
        error: null,
        multiple: true,
        success: null
    };
    if (options) {
        Object.keys(options).forEach(function(key) {
            if (options[key]) {
                settings[key] = options[key];
            }
        });
    }

    if (settings.trigger.nodeType === 1) {
        this.$trigger = settings.trigger;
    } else {
        this.$trigger = doc.getElementById(settings.trigger);
    }
    this.$mce = options.mce;

    settings.action = settings.action || '/upload';
    settings.name = settings.name || 'file';
    this.settings = settings;

    this.setup();
    this.bind();
}

// initialize
// create input, form, iframe
Uploader.prototype.setup = function() {
    this.form = doc.createElement('form');
    this.form.setAttribute('method', 'post');
    this.form.setAttribute('enctype', 'multipart/form-data');
    this.form.setAttribute('action', this.settings.action);

    this.iframe = newIframe();
    this.form.setAttribute('target', this.iframe.getAttribute('name'));

    var data = this.settings.data;
    createInputs(data).forEach(function(input) {
        this.form.appendChild(input);
    }.bind(this));

    createInputs(window.FormData ? {
        '_uploader_': 'formdata'
    } : {
        '_uploader_': 'iframe'
    }).forEach(function(input) {
        this.form.appendChild(input);
    }.bind(this));

    var input = document.createElement('input');
    input.type = 'file';
    input.name = this.settings.name;
    if (this.settings.accept) {
        input.accept = this.settings.accept;
    }
    if (this.settings.multiple) {
        input.multiple = true;
        input.setAttribute('multiple', 'multiple');
    }
    this.input = input;

    var self = this;
    var $trigger = this.$trigger;
    var $mce = this.$mce;

    input.setAttribute('hidefocus', true);
    var height = $trigger.offsetHeight;
    input.style.cssText = 'position: absolute; top: 0; right: 0; opacity: 0; outline: 0; filter:alpha(opacity=0);cursor: pointer; height: ' + height + '; fontSize: ' + Math.max(64, height * 5);
    this.form.appendChild(input);
    _positionForm();
    // doc.body.appendChild(this.form);
    // console.log(this.$trigger.parentNode);
    // this.$trigger.parentNode.appendChild(this.form);
    this.$mce.appendChild(this.form);

    $trigger.addEventListener('mouseenter', function() {
        _positionForm();
    });

    function _positionForm() {
        var formStyle = '';
        var triggerRect = $trigger.getBoundingClientRect();
        var mceRect = $mce.getBoundingClientRect();
        var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        var w = triggerRect.width || $trigger.clientWidth;
        var h = triggerRect.height || $trigger.clientHeight;
        var formCss = {
            position: 'absolute',
            top: (triggerRect.top - mceRect.top) + 'px',
            left: (triggerRect.left - mceRect.left) + 'px',
            overflow: 'hidden',
            width: w + 'px',
            height: h + 'px',
            'z-Index': 110
        };
        Object.keys(formCss).forEach(function(prop) {
            formStyle += [prop, formCss[prop]].join(': ') + ';';
        });
        self.form.style.cssText = formStyle;
    }

    return this;
};

// bind events
Uploader.prototype.bind = function() {
    var self = this;
    // var $trigger = this.$trigger;
    self.bindInput();
};

Uploader.prototype.bindInput = function() {
    var self = this;
    self.input.onchange = function(e) {
        // ie9 don't support FileList Object
        // http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
        var ev = e || window.event;
        var target = ev.target || ev.srcElement;
        self._files = this.files || [{
            name: target.value
        }];
        var file = self.input.value;
        if (self.settings.change) {
            self.settings.change.call(self, self._files);
        } else if (file) {
            return self.submit();
        }
    };
};

// handle submit event
// prepare for submiting form
Uploader.prototype.submit = function() {
    var self = this;
    if (window.FormData && self._files) {
        // build a FormData
        var fd = new FormData(self.form);
        // use FormData to upload
        fd.append(self.settings.name, self._files);

        var xhr = new XMLHttpRequest();
        if (self.settings.progress && xhr.upload) {
            // fix the progress target file
            xhr.upload.addEventListener('progress', function(event) {
                var percent = 0;
                var position = event.loaded || event.position; /*event.position is deprecated*/
                var total = event.total;
                if (event.lengthComputable) {
                    percent = Math.ceil(position / total * 100);
                }
                self.settings.progress(event, position, total, percent, self._files);
            }, false);
        }
        xhr.open('post', self.settings.action);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 201) {
                    self.settings.success && self.settings.success(xhr.responseText);
                } else {
                    self.settings.error && self.settings.error(xhr.statusText);
                }
            }
        };
        xhr.send(fd);
        return this;
    } else {
        // iframe upload
        self.iframe = newIframe();
        self.form.setAttribute('target', self.iframe.getAttribute('name'));
        doc.body.appendChild(self.iframe);
        self.iframe.onload = function() {
            // https://github.com/blueimp/jQuery-File-Upload/blob/9.5.6/js/jquery.iframe-transport.js#L102
            // Fix for IE endless progress bar activity bug
            // (happens on form submits to iframe targets):
            var _iframe = doc.createElement('iframe');
            _iframe.setAttribute('src', 'javascript:false');
            self.form.appendChild(_iframe);
            self.form.removeChild(_iframe);
            //   $('<iframe src="javascript:false;"></iframe>')
            //     .appendTo(self.form)
            //     .remove();
            var response;
            try {
                response = this.contentDocument.body.innerHTML;
            } catch (e) {
                response = "cross-domain";
            }
            doc.body.removeChild(this);
            if (!response) {
                if (self.settings.error) {
                    self.settings.error(self.input.value);
                }
            } else {
                if (self.settings.success) {
                    self.settings.success(response);
                }
            }
        };
        self.form.submit();
    }
    return this;
};

Uploader.prototype.refreshInput = function() {
    //replace the input element, or the same file can not to be uploaded
    var newInput = this.input.cloneNode();
    newInput.value = null;
    var parentNode = this.input.parentNode;
    parentNode.insertBefore(newInput, this.input);
    this.input.onchange = null;
    parentNode.removeChild(this.input);
    this.input = newInput;
    this.bindInput();
};

// handle change event
// when value in file input changed
Uploader.prototype.change = function(callback) {
    if (!callback) {
        return this;
    }
    this.settings.change = callback;
    return this;
};

// handle when upload success
Uploader.prototype.success = function(callback) {
    var me = this;
    this.settings.success = function(response) {
        me.refreshInput();
        if (callback) {
            callback(response);
        }
    };

    return this;
};

// handle when upload success
Uploader.prototype.error = function(callback) {
    var me = this;
    this.settings.error = function(response) {
        if (callback) {
            me.refreshInput();
            callback(response);
        }
    };
    return this;
};

// enable
Uploader.prototype.enable = function() {
    this.input.removeAttribute('disabled');
    this.input.style.cursor = 'pointer';
};

// disable
Uploader.prototype.disable = function() {
    this.input.prop('disabled', 'disabled');
    this.input.style.cursor = 'not-allowed';
};

// Helpers
// -------------

function isString(val) {
    return Object.prototype.toString.call(val) === '[object String]';
}

function createInputs(data) {
    if (!data) return [];

    var inputs = [],
        i;
    for (var name in data) {
        i = doc.createElement('input');
        i.type = 'hidden';
        i.name = name;
        i.value = data[name];
        inputs.push(i);
    }
    return inputs;
}

function newIframe() {
    var iframeName = 'iframe-uploader-' + iframeCount;
    var iframe = doc.createElement('iframe');
    iframe.setAttribute('name', iframeName);
    iframe.style.display = 'none';
    iframeCount += 1;
    return iframe;
}

/**
 * Created by Samoay on 11/30/14.
 * 本地文件上传
 */
tinymce.PluginManager.add('upload', function(editor) {
    var uploadConfig = editor.settings.uploadConfig;

    function getImageSize(url, callback) {
        var img = document.createElement('img');

        function done(width, height) {
            img.parentNode.removeChild(img);
            callback({
                width: width,
                height: height
            });
        }

        img.onload = function() {
            done(img.clientWidth, img.clientHeight);
        };

        img.onerror = function() {
            done();
        };

        img.src = url;

        var style = img.style;
        style.visibility = 'hidden';
        style.position = 'fixed';
        style.bottom = style.left = 0;
        style.width = style.height = 'auto';

        document.body.appendChild(img);
    }

    function showDialog(sourceImage) {
        var win, data, dom = editor.dom,
            imgElm = editor.selection.getNode();
        var width, height;

        function recalcSize(e) {
            var widthCtrl, heightCtrl, newWidth, newHeight;

            widthCtrl = win.find('#width')[0];
            heightCtrl = win.find('#height')[0];

            newWidth = widthCtrl.value();
            newHeight = heightCtrl.value();

            if (win.find('#constrain')[0].checked() && width && height && newWidth && newHeight) {
                if (e.control == widthCtrl) {
                    newHeight = Math.round((newWidth / width) * newHeight);
                    heightCtrl.value(newHeight);
                } else {
                    newWidth = Math.round((newHeight / height) * newWidth);
                    widthCtrl.value(newWidth);
                }
            }

            width = newWidth;
            height = newHeight;
        }

        function onSubmitForm() {
            function waitLoad(imgElm) {
                function selectImage() {
                    imgElm.onload = imgElm.onerror = null;
                    //editor.selection.select(imgElm);
                    editor.nodeChanged();
                }

                imgElm.onload = function() {
                    if (!data.width && !data.height) {
                        dom.setAttribs(imgElm, {
                            width: imgElm.clientWidth,
                            height: imgElm.clientHeight
                        });
                    }

                    selectImage();
                };

                imgElm.onerror = selectImage;
            }

            var data = win.toJSON();

            if (data.width === '') {
                data.width = null;
            }

            if (data.height === '') {
                data.height = null;
            }

            if (data.style === '') {
                data.style = null;
            }

            data = {
                src: data.src,
                alt: data.alt,
                width: data.width,
                height: data.height,
                style: data.style
            };

            editor.undoManager.transact(function() {
                if (!data.src) {
                    if (imgElm) {
                        dom.remove(imgElm);
                        editor.nodeChanged();
                    }

                    return;
                }

                if (!imgElm) {
                    data.id = '__mcenew';
                    editor.selection.setContent(dom.createHTML('img', data));
                    imgElm = dom.get('__mcenew');
                    dom.setAttrib(imgElm, 'id', null);
                } else {
                    dom.setAttribs(imgElm, data);
                }

                waitLoad(imgElm);
            });
        }

        function updateSize() {
            getImageSize(this.value(), function(data) {
                if (data.width && data.height) {
                    width = data.width;
                    height = data.height;

                    win.find('#width').value(width);
                    win.find('#height').value(height);
                }
            });
        }

        width = dom.getAttrib(imgElm, 'width');
        height = dom.getAttrib(imgElm, 'height');

        if (imgElm.nodeName == 'IMG' && !imgElm.getAttribute('data-mce-object')) {
            data = {
                src: dom.getAttrib(imgElm, 'src'),
                alt: dom.getAttrib(imgElm, 'alt'),
                width: width,
                height: height
            };
        } else {
            imgElm = null;
        }

        // General settings shared between simple and advanced dialogs
        var generalFormItems = [{
            name: 'src',
            type: 'textbox',
            filetype: 'image',
            label: '图片路径',
            autofocus: true,
            onchange: updateSize
        }, {
            name: 'alt',
            type: 'textbox',
            label: '图片描述'
        }, {
            type: 'container',
            label: '图片尺寸',
            layout: 'flex',
            direction: 'row',
            align: 'center',
            spacing: 5,
            items: [{
                name: 'width',
                type: 'textbox',
                maxLength: 4,
                size: 4,
                onchange: recalcSize
            }, {
                type: 'label',
                text: 'x'
            }, {
                name: 'height',
                type: 'textbox',
                maxLength: 4,
                size: 4,
                onchange: recalcSize
            }, {
                name: 'constrain',
                type: 'checkbox',
                checked: true,
                text: '强制等比例'
            }]
        }];

        // Simple default dialog
        win = editor.windowManager.open({
            title: '编辑图片',
            width: 400,
            height: 150,
            data: data,
            body: generalFormItems,
            onSubmit: onSubmitForm
        });

        win.find('#src').value(sourceImage.value);
        win.find('#alt').value(sourceImage.title);
        updateSize.call(win.find('#src'))
    }

    function isFunction(obj) {
        return Object.prototype.toString.call(obj) == '[object Function]';
    }

    function isString(obj) {
        return Object.prototype.toString.call(obj) == '[object String]';
    }

    editor.addButton('upload', {
        icon: 'image',
        tooltip: '上传图片',
        classes: "widget ext-btn ext-btn-small uploader-picture",
        onPostRender: function() {
            var self = this;
            setTimeout(function() {
                var parents = self.parents();
                var mce = parents[parents.length - 1].getEl();
                var uploader;
                if (!uploader) {
                    uploader = new Uploader({
                        trigger: self.getEl(),
                        mce: mce,
                        name: uploadConfig.inputName || 'file',
                        action: uploadConfig.actionUrl,
                        data: {
                            'xsrf': 'hash'
                        },
                        multiple: uploadConfig.multiple || false,
                        progress: function(event, position, total, percent, files) {
                            if (uploadConfig.progressCallback && isFunction(uploadConfig.progressCallback)) {
                                uploadConfig.progressCallback.apply(uploader, Array.prototype.slice.call(arguments));
                            }
                        }
                    });

                    // 使用success实例方法传入成功回调，否则refreshInput方法将得不到调用 by jinhong@20161205
                    uploader.success(function(response) {
                        var result;
                        if (isString(response)) {
                            try {
                                result = JSON.parse(response);
                            } catch (e) {
                                result = {
                                    hasError: true
                                };
                            }
                        } else {
                            result = response;
                        }
                        if (uploadConfig.formatResult && isFunction(uploadConfig.formatResult)) {
                            result = uploadConfig.formatResult.call(null, result);
                        }
                        if (!result.hasError) {
                            showDialog({
                                title: result.content.name,
                                value: result.content.downloarUrl
                            });
                        } else {
                            alert('文件上传失败');
                        }
                    });

                    // 使用error实例方法传入成功回调，否则refreshInput方法将得不到调用 by jinhong@20161205
                    uploader.error(function() {
                        if (uploadConfig.errorCallback && isFunction(uploadConfig.errorCallback)) {
                            uploadConfig.errorCallback.apply(uploader, Array.prototype.slice.call(arguments));
                        } else {
                            alert('文件上传失败');
                        }
                    });
                }
            }, 1000);
        }
    });
});