var iframeCount = 0;
var doc = document;

function Uploader(options) {
	if (!(this instanceof Uploader)) {
		return new Uploader(options);
	}
	if (isString(options)) {
		options = {trigger: options};
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
		Object.keys(options).forEach(function(key){
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
	createInputs(data).forEach(function(input){
		this.form.appendChild(input);
	}.bind(this));

	createInputs(window.FormData ? {'_uploader_': 'formdata'}: {'_uploader_': 'iframe'}).forEach(function(input){
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

	var $trigger = this.$trigger;
	console.log($trigger)
	input.setAttribute('hidefocus', true);
	var height = $trigger.offsetHeight;
	input.style.cssText = 'position: absolute; top: 0; right: 0; opacity: 0; outline: 0; cursor: pointer; height: ' + height + '; fontSize: ' + Math.max(64, height * 5);
	this.form.appendChild(input);
	var formStyle = '';
	var triggerRect = $trigger.getBoundingClientRect();
	var formCss = {
		position: 'absolute',
		top: triggerRect.top + 'px',
		left: triggerRect.left + 'px',
		overflow: 'hidden',
		width: triggerRect.width + 'px',
		height: triggerRect.height + 'px',
		zIndex: 110
	};
	Object.keys(formCss).forEach(function(prop){
		formStyle += [prop, formCss[prop]].join(': ') + ';';
	});
	this.form.style.cssText = formStyle;
	doc.body.appendChild(this.form);
  	return this;
};

// bind events
Uploader.prototype.bind = function() {
	var self = this;
	var $trigger = this.$trigger;
	$trigger.onmouseenter = function() {
		self.form.style.top = $trigger.offsetTop;
		self.form.style.left = $trigger.offsetLeft;
		self.form.style.width = $trigger.offsetWidth;
		self.form.style.height = $trigger.offsetHeight;
	};
	self.bindInput();
};

Uploader.prototype.bindInput = function() {
	var self = this;
	self.input.onchange = function(e) {
		// ie9 don't support FileList Object
		// http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
		self._files = this.files || [{
			name: e.target.value
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
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && xhr.status == 200) {
				self.settings.success && self.settings.success(xhr.statusText);
			} else {
				self.settings.error && self.settings.error(xhr.statusText);
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
Uploader.prototype.enable = function(){
	this.input.removeAttribute('disabled');
	this.input.style.cursor = 'pointer';
};

// disable
Uploader.prototype.disable = function(){
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

  var inputs = [], i;
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
