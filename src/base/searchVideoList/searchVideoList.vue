<template>
<scroll class="search-list"
  @scrollToEnd="scrollToEnd"
  :pullup="true">
  <!-- <v-touch v-on:swipeleft="onSwipeLeft" class="search-list" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}"> -->
  <!-- <tip ref="tip"></tip> -->
  <ul class="container">
    <!-- {{searches}} -->
    <li class="search-item" v-for="(item, index) in searches" :key="index" @click="chooseVideo(index)" style="padding: 1px 1px" v-if="item.videoType">
      <img class="videoCover" :style="VideoItemHeightStyle" :src="baseURL + item.previewImg + '&token=' + token">
      <div class="bottom" style="width: 100%;text-align: initial;">
        <p class="videoDesc" style="padding-bottom: 0.5rem;">{{`${item.title.substr(0,40)}`}}</p>
        <div class="userAndLike">
          <div class="avatarAndName">
            <!-- <img class="avatar" :src="baseURL+ `${item.previewImg}`" alt=""> -->
            <img class="avatar" :src="baseURL+ `/common/image?imgId=6103eed9f1a2480958525955&token=${token}`" alt="">
            <!-- <p class="name">{{item.userNickname}}</p> -->
            <p class="name">薄荷七喜</p>
          </div>
          <div class="like" style="padding-right: 1rem;">
            <span class="iconfont icon-heart"></span>
            <p class="likeNum">{{item.flowNum}}</p>
          </div>
        </div>
      </div>
    </li>
  </ul>
<!-- </v-touch> -->
</scroll>
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
        // console.log('页面左滑')
      // this.$router.go(-1)
    },
    onSwipeRight(){
        // console.log('页面右滑')
        this.$router.go(-1)
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
  
  background $color-background
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
</style>
