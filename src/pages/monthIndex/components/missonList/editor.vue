<template>
  <div>
    <div ref="editor" style="text-align:left; width: 582px;"></div>
  </div>
</template>

<script>
import Vue from 'vue';
import E from 'wangeditor';
import editorImgZoom from '@/assets/js/editorImgZoom';

export default {
  name: 'editor',
  props: ['editorContent', 'weekIndex', 'editorIndex'],
  data() {
    return {
      editorData: {},
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
      this.editor.customConfig.colors = [
        '#000000',
        '#eeece0',
        '#1c487f',
        '#4d80bf',
        '#c24f4a',
        '#8baa4a',
        '#7b5ba1',
        '#46acc8',
        '#f9963b',
        '#ffffff',
        '#FF0000',
        '#00B51D',
      ];
      this.editor.customConfig.zIndex = 100;
      // this.editor.customConfig.onchangeTimeout = 500;
      this.editor.customConfig.onchange = (html) => {
        Vue.set(this.editorData, 'weekIndex', this.weekIndex);
        Vue.set(this.editorData, 'editorIndex', this.editorIndex);
        Vue.set(this.editorData, 'content', html);
        this.setVuex();
        // this.$emit('setEditorData', { index: this.editorContent.index, content: html });
      };
      this.editor.customConfig.linkImgCallback = function link() {
        editorImgZoom.clickEvent();
      };
      this.editor.create();
      this.editor.$textElem.attr('contenteditable', !this.$store.state.comData.inputDisabled);
    },
    init() {
      Vue.set(this.editorData, 'weekIndex', this.weekIndex);
      Vue.set(this.editorData, 'editorIndex', this.editorIndex);
      Vue.set(this.editorData, 'content', '');
      this.setVuex();
    },
    setVuex() {
      let useMethod = '';
      switch (true) {
        case this.editorData.weekIndex === 1:
          useMethod = 'setFirstWeekData';
          break;
        case this.editorData.weekIndex === 2:
          useMethod = 'setSecondWeekData';
          break;
        case this.editorData.weekIndex === 3:
          useMethod = 'setThirdWeekData';
          break;
        case this.editorData.weekIndex === 4:
          useMethod = 'setFourthWeekData';
          break;
        default:
      }
      this.$store.commit(useMethod, this.editorData);
    },
  },
  watch: {
    editorContent(newVal) {
      this.editor.txt.html(newVal);
      this.editor.change();
      editorImgZoom.clickEvent();// 重新邦定img点击预览放大的事件;否则图片没有点击事件
    },
    // weekIndex() {
    //   console.log('abc');
    //   this.init();
    //   // editorIndex传递的事一个固定的number类型,weekIndex渲染在其后面,监听weekIndex就可以了;
    // },
  },
  mounted() {
    this.editorInit();
    this.init();
  },
};
</script>

<style scoped>
.red{
  color:red;
}
</style>
