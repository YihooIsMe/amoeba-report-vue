<template>
  <div>
    <div ref="editor" style="text-align:left"></div>
  </div>
</template>

<script>
import E from 'wangeditor';

export default {
  name: 'editor',
  data() {
    return {
      editorContent: '',
    };
  },
  methods: {
    getContent: function () {
      alert(this.editorContent);
    },
  },
  mounted() {
    const editor = new E(this.$refs.editor);
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.showLinkImg = false;
    editor.customConfig.menus = [
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
    editor.customConfig.onchange = (html) => {
      this.editorContent = html;
    };
    editor.create();
  },
};
</script>

<style scoped>

</style>
