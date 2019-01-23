<template>
    <div class="textareaContent" >
      <table border="1">
        <thead>
        <tr>
          <th width="50%" v-html="tableTh.one"></th>
          <th width="50%" v-html="tableTh.two"></th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <Editor
            :editorContent="submissionData.first"
            :weekIndex="submissionData.index"
            editorIndex="first"
            ></Editor>
          </td>
          <td>
            <Editor
              :editorContent="submissionData.second"
              :weekIndex="submissionData.index"
              editorIndex="second"
            ></Editor>
          </td>
        </tr>
        </tbody>
      </table>
      <table border="1" style="margin-top: -1px;">
        <thead>
        <tr>
          <th width="50%" v-html="tableTh.three"></th>
          <th width="50%" v-html="tableTh.four"></th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <Editor
              :editorContent="submissionData.third"
              :weekIndex="submissionData.index"
              editorIndex="third"
            ></Editor>
          </td>
          <td>
            <Editor
              :editorContent="submissionData.fourth"
              :weekIndex="submissionData.index"
              editorIndex="fourth"
            ></Editor>
          </td>
        </tr>
        </tbody>
      </table>
      <table border="1" style="margin-top: -1px;">
        <thead>
        <tr>
          <th width="50%" v-html="tableTh.five"></th>
          <th width="50%" v-html="tableTh.six"></th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <Editor
            :editorContent="submissionData.fifth"
            editorIndex="fifth"
            :weekIndex="submissionData.index"
            ></Editor>
          </td>
          <td>
            <Editor
              :editorContent="submissionData.sixth"
              :weekIndex="submissionData.index"
              editorIndex="sixth"
            ></Editor>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
import Vue from 'vue';
import Editor from './editor.vue';

export default {
  name: 'missionTextarea',
  props: ['weekData'],
  components: { Editor },
  data() {
    return {
      tableTh: '',
      storeTableTh: {
        one: '<div>1、关于上周实际</div><div>(预定和实际产生差异的主要原因等)</div>',
        two: '<div>2、上周预定客案实际推进做法</div><div>(上周实际)</div>',
        three: '<div>3、关于上周预定</div><div>(制作预定的根据)</div>',
        four: '<div>4、上周预定客案推进至成交可能碰到的问题与解决方法</div><div>(上周预定)</div>',
        five: '<div>5、关于本周预定</div><div>(制作预定的根据)</div>',
        six: '<div>6、本周预定客案推进至成交可能碰到的问题与解决方法</div><div>(本周预定)</div>',
      },
      districtTableTh: {
        one: '<div>1、关于上周实际</div><div>(预定和实际产生差异的主要原因等)</div>',
        two: '<div>2、重点课题、措施、其他重要事项</div><div>(上周实际)</div>',
        three: '<div>3、关于上周预定</div><div>(制作预定的根据)</div>',
        four: '<div>4、重点课题、措施、其他重要事项</div><div>(上周预定)</div>',
        five: '<div>5、关于本周预定</div><div>(制作预定的根据)</div>',
        six: '<div>6、重点课题、措施、其他重要事项</div><div> (本周预定)</div>',
      },
      submissionData: {
        index: '',
        first: '',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
        sixth: '',
      },
    };
  },
  methods: {
    setTableTh() {
      if (this.weekData.identity === 'store') {
        this.tableTh = this.storeTableTh;
      } else if (this.weekData.identity === 'district') {
        this.tableTh = this.districtTableTh;
      }
      Vue.set(this.submissionData, 'first', this.weekData.first);
      Vue.set(this.submissionData, 'second', this.weekData.second);
      Vue.set(this.submissionData, 'third', this.weekData.third);
      Vue.set(this.submissionData, 'fourth', this.weekData.fourth);
      Vue.set(this.submissionData, 'fifth', this.weekData.fifth);
      Vue.set(this.submissionData, 'sixth', this.weekData.sixth);
      Vue.set(this.submissionData, 'index', this.weekData.index);
    },
    // getEditorData(obj) {
    //   this.submissionData[obj.index].content = obj.content;
    //   this.$store.commit('setMissionListData', this.submissionData);
    // },
  },
  mounted() {
    this.setTableTh();
  },
};
</script>

<style lang="less" scoped>
.textareaContent{
  margin-top: 80px;
  table{
    td{
      padding: 0;
      height:200px;
      box-sizing: border-box;
      textarea{
        margin-top: 1px;
        box-sizing: border-box;
        width: 100%;
        height: 99%;
        border:none;
        outline: none;
        resize: none;
        font-size: 18px;
        padding: 5px;
      }
    }
  }
}
</style>
