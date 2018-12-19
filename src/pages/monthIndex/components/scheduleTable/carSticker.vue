<template>
    <div class="carSticker">
      <table class="carStickerTable" v-if="carStickerData.length>0" border="1">
        <thead>
        <tr>
          <th>职称</th>
          <th>数额</th>
          <th>人数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in carStickerData" :key="i">
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td><input type="text"/></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
export default {
  name: 'carSticker',
  props: ['carStickerData'],
};
</script>

<style scoped>

</style>
