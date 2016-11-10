const plugins = [
  'advlist autolink lists link image charmap print preview anchor',
  'searchreplace visualblocks code fullscreen',
  'insertdatetime media table contextmenu paste code',
  'colorpicker',
  'upload',
  'placeholder',
  'variable',
  'noneditable',
];

const fonts = [
  '黑体=andale mono,times;',
  '宋体=SimSun;',
  '新宋体=NSimSun;',
  '仿宋=FangSong;',
  '楷体=KaiTi;',
  '微软雅黑=Microsoft YaHei;',
  '隶书=LiSu;',
  '幼圆=YouYuan;',
  '华文细黑=STXihei;',
  '华文楷体=STKaiti;',
  '华文宋体=STSong;',
  '华文中宋=STZhongsong;',
  '华文仿宋=STFangsong;',
  'Andale Mono=andale mono,times;',
  'Arial=arial,helvetica,sans-serif;',
  'Arial Black=arial black,avant garde;',
  'Book Antiqua=book_antiquaregular,palatino;',
  'Corda Light=CordaLight,sans-serif;',
  'Courier New=courier_newregular,courier;',
  'Flexo Caps=FlexoCapsDEMORegular;',
  'Lucida Console=lucida_consoleregular,courier;',
  'Georgia=georgia,palatino;',
  'Helvetica=helvetica;',
  'Impact=impactregular,chicago;',
  'Museo Slab=MuseoSlab500Regular,sans-serif;',
  'Museo Sans=MuseoSans500Regular,sans-serif;',
  'Oblik Bold=OblikBoldRegular;',
  'Sofia Pro Light=SofiaProLightRegular;',
  'Symbol=webfontregular;',
  'Tahoma=tahoma,arial,helvetica,sans-serif;',
  'Terminal=terminal,monaco;',
  'Tikal Sans Medium=TikalSansMediumMedium;',
  'Times New Roman=times new roman,times;',
  'Trebuchet MS=trebuchet ms,geneva;',
  'Verdana=verdana,geneva;',
  'Webdings=webdings;',
  'Wingdings=wingdings,zapf dingbats',
  'Aclonica=Aclonica, sans-serif;',
  'Michroma=Michroma;',
  'Paytone One=Paytone One, sans-serif;',
  'Andalus=andalusregular, sans-serif;',
  'Arabic Style=b_arabic_styleregular, sans-serif;',
  'Andalus=andalusregular, sans-serif;',
  'KACST_1=kacstoneregular, sans-serif;',
  'Mothanna=mothannaregular, sans-serif;',
  'Nastaliq=irannastaliqregular, sans-serif;',
  'Samman=sammanregular;',
];

export default {
  theme: 'modern',
  height: 400,
  font_formats: fonts.join(''),
  external_plugins: {
    emoticons: '//g.alicdn.com/uxcore/uxcore-lib/tinymce/4.2.5/plugins/emoticons/plugin.min.js',
    upload: '//g.alicdn.com/uxcore/uxcore-lib/tinymce/4.2.5/plugins/upload/plugin.min.js',
    textcolor: '//g.alicdn.com/uxcore/uxcore-lib/tinymce/4.2.5/plugins/textcolor/plugin.min.js',
    hr: '//g.alicdn.com/uxcore/uxcore-lib/tinymce/4.2.5/plugins/hr/plugin.min.js',
    placeholder: '//g.alicdn.com/uxcore/uxcore-lib/tinymce/4.2.5/plugins/placeholder/plugin.min.js',
    variable: '//g.alicdn.com/uxcore/uxcore-lib/tinymce/4.2.5/plugins/variable/plugin.min.js',
  },
  resize: true, // 是否可以鼠标拖动编辑器改变大小
  border_width: 1, // 编辑器的边框宽度
  convert_urls: false, // 当你insertContent的时候，取消一些节点src的转换
  visual: true, // table的虚框是否显示，由于大文本设置虚框很耗性能，所以取消掉
  keep_values: false, // 必须设置false用来提高性能
  forced_root_block: 'div', // 当空文本的时候，tinymce会设置一个根节点，默认是P，我们要改成div比较合理
  show_system_default_font: true, // 是否开启系统字体的探测。
  link_title: true, // link plugins enable title edit
  plugins,
  content_css: [
    '//g.alicdn.com/platform/c/tinymce/4.3.12/custom_content.css',
  ],
  toolbar1: 'preview undo redo | fontselect fontsizeselect | bold italic underline strikethrough removeformat | forecolor backcolor | link | emoticons upload',
  toolbar2: 'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table hr inserttime',
  uploadConfig: {
    inputName: 'imageUploadInput',
    actionUrl: 'http://test.alibaba-inc.com/work/xservice/http/uploadimage.json',
    errorCallback(...rest) {
      console.log('errorCallback', rest);
    },
    progressCallback(...rest) {
      console.log('progressCallback', rest);
    },
  },
  wordcount_countregex: /[^\x00-\xff]+/g,
};
