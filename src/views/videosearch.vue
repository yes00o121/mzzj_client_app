<template>
<div class="searchWrap " :style="searches.length == 0 ? ('height:' + windowWidth + 'px') : ''">
	<van-sticky>
  <div class="topBar defaultBackground" >
    <span class="iconfont icon-left defaultBackground" @click="$router.go(-1)" ></span>
   <search-bar
    class="searchBar defaultBackground"
    :placeholder="placeholder"
    ref="searchBar"
    @query="query"></search-bar>
	<div class="search-button defaultBackground" >
		搜索
	</div>
  </div>
  <div class="tab">
    <!-- <router-link tag="div" class="tab-item" to="/videosearch/video">
      <span class="tab-link">视频</span>
    </router-link> -->
    <!-- <router-link tag="div" class="tab-item" to="/search/user">
      <span class="tab-link">用户</span>
    </router-link> -->
  </div>
  <search-tool :show="showSearchTool" @search= "search"></search-tool>
  </van-sticky>
  <!-- <v-touch v-on:swipeup="onSwipeup" v-on:swipeleft="onSwipeLeft" class="search-list" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}"> -->
  <router-view
    v-if="searches.length > 0"
    :searches="searches"
    @select="selectItem"
    @chooseVideo="chooseVideo"
    @scrollToEnd="scrollToEnd"></router-view>
	<!-- </v-touch> -->
  <transition name="left">
    <play-list
      class="play-list"
      ref="playList"
      v-show="showPlayList"
      @close="showPlayList=false;"></play-list>
  </transition>
</div>
</template>

<script>

