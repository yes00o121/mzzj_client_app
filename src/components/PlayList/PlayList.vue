<template>
<div @click.capture="closeCommentList($event)">
  <div class="back iconfont icon-left" @click="close"></div>
  <scroll class="wrap"
    :style="VideoItemHeightStyle"
    ref="scroll"
    :probeType="3"
    :data="playList"
    :scrollEnd="true"
    :momentum="true"
    :listenScroll="true"
    @scroll="scroll"
    @scrollEnd="scrollEnd">
    <div>
      <my-video v-for="(item, index) in playList"
        ref="videos"
        :key="item.id"
		:index="index"
        @playVideo="playHandler"
        :VideoItem="item"
        @showCommentList="fetchCommentsAndShowList"></my-video>
    </div>
  </scroll>
  <transition name="up">
    <comment-list
      v-if="showCommentList"
      :commentList="commentList"
      :commentNum="commentNum"
      :currentCommentVideoId="currentCommentVideoId"
      @close="closeCommentList"
      @scrollToEnd="fetchCommentsAndShowList"></comment-list>
  </transition>
</div>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import MyVideo from '@/components/MyVideo/MyVideo'
import CommentList from '@/components/CommentList/CommentList'
import { deduplicateCommentList } from '@/common/js/util'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      currentY: 0,
      showCommentList: false,
      commentNum: 0,
      commentList: [],
      page: 0,
      currentCommentVideoId: '',
      isEnd: false,
      timer: null,
	  currentHeight : 0 // 当前高度
    }
  },
  methods: {
    playHandler (e) {
		
      // let v = e.target
	  // console.log(e)
      // if (v.paused) {
      //   this.$refs.videos.forEach(item => {
      //     item.$refs.video.pause()
      //   })
      //   v.play()
      // } else {
      //   v.pause()
      // }
    },
    scroll (pos) {
	  if(this.currentHeight > 0){
		  return;
	  }
      let clientHeight = this.clientHeight
      let absY = Math.abs(pos.y)
      if (absY > this.currentY + clientHeight / 2) {
        this.currentY = Math.ceil(absY / clientHeight) * clientHeight
        this.$refs.scroll.scrollTo(0, -this.currentY, 500)
		// 向下
		// console.log(this.currentY)
		this.changeVideo(1)
      } else if (absY < this.currentY - clientHeight / 2) {
        this.currentY = Math.floor(absY / clientHeight) * clientHeight
        this.$refs.scroll.scrollTo(0, -this.currentY, 500)
		// 向上
		// console.log(this.currentY)
		this.changeVideo(2)
      } else {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.scroll.scrollTo(0, -this.currentY, 500)
		  // 没变
		  // console.log(this.currentY)
        }, 500)
      }
	  // 等待0.5秒,播放视频
	  // setTimeout(()=>{
		 //  console.log(this.currentY)
	  // },500)

    },
	changeVideo(type){
		if(!this.$refs.videos){
			return;
		}
		// 切换视频,所有进度归0
		if(this.currentY == 0){
			// 暂停上个视频
			this.$refs.videos[1].video.pause()
			this.$refs.videos[0].playStatus = true
			this.$refs.videos[0].video.el().getElementsByTagName('video')[0].currentTime = 0
			this.$refs.videos[0].video.play()
			return;
		}
		// 获取高度,以及y轴高度,还有视频数量总高度
		let clientHeight = this.clientHeight
		let index = this.currentY / clientHeight
		// 暂停上个视频
		if(type == 1){
			this.$refs.videos[index -1 ].video.pause()
		}
		// 暂停下个视频
		if(type == 2){
			this.$refs.videos[index + 1].video.pause()
		}
		// this.currentHeight = clientHeight * (index + 1)
		this.$refs.videos[index].playStatus = true
		this.$refs.videos[index].video.el().getElementsByTagName('video')[0].currentTime = 0
		this.$refs.videos[index].video.play()
	},
    scrollEnd (pos) {
		// 结束将当前高度设置为0
		// this.currentHeight = 0
		// console.log('000000000000000000000000000000000000')
		if(this.currentHeight > 0){
			this.$refs.scroll.scrollTo(0, -this.currentHeight)
			this.currentHeight = 0
		}

    },
    fetchCommentsAndShowList (videoId, commentNum) {
      if (this.currentCommentVideoId !== videoId) {
        this.isEnd = false
        this.page = 1
        this.currentCommentVideoId = videoId
        this.commentNum = commentNum
        this.$axios.get(`/api/video/${videoId}/getVideoComment/page/${this.page}`).then((res) => {
          if (res.data.data.length < 20) {
            this.isEnd = true
          }
          this.commentList = deduplicateCommentList(res.data.data)
          this.showCommentList = true
        })
      } else {
        this.page++
        if (this.isEnd) return
        this.$axios.get(`/api/video/${videoId}/getVideoComment/page/${this.page}`).then((res) => {
          if (res.data.data.length < 20) {
            this.isEnd = true
          }
          this.commentList = deduplicateCommentList(this.commentList.concat(res.data.data))
          this.showCommentList = true
        })
      }
    },
    scrollToIndex (index) {
		// console.log(this.clientHeight)
		this.currentY = index * this.clientHeight
		this.currentHeight = this.currentY 

		// 播放视频
		if(this.$refs.videos){
			this.$refs.scroll.scrollTo(0, -this.currentY)
			this.$refs.videos[index].video.play()
		}

	  
    },
    close () {
      this.$emit('close')
    },
    closeCommentList (e) {
      if (this.showCommentList && (e.target.nodeName === 'VIDEO' || e.target.className.includes('icon-close'))) {
        this.currentCommentVideoId = ''
        e.stopPropagation()
        this.showCommentList = false
      }
    },
    ...mapActions([
      'getPopularVideo'
    ])
  },
  computed: {
    clientHeight () {
      return document.body.clientHeight
    },
    VideoItemHeightStyle () {
      let clientWidth = document.body.clientWidth
      let clientHeight = document.body.clientHeight
      return {
        height: clientHeight + 'px',
        width: clientWidth + 'px'
      }
    },
    ...mapGetters([
      'playList'
    ])
  },
  components: {
    MyVideo,
    Scroll,
    CommentList
  }
}
</script>

<style scoped lang='stylus'>
.up-enter-active, .up-leave-active
  transition all .5s
.up-enter, .up-leave-to
  opacity 0
  transform translateY(100%)
.wrap
  position relative
.back
  position absolute
  left 10px
  top 10px
  padding 8px
  z-index 33
</style>
