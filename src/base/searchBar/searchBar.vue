<template>
<div class="input-wrap">
  <!-- <span class="iconfont icon-search"></span> -->
  <van-icon name="search" style="margin-left: 10px;" />
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
	  searchSortType:null,
      page:0, // 页数
      pagesize: 10 // 每页数量
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    queryData(){
		// 如果查询条件为空,直接退出
		if(!this.query){
			return;
		}
	  this.$msg.loading({
	    message: '加载中...',
	  		duration:0,
	    forbidClick: true,
	    loadingType: 'spinner'
	  });
      this.page += 1
      this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", Object.assign({
        loadMode: '4',
        pageNum: this.page,
        pageSize: this.pagesize,
        search: this.query
      },
	  this.searchSortType? {searchSortType:this.searchSortType} : {}
	  )).then(res=>{
        // console.log(res.data.data.list)
		this.$msg.clear()
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
        // console.log('搜索了......' + newQuery + '---' + befQuery )
		if(!newQuery){
			this.queryData()
			return;
		}
		if(newQuery != befQuery){
			// 清除父数组
			this.$parent.$parent.CLEAN_PLAYLIST()
			this.$parent.$parent.searches = []
			this.$parent.$parent.isEnd = false
			this.page = 0
			this.queryData()
			return;
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
  z-index 1400
  /* background rgb(36, 38, 48) */
  /* background #f4f4f4 */
  /* border-radius 5px */
  height 44px
  display flex
  justify-content center
  align-items center
  .iconfont
    z-index 1400
    margin-left 10px
    font-size 21px
  .icon-close
    z-index 1400
    font-size $font-size-small
    margin-right 10px
    padding 5px
  .input
    z-index 1400
    height 21px
    /* background rgb(26, 27, 32) */
	background black
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
