<template>
<div @click.capture="closeCommentList($event)">
  <div class="back iconfont icon-left" @click="close"></div>
	  <scroll class="wrap"
		:style="VideoItemHeightStyle"
		ref="scroll"
		:probeType="3"
		:data="playListDetail"
		:scrollEnd="true"
		:momentum="true"
		:listenScroll="true"
		@scroll="scroll"
		@scrollEnd="scrollEnd">
		<div>
		  <my-video v-for="(item, index) in playListDetail"
			ref="videos"
			:key="item.id"
			:index="index"
			:videoHeight="videoHeight"
			@playVideo="playHandler"
			:bottomComment="true"
			:VideoItem="item"
			@showPageToolMethod="showPageToolMethod"
			:showPageTool="showPageTool"
			@showCommentList="fetchCommentsAndShowList"></my-video>
		</div>
		
	  </scroll>
	  <!--留言弹窗-->
	  <!-- <comment ref="comment" @commentNum="getCommentNum"></comment> -->
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
import comment from '@/components/comment'
import Scroll from '@/base/scroll/scroll'
import MyVideo from '@/components/MyVideo/MyVideo'
import CommentList from '@/components/CommentList/CommentList'
import { deduplicateCommentList } from '@/common/js/util'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
		showPageTool:this.showPageTool,// 隐藏除视频和工具栏外的所有东西
	  videoHeight:document.body.clientHeight, // 视频高度
      currentY: 0,
      showCommentList: false,
      commentNum: 0,
      commentList: [],
      page: 0,
      currentCommentVideoId: '',
      isEnd: false,
      timer: null,
	  currentHeight : 0 ,// 当前高度
    }
  },
  methods: {
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
	// 隐藏视频和工具栏外所有东西
	showPageToolMethod(){
		 this.showPageTool = !this.showPageTool
	},
    scroll (pos) {
		// console.log(pos.y)
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
	// changeVideo(type){
	// 	if(!this.$refs.videos){
	// 		return;
	// 	}
	// 	// 切换视频,所有进度归0
	// 	if(this.currentY == 0){
	// 		// 暂停上个视频
	// 		this.$refs.videos[1].video.pause()
	// 		this.$refs.videos[0].playStatus = true
	// 		this.$refs.videos[0].video.el().getElementsByTagName('video')[0].currentTime = 0
	// 		this.$refs.videos[0].video.play()
	// 		return;
	// 	}
	// 	// 获取高度,以及y轴高度,还有视频数量总高度
	// 	let clientHeight = this.clientHeight
	// 	let index = this.currentY / clientHeight
	// 	// 暂停上个视频
	// 	if(type == 1){
	// 		this.$refs.videos[index -1 ].video.pause()
	// 	}
	// 	// 暂停下个视频
	// 	if(type == 2){
	// 		this.$refs.videos[index + 1].video.pause()
	// 	}
	// 	// this.currentHeight = clientHeight * (index + 1)
	// 	this.$refs.videos[index].playStatus = true
	// 	this.$refs.videos[index].video.el().getElementsByTagName('video')[0].currentTime = 0
	// 	this.$refs.videos[index].video.play()
	// },
	changeVideo(type){
		// console.log('切换视频')
		if(!this.$refs.videos){
			return;
		}
		// 切换视频,所有进度归0
		if(this.currentY == 0){
			if(this.$refs.videos[1].video){
				// 暂停上个视频
				this.$refs.videos[1].video.pause()
			}
			if(this.$refs.videos[0].video){
				this.$refs.videos[0].playStatus = true
				// this.$refs.videos[0].video.el().getElementsByTagName('video')[0].currentTime = 0
				this.$refs.videos[0].video.play()
			}else{
				// 创建视频
				this.$refs.videos[0].createVideo()
			}

			return;
		}
		// 获取高度,以及y轴高度,还有视频数量总高度
		let clientHeight = this.clientHeight
		let index = this.currentY / clientHeight
		// 暂停上个视频
		if(type == 1){
			// this.currentHeight = clientHeight * (index + 1)
			if(this.$refs.videos[index -1 ].video){
				this.$refs.videos[index -1 ].video.pause()
				// this.$refs.videos[index -1 ].video.removeAttribute('src');
			}/*else{
				this.$refs.videos[index -1].createVideo()
			}*/

		}
		// 暂停下个视频
		if(type == 2){
			if(this.$refs.videos[index +1 ].video){
				this.$refs.videos[index + 1].video.pause()
				// this.$refs.videos[index + 1 ].video.removeAttribute('src');
			}/*else{
				this.$refs.videos[index +1].createVideo()
			}*/

		}
		this.currentHeight = clientHeight * index
		if(this.$refs.videos[index].video){
			this.$refs.videos[index].playStatus = true
			// this.$refs.videos[index].video.el().getElementsByTagName('video')[0].currentTime = 0
			this.$refs.videos[index].video.play()
			this.$refs.videos[index].loadCommentAndCollectionNum(); // 加载评论和收藏数
			// 停止记录进度条，重新记录
			this.$refs.videos[index].stopProcess()
			this.$refs.videos[index].startProcess()
		}else{
			this.$refs.videos[index].createVideo()
		}
		// 将视频前后的两个视频以为的视频都销毁,最多五个视频同时存在
		let videoLength = this.playListDetail.length// 视频数据
		let startLength = index - 2; // 开始销毁位置
		let endLength = index + 2;// 结束销毁位置
		while(startLength > 0){
			startLength -= 1;
			if(this.$refs.videos[startLength].video){
				// console.log('开始视频' + startLength)
				this.$refs.videos[startLength].video.dispose()
				this.$refs.videos[startLength].video = null;
			}
		}
		while(endLength < videoLength ){
			if(this.$refs.videos[endLength].video){
				console.log('结束视频' + endLength)
				this.$refs.videos[endLength].video.dispose()
				this.$refs.videos[endLength].video = null;
			}
			endLength += 1
		}

	},
    scrollEnd (pos) {
		// 结束将当前高度设置为0
		let totalHeight  = -(this.clientHeight * (this.playListDetail.length - 1)) // 总高度
		if(pos.y == totalHeight){
			// console.log(this)	
			// console.log('滑到最下面》。。。。。。。。。')
			this.$parent.$children[0].$children[0].queryData()
			return;
		}
		// 滑到最底下加载新数据
		if(this.currentHeight > 0){
			this.$refs.scroll.scrollTo(0, -this.currentHeight)
			this.currentHeight = 0
		}

    },
    fetchCommentsAndShowList (videoId, commentNum) {
      // if (this.currentCommentVideoId !== videoId) {
      //   this.isEnd = false
      //   this.page = 1
      //   this.currentCommentVideoId = videoId
      //   this.commentNum = commentNum
      //   this.$axios.get(`/api/video/${videoId}/getVideoComment/page/${this.page}`).then((res) => {
      //     if (res.data.data.length < 20) {
      //       this.isEnd = true
      //     }
      //     this.commentList = deduplicateCommentList(res.data.data)
      //     this.showCommentList = true
      //   })
      // } else {
      //   this.page++
      //   if (this.isEnd) return
      //   this.$axios.get(`/api/video/${videoId}/getVideoComment/page/${this.page}`).then((res) => {
      //     if (res.data.data.length < 20) {
      //       this.isEnd = true
      //     }
      //     this.commentList = deduplicateCommentList(this.commentList.concat(res.data.data))
      //     this.showCommentList = true
      //   })
      // }
    },
    scrollToIndex (index) {
		// console.log(this.clientHeight)
		this.currentY = index * this.clientHeight
		// console.log(this.$refs)
		// console.log(this.$refs.videos)
		// 播放视频
		this.$nextTick(()=>{
		if(this.$refs.videos){
			// console.log('开始.....')
			
				// alert('屏幕高度' +clientHeight + 'y轴高度'+this.currentY)
				this.currentHeight = this.currentY 
				// 判断视频是否存在,不存再创建
				if(!this.$refs.videos[index].video){
					this.$refs.scroll.scrollTo(0, -this.currentY)
					this.$refs.videos[index].createVideo()
				}else{
					// 存在直接播放
					this.$refs.scroll.scrollTo(0, -this.currentY)
					// this.$refs.videos[index].currentTime = 0 
					this.$refs.videos[index].playStatus = true
					this.$refs.videos[index].video.play()
					// 停止记录进度条，重新记录
					this.$refs.videos[index].stopProcess()
					this.$refs.videos[index].startProcess()
				}
			

		}
})
	  
    },
    close () {
		// 返回将视频全部销毁
		// console.log('视频全部销毁.......')
		let videoLength = this.playListDetail.length// 视频数据
		for(let i =0;i<videoLength;i++){
			if(this.$refs.videos[i].video){
				this.$refs.videos[i].video.dispose()
				this.$refs.videos[i].video = null;
			}
		}
      this.$emit('close')
    },
    closeCommentList (e) {
		let videoLength = this.playListDetail.length// 视频数据
		// 获取高度,以及y轴高度,还有视频数量总高度
		let clientHeight = this.clientHeight
		let index = this.currentY / clientHeight
		// 返回暂停视频,停止计时
		// this.$refs.videos[index].video.pause()
		// 暂停所有视频
		
		// this.close();
		for(let i =0;i<videoLength;i++){
			if(index == i){
				continue;
			}
			if(this.$refs.videos[i].video){
				console.log(this.$refs.videos[i].video)
				this.$refs.videos[i].video.pause()
				// this.$refs.videos[i].video.playStatus = !this.$refs.videos[i].video.playStatus
			}
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
	  // alert('高度' + clientHeight)
      return {
        height: clientHeight + 'px',
        width: clientWidth + 'px',
		position:'absolute',
      }
    },
    ...mapGetters([
      'playListDetail'
    ])
  },
  components: {
    MyVideo,
    Scroll,
    CommentList,
	comment
  },
	created(){
		console.log(this.playListDetail)
	}
}
</script>

<style  lang='stylus' scoped>
.up-enter-active, .up-leave-active
  transition all .5s
.up-enter, .up-leave-to
  opacity 0
  transform translateY(100%)
.back
  position absolute
  left 10px
  top 10px
  padding 8px
  z-index 9999
.wrap
  position relative
</style>
