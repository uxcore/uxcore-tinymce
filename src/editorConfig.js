let plugins = [
	'lists',
	'hr',
	'emoticons',
	'textcolor',
	'insertdatetime',
	'link',
	'table',
	'paste',
	'preview',
	'wordcount',
	'image',
	'upload'
];

export default {
	theme: 'modern',
    height: 400,
    resize: true, // 是否可以鼠标拖动编辑器改变大小
    border_width: 1, // 编辑器的边框宽度
    convert_urls: false, // 当你insertContent的时候，取消一些节点src的转换
    visual: false, // table的虚框是否显示，由于大文本设置虚框很耗性能，所以取消掉
    keep_values: false, // 必须设置false用来提高性能
    forced_root_block: 'div', // 当空文本的时候，tinymce会设置一个根节点，默认是P，我们要改成div比较合理
    show_system_default_font: true, // 是否开启系统字体的探测。
    link_title: true, // link plugins enable title edit
    plugins: plugins,
    cssFiles: [ 'styles/skin.css', 'styles/skin-ext.css' ],
    toolbar1: 'preview undo redo | fontselect fontsizeselect | bold italic underline strikethrough removeformat | forecolor backcolor | link | emoticons upload',
    toolbar2: 'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table hr inserttime',
	uploadConfig: {
	    "inputName": "imageUploadInput",
	    "actionUrl": "http://test.alibaba-inc.com/work/xservice/http/uploadimage.json",
	    "errorCallback": function(){
	        console.log('errorCallback', arguments);
	    },
	    "progressCallback": function(){
	        console.log('progressCallback', arguments);
	    }
	}
};
