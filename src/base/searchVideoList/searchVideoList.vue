<template>
<v-touch  v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" :style="'touch-action: pan-y!important;width:100%;height:'+windowHeight+'px'" :swipe-options="{direction: 'horizontal'}">
<scroll class="search-list"
  @scrollToEnd="scrollToEnd"
  :data="searches"
  :pullup="true">
<!--  <v-touch v-on:swipeleft="onSwipeLeft" class="search-list" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}"> -->
  <!-- <tip ref="tip"></tip> -->
  <ul class="container">
    <li class="search-item" v-for="(item, index) in searches" :key="index" @click="chooseVideo(index)" style="padding: 1px 1px" v-if="item.videoType">
		<van-image class="videoCover" fit="cover" :style="VideoItemHeightStyle" lazy-load :src="baseURL + item.previewImg + '&token=' + token" />
      <!-- <img class="videoCover" :style="VideoItemHeightStyle" :src="baseURL + item.previewImg + '&token=' + token"> -->
	  <!-- <img class="videoCover" :style="VideoItemHeightStyle" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01805e562458e832f87557016c4773.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636869801&t=dea4162a93386984fea02a4f83e99ce7"> -->
      <div class="bottom" style="width: 100%;text-align: initial;">
        <p class="videoDesc" style="padding-bottom: 0.5rem;">{{`${item.title.substr(0,40)}`}}</p>
        <div class="userAndLike">
          <div class="avatarAndName">
            <!-- <img class="avatar" :src="baseURL+ `${item.previewImg}`" alt=""> -->
			<!-- <img src="@/assets/user_1.png" width="40" height="40"  > -->
            <img class="avatar" :src="baseURL+ `/common/image?imgId=61b88b894316b402bcbf833f&token=${token}`" alt="">
			<!-- <van-image class="avatar" fit="cover" lazy-load :src="baseURL+ `/common/image?imgId=61b88b894316b402bcbf833f&token=${token}`" /> -->
            <!-- <p class="name">{{item.userNickname}}</p> -->
            <p class="name">薄荷七喜</p>
          </div>
		  
          <div class="message" style="padding-right: 0rem;">
            <span class="iconfont icon-message" style="font-size:10px;margin-right:5px;"></span>
            <p class="messageNum">{{item.commentNum ? item.commentNum : 0}}</p>
          </div>
		  <div class="like" style="padding-right: 1rem;">
		    <span class="iconfont icon-heart"></span>
		    <p class="likeNum">{{item.collectionNum ? item.collectionNum : 0}}</p>
		  </div>
        </div>
      </div>
    </li>
  </ul>
  </div>
<!-- </v-touch> -->
</scroll>
</v-touch>
</template>

<script>
// import { baseURL } from '@/common/js/config'
import Scroll from '@/base/scroll/scroll'
import { mapGetters } from 'vuex'
export default {
  props: {
    searches: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
		token: 'Bearer ' + localStorage.token
      // baseURL
    }
  },
  created(){
    // alert(111)
  },
  computed: {
    VideoItemHeightStyle () {
      let clientWidth = document.body.clientWidth
      let height = clientWidth / 2 * 1.3 + 'px'
      return {
        height
      }
    },
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    onSwipeLeft () {
    	// alert('页面右滑')
        // console.log('页面左滑')
      // this.$router.go(-1)
    },
    onSwipeRight(){
    	if(localStorage.slideReturn == 1){
    		this.$router.go(-1)
    	}
        // alert('页面右滑')
    	// 跳转其他页面的时候记录高度
    	// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
    	// alert('漫画高度' + this.curScroll)
        // this.$router.go(-1)
    },
    scrollToEnd () {
      if (this.searches.length === 0) return
      this.$emit('scrollToEnd')
    },
    chooseVideo (index) {
      this.$emit('chooseVideo', index)
    },
    sliceVideoDesc (str) {
      return `${str.substr(0, 20)}'...'`
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.search-list
  overflow hidden
  position absolute
  top 84px
  bottom 0
  width 100%
  height 100%
  
  /* background $color-background */
  .container
    overflow hidden
    .search-item
      position relative
      float left
      width 49%
      .videoCover
        width 100%
      .bottom
        position absolute
        bottom 0
        padding 5px
        display flex
        flex-direction column
        .videoDesc
          font-size $font-size-small-s
          color $color-white
        .userAndLike
          display flex
          justify-content space-between
          .avatarAndName
            display flex
            align-items center
            .avatar
              width 25px
              height 25px
              border-radius 50%
              margin-right 5px
            .name
              font-size $font-size-small-s
              color $color-white
          .like
            display flex
            align-items center
            .icon-heart
              font-size $font-size-small-s
              color $color-white
              margin-right 5px
            .likeNum
              font-size $font-size-small-s
              color $color-white
		 .message
		   display flex
		   align-items center
		   .icon-heart
		     font-size $font-size-small-s
		     color $color-white
		     margin-right 5px
		   .messageNum
		     font-size $font-size-small-s
		     color $color-white
</style>