import PlayList from '@/components/PlayList/PlayList'
import SearchBar from '@/base/searchBar/searchBar'
import searchTool from '@/components/searchTool'
import { mapGetters, mapMutations } from 'vuex'
const PER_PAGE_LIMIT_NUM = 10
export default {
  data () {
    return {
		showSearchTool:true, // 是否显示查询工具
      querykey: '',
      searches: [],
      page: 0,
	  pagesize:10,
      isEnd: false,
      showPlayList: false
    }
  },
  watch: {
    '$route' (newVal) {
      this.$refs.searchBar.clear()
      this.querykey = ''
      this.page = 1
      this.isEnd = false
      this.searches = []
      this.showPlayList = false
    }
  },
  computed: {
    placeholder () {
      // let routeName = this.$route.name
      // if (routeName === 'search/user') {
      //   return '输入关键字进行搜索（昵称、id）'
      // } else if (routeName === 'search/video') {
      //   return '输入关键字进行搜索（视频描述）'
      // }
      // return '输入关键字进行搜索（视频描述）'
	  return '输入关键字进行搜索'
    },
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
	  // 条件回调查询
	  search(data){
		console.log('search.......................')  
		console.log(data)
		this.$refs.searchBar.searchParams = data
		// 初始化配置
		this.CLEAN_PLAYLIST()
		this.$refs.searchBar.page = 0
		this.searches = []
		this.isEnd = false
		this.$refs.searchBar.queryData()
	  },
	  getCommentNum(video,commentNum){
	  	// console.log(video)
	  	// console.log('ping论数量' + commentNum)
	  	// console.log(this.$refs.comment)
	  	// 获取高度,以及y轴高度,还有视频数量总高度
	  	let clientHeight = this.clientHeight
	  	let index = this.currentY / clientHeight
	  	// let id = video.id.replace('_html5_api','')
	  	this.$refs['videos'][index].setCommentNum(commentNum)
	  },
	onSwipeLeft () {
	    console.log('页面左滑')
	  // this.$router.go(-1)
	},
	onSwipeRight(){
	    console.log('页面右滑')
	    // this.$router.go(-1)
	},
	onSwipeup(){
		console.log('滚动监听................')
	},
    scrollToEnd () {
      if (this.isEnd) return
	  		console.log('到底了.....................' + this.$route.name)
      let routeName = this.$route.name
	  if(routeName == 'videosearch/video'){
		  // this.page++
		  this.fetchSearchUserList()
	  }
      // if (routeName === 'search/user') {
      //   this.page++
      //   this.fetchSearchUserList()
      // } else if (routeName === 'search/video') {
      //   this.page++
      //   this.fetchSearchVideoList()
      // }
    },
    query (q) {
	  // console.log(this.SET_PLAYLIST)
   //    console.log('chaxun 回调...')
   //    console.log(q)
      if (q.length < PER_PAGE_LIMIT_NUM) {
          this.isEnd = true
        }
		// if(q.length)
		if(this.searches.length > 0){
			// console.log(this.searches)
			this.APPEND_PLAYLIST(q)
			this.searches = this.searches.concat(q)
			console.log(this.searches)
		}else{
			this.APPEND_PLAYLIST(q)
			this.searches = this.searches.concat(q)
		}


		// this.CLEAN_PLAYLIST()
		// this.SET_PLAYLIST(this.searches)
	  // this.playList = this.searches
	  // this.SET_PLAYLIST(this.searches)
	  // this.$refs.playList.scrollToIndex(0)
      // this.querykey = q
      // if (!q) return
      // let routeName = this.$route.name
      // this.page = 1
      // this.isEnd = false
      // this.searches = []
      // if (routeName === 'search/user') {
      //   this.fetchSearchUserList()
      // } else if (routeName === 'search/video') {
      //   this.fetchSearchVideoList()
      // }
    },
    fetchSearchUserList () {
      if (this.isEnd) return
	  this.$refs['searchBar'].queryData()
	 //  this.$msg.loading({
	 //    message: '加载中...',
	 //  		duration:0,
	 //    forbidClick: true,
	 //    loadingType: 'spinner'
	 //  });
	 //  this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
	 //    loadMode: '4',
	 //    pageNum: this.page,
	 //    pageSize: this.pagesize,
	 //    search: this.querykey
	 //  }).then(res=>{
	 //    console.log(res.data.data.list)
		// this.$msg.clear()
		// this.searches = this.searches.concat(res.data.data.list)
	 //    // this.$emit('query', res.data.data.list)
	 //  })
      // this.$axios.post(`/api/user/${this.loginInfo.userId}/searchUser/${this.page}`, {
      //   key: this.querykey
      // }).then(r => {
        // if (r.data.data.length < PER_PAGE_LIMIT_NUM) {
        //   this.isEnd = true
        // }
      //   this.searches = this.searches.concat(r.data.data)
      // })
    },
    fetchSearchVideoList () {
      if (this.isEnd) return
      this.$axios.post(`/api/user/${this.loginInfo.userId}/searchVideo/${this.page}`, {
        key: this.querykey
      }).then(r => {
        if (r.data.data.length < PER_PAGE_LIMIT_NUM) {
          this.isEnd = true
        }
        this.searches = this.searches.concat(r.data.data)
      })
    },
    selectItem (item) {
      this.$router.push(`/profile/${item.userId}`)
    },
    chooseVideo (index) {
      this.showPlayList = true
	  console.log(this.searches)
	  this.CLEAN_PLAYLIST()
      this.SET_PLAYLIST(this.searches)
	  // console.log('索引' + index)
      this.$refs.playList.scrollToIndex(index)
    },
    ...mapMutations([
      'SET_PLAYLIST',
	  'CLEAN_PLAYLIST',
	  'APPEND_PLAYLIST'
    ])
  },
  components: {
    SearchBar,
    PlayList,
	searchTool
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.search-button
   line-height 44px
   text-align center
   padding 0 10px
body
   padding 0
   border 0
   font-size 100%
   font-weight normal
   vertical-align baseline
   background #000
.left-enter-active, .left-leave-active
  transition all .5s
.left-enter, .left-leave-to
  opacity 0
  transform translateX(100%)
.searchWrap
  width 100%
  /* background black */
  .play-list
    position fixed
    z-index 1500
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
  .tab
    /* background black */
    display flex
    .tab-item
      flex 1
      text-align center
      .tab-link
        display block
        padding 12px
        color $color-desc
      &.router-link-exact-active
        .tab-link
          color $color-white
          /* border-bottom 2px solid $color-point */
  .topBar
    /* background black */
    display flex
    .searchBar
      flex 1
      /* margin-right 10px */
    .icon-left
      color black
      text-align center
      width 44px
      line-height 44px
  .search-list-wrap
    background white
    overflow hidden
    position absolute
    top 84px
    bottom 0
    width 100%

.defaultBackground{
	background:white;
	z-index:1400;
}
</style>
