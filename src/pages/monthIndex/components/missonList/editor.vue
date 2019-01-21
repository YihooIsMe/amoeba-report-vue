<template>
  <div>
    <div ref="editor" style="text-align:left"></div>
  </div>
</template>

<script>
import E from 'wangeditor';
import editorImgZoom from '@/assets/js/editorImgZoom.js';

export default {
  name: 'editor',
  props: ['editorContent'],
  data() {
    return {
      editorData: '',
    };
  },
  methods: {
    editorInit() {
      this.editor = new E(this.$refs.editor);
      this.editor.customConfig.uploadImgShowBase64 = true;
      this.editor.customConfig.showLinkImg = false;
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'image', // 插入图片
        'undo', // 撤销
        'redo', // 重复
      ];
      this.editor.customConfig.onchange = (html) => {
        this.editorData = html;
        this.$emit('setEditorData', { index: this.editorContent.index, content: html });
      };
      this.editor.customConfig.linkImgCallback = function (url) {
        console.log(url); // url 即插入图片的地址
        editorImgZoom.clickEvent();
      };
      this.editor.create();
    },
  },

  watch: {
    'editorContent.content': function(newVal) {
      console.log(newVal);
      this.editor.txt.html(newVal);
    },
  },
  mounted() {
    this.editorInit();
  },
};
</script>

<style scoped>

</style>
