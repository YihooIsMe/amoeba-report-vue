<template>
    <div class="textarea">
      <textarea v-model="message" :readonly="readonly"></textarea>
    </div>
</template>

<script>
export default {
  name: 'scheduleTextarea',
  props: ['editorContent', 'weekIndex', 'editorIndex'],
  data() {
    return {
      message: '',
    };
  },
  methods: {
    setVuex(val) {
      let useMethod = '';
      switch (true) {
        case this.weekIndex === 1:
          useMethod = 'setFirstWeekData';
          break;
        case this.weekIndex === 2:
          useMethod = 'setSecondWeekData';
          break;
        case this.weekIndex === 3:
          useMethod = 'setThirdWeekData';
          break;
        case this.weekIndex === 4:
          useMethod = 'setFourthWeekData';
          break;
        default:
      }
      this.$store.commit(useMethod, { content: val, editorIndex: this.editorIndex });
    },
  },
  computed: {
    textContent() {
      return this.editorContent;
    },
    readonly() {
      return this.$store.state.comData.inputDisabled;
    },
  },
  watch: {
    textContent(val) {
      this.message = val;
    },
    message(val) {
      this.setVuex(val);
    },
  },
};
</script>

<style scoped>
.textarea{
  height: 300px;
}
.textarea>textarea{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 5px;
  resize: none;
  border:none;
  font-family: "Microsoft YaHei";
  font-size: 16px;
}
</style>
