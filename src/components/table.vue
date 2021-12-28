<template>
  <div class="vant-table">
    <table cellspacing="0" :style="bgcolor" style="width:100%" class="table">
      <tr>
        <th class="th" v-for="(item, index) in option.column" :key="index">{{ item.label }}</th>
      </tr>
      <tr v-for="(item, index) in tableData" :key="index" class="list-tr">
        <td v-for="(context, i) in option.column" :key="i">{{ item[context.prop] }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
   props:{
      bgcolor: Object,
      tableData:Array,
      option:Object
   },
  created() {}
};
</script>

<style lang="less" scoped>
.vant-table {
  .table {
     border-radius: .185185rem;
    .th {
      height: 1.074074rem;
      line-height: 1.074074rem;
      background-color: #969799;
      text-align: center;
      border-top-left-radius: .185185rem;
      border-top-right-radius: .185185rem;
    }
    .list-tr {
		
      height: 1.074074rem;
      line-height: 1.074074rem;
    }
    .list-tr:nth-child(2n) {
      background-color: #f0f0f0;
    }
  }
}
</style>