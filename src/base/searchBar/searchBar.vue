<template>
<div class="input-wrap">
  <span class="iconfont icon-search"></span>
  <input ref="query" v-model="query" class="input" style="border:none" :placeholder="placeholder">
  <span @click="clear" v-show="query" class="iconfont icon-close"></span>
</div>
</template>

<script>
import { debounce } from '@/common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索用户昵称'
    }
  },
  data () {
    return {
      query: '',
      page:0, // 页数
      pagesize:10 // 每页数量
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    queryData(){
      this.page += 1
      this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
        loadMode: '4',
        pageNum: this.page,
        pageSize: this.pagesize,
        search: this.query
      }).then(res=>{
        console.log(res.data.data.list)
        this.$emit('query', res.data.data.list)
      })
    },
    reset(){
      this.page = 1
    }
  },
  created () {
    // 防抖函数
      this.$watch('query', debounce((newQuery,befQuery) => {
        console.log('搜索了......' + newQuery + '---' + befQuery )
		if(!newQuery){
			this.queryData()
			return;
		}
		if(newQuery != befQuery){
			// 清除父数组
			this.$parent.searches = []
			this.queryData()
		}
        // this.$emit('query', newQuery)
        // async queryVideo(){

    }, 200))
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.input-wrap
  width 100%
  background rgb(36, 38, 48)
  border-radius 5px
  height 44px
  display flex
  justify-content center
  align-items center
  .iconfont
    margin-left 10px
    font-size 21px
  .icon-close
    font-size $font-size-small
    margin-right 10px
    padding 5px
  .input
    height 21px
    background rgb(26, 27, 32)
    flex 1
    font-size $font-size-medium
    color $color-text
    padding-left 10px
    background none
    caret-color $color-point
    &:focus
      outline none
      border none
</style>
