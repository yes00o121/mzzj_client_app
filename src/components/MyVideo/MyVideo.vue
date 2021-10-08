<template>
	<div >
  <div class="my-video" :style="VideoItemHeightStyle" @click.stop="playVideo()">
    <!-- <video class="video" :src="baseURL + VideoItem.videoPath"
      :poster="VideoItem.videoCover"
      webkit-playsinline
      playsinline
      x5-video-player-type="h5"
      preload="none"
      @click="playHandler($event)"
      @loadeddata="watchHandler"
      ref="video"></video> -->
	  <video ref = "videoPlayer" :id="VideoItem.id" v-if="VideoItem.videoType == 'm3u8'"  class="video"
	  style="width:100%;height:100%"
	  :poster="baseURL +  VideoItem.previewImg + '&token=' + token"
	  webkit-playsinline="true" x5-video-player-type="h5-page"
	  x5-playsinline  x-webkit-airplay="allow"
	  x5-video-player-fullscreen="true" playsinline="true" preload="auto"
	  :controls="false" :videoType="VideoItem.videoType"   :playUrl="VideoItem.url"
	  object-fit="fill"
	  ></video>
    <div class="side-bar">	
      <div class="avatar">
       <!-- <img :src="`${baseURL}${VideoItem.userAvatar}`" alt="" width="40" height="40"
          @click="chooseUser"> -->
		  <img :src="`${baseURL}/common/image?imgId=6103eed9f1a2480958525955&token=${token}`" alt="" width="40" height="40"
		    >
		  
        <!-- <div class="follow">+</div> -->
      </div>
	  <!-- 加载状态-->
	  <van-loading class="iconfont" v-show="collStatus"/>
	  <!-- 收藏按钮 -->
      <div class="like iconfont icon-heart-fill" v-show="!collStatus" :class="{ 'red-heart': like }" @click.stop="collectionClick()">
        <span class="likenum">{{collNum}}</span>
      </div>
	  <!-- 评论图标-->
      <!-- <div class="comment iconfont icon-message" @click.stop="showCommentList(VideoItem.videoId, VideoItem.commentNum)"> -->
	  <div class="comment iconfont icon-message" @click.stop="changeComment()">
        <span class="commentnum">{{commentNum}}</span>
      </div>
      <div class="share iconfont icon-share" @click="$msg.fail('分析功能关闭')">
        <!-- <span class="sharenum">{{commentNum}}</span> -->
		<span class="sharenum">0</span>
      </div>
    </div>
    <div class="text-wrap">
      <!-- <div class="name">@{{VideoItem.userNickname}}</div> -->
      <div class="desc van-multi-ellipsis--l2" style="text-align: initial;">{{VideoItem.title}}</div>
	 
    </div>
	 <div  style="text-align: initial;text-align: initial;
    position: absolute;
    bottom: 66px;
    color: white;
    right: 11px;">{{VideoItem.videoLength | getDateBysecond}}</div>
	<div style="position:absolute;bottom:48px;width:100%"> <!-- 当前播放位置 -->
	  <van-slider v-model="videoProcess" :min="0" :max="100" :button-size="1" @drag-start="dragStart" @drag-end="dragEnd" @input="dragInput" @change="dragChange"/></div>
    <div class="input-bar" v-show="!isHome" @click.stop="showCommentList(VideoItem.videoId, VideoItem.commentNum)">
		
     <!-- <input class="input" placeholder="  有爱评论，说点儿好听的~" type="text">
      <span class="iconfont icon-at" ></span>
      <span class="iconfont icon-check"></span> -->
    </div>
	<img v-show="!playStatus" class="icon_play"
	     src="@/assets/play.png"/>
  </div>


  </div>
</template>

<script>
// import { baseURL } from '@/common/js/config'
import { mapGetters } from 'vuex'
export default {		
  props: {
    VideoItem: {
      type: Object,
      required: true
	  
    },
	index:{
		type:Number
	}
  },
  watch:{
  	commentPop(cur){
		// if(cur){
		// 	this.$parent.$parent.bottomShow = false
		// }else {
		// 	setTimeout(()=>{
		// 	this.$parent.$parent.bottomShow = true
		// 	},100)
		// }
  	}  
  },
  filters:{
		// 根据秒获取时间
		getDateBysecond(second){
			if(second < 60){
				return '0:' + (second <= 9 ? '0' + second: second);
			}
			let minute = parseInt(second/60)
			let s = second - (minute * 60)
			if(minute < 60){
				return (minute <= 9 ? '0' + minute : minute) + ':' + (s <= 9 ? '0' + s : s);
			}
			return '';
		}
	},
  created () {
	  // this.$nextTick(()=>{
		 //  // 判断位置,如果高度和index相同,跳转并且播放该视频
		 //  let curIndex = this.$parent.$parent.currentHeight  /  document.body.clientHeight
		 //  if(this.VideoItem.videoType == 'm3u8'){
		 //  	  this.video = this.$video(
		 //  	            this.$refs.videoPlayer,
		 //  	            // this.options,
		 //  	  		  {
		 //  	  			  // autoplay: 'muted',//自动播放
		  	  
		 //  	  			  loop:true,
		 //  	  			  controls: false,//用户可以与之交互的控件
		 //  	  		  },
		 //  	            function onPlayerReady() {
		 //  	  				this.on("progress",function(){
		 //  	  					// 5
		 //  	  					// console.log("正在请求数据 ");
		 //  	  					this.el_.getElementsByTagName('span')[0].innerText = ''
		 //  	  				})
		 //  	  		  }
		 //  	          );
		 //  	  let nextAddress = this.VideoItem.nextAddress
		 //  	  nextAddress = nextAddress.split('_-')[1]
		 //  	  this.video.src({
		 //  	  		  src:this.baseURL + '/webInfoVideo/' + nextAddress + '/' + nextAddress,
		 //  	  		  type: 'application/x-mpegURL' //在重新添加视频源的时候需要给新的type的值
		 //  	  		})
			//  if(curIndex == this.index){
			// 	this.$parent.$parent.$refs.scroll.scrollTo(0,this.$parent.$parent.currentHeight)
			// 	 this.video.play()
			// 	 // 加载收藏和评论数量
			// 	 this.loadCommentAndCollectionNum();
			// 	this.stopProcess()
			// 	this.startProcess();
			// 	 // 延迟0.5秒,等待滚动事件加载完成
			// 	 // setTimeout(()=>{
			// 		//  this.$parent.$parent.currentHeight = 0
			// 	 // },1000)

			//  }
		    
		 //  }
	  // })
	 
  },
  data () {
    return {
		// replayUserData: '',
		// to_comment_id: '',
		// commentPop: false,//是否展示评论弹框
		// // 评论相关
		// comment_text: '',//评论输入内容
		// canSend: false,//是否可以发送
		// videoComment: [],
		// commentPlaceholder: '留下你精彩的评论吧',//评论Placeholder
		commentNum:0, // 评论数
		collNum: 0,// 收藏数
	  collStatus:false, // 是否收藏状态,收藏状态显示加载图标
		token: 'Bearer ' + localStorage.token, // 用户token
      // baseURL,
      like: this.VideoItem.collection == '是',
      likeNum: this.VideoItem.likeNum,
	  video: null,
	  playStatus:true ,// 播放状态,默认播放
	  videoProcess:0 ,// 进度条位置
	  maxVideoProcess: 0, // 当前视频长度
	  videoProcessInterval:null
    }
  },
  computed: {
    isHome () {
      return this.$route.name === 'home'
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
      'isLogged',
      'loginInfo'
    ])
  },
  methods: {
	  //获取评论
	  // async getComment() {
		 //  //setTimeout模拟Ajax请求
		 //  // setTimeout(() => {
			// // 获取评论数据
			// const res = await this.$http.get("/comment/queryComment?work_id=" + this.getVideo().id)
			// // const res = await this.$http.get("/comment/queryComment?work_id=4853011")
			// // console.log(res)
			// let data = res.data.data
			// this.commentNum = data.length
			// //获取评论数据
			//   // this.videoComment = [...this.videoComment, ...data];
			// this.videoComment = [ ...data];
			//   let to_comment_id = this.to_comment_id;
			//   if (to_comment_id != 0) {
			// 	  //从评论列表进来回复
			// 	  this.getCommentDetail(to_comment_id);
			//   }
		 //  // }, 500)
	  // },
	  //获取单个评论
	  getCommentDetail(to_comment_id) {
		// console.log('......' + to_comment_id)
		  let obj = {
			  action: 'show_comment_info',
			  comment_id: to_comment_id
		  };
		  setTimeout(() => {
			  let index;
			  let item = res.data;
			  this.videoComment.map((v, i) => {
				  v.child_comment.map((v2, i2) => {
					  if (v2.comment_id == to_comment_id) {
						  index = i;
					  }
				  });
			  });
			  setTimeout(() => {
				  //对评论重新排序，存在to_comment_id的时候排至第一个
				  let firstComment = this.videoComment.splice(index, 1);
				  this.videoComment.unshift(firstComment[0]);
				  //重设回复人
				  item.index = 0;
				  item.index2 = 0;
				  this.replayUserData = item;
				  this.commentPlaceholder = `回复 @${item.nickname}：`;
				  this.$refs.content.focus();
			  }, 10)
		  }, 500)
	  },
	  //检测评论内容
	  checkComment() {
		  if (this.comment_text == '') {
			  this.$msg.fail('评论内容不能为空')
		  } else {
			  let comment_id = 0, p_id = '', p_user_id = '', content = this.comment_text;
			  if (this.replayUserData != '') {
				  comment_id = this.replayUserData.comment_id;
				  p_id = this.replayUserData.p_id;
				  p_user_id = this.replayUserData.user_id;
			  }
			  this.sendComment(comment_id, p_id, p_user_id, content)
		  }
	  },
	  //发送评论
	  async sendComment(comment_id, p_id, p_user_id, content) {
		  this.comment_text = '';
		  this.isSending = true;
		const res = await this.$http.post('/comment/addComment',{
			workId:this.VideoItem.id,
			// workId:'4853011',
			commentType:'OTHER',
			be_commented_user_id:p_user_id ? p_user_id : 0,
			content:content,
			parentId:p_id
		})
		// console.log(res.data)
		if(res.data.data == '评论成功'){
			this.replayUserData = '';
			this.isSending = false;
			// 清空回复
			this.commentPlaceholder = '留下你精彩的评论吧';
			this.replayUserData = '';
			// 刷新评论数据
			this.getComment()
		}else {
			this.$msg.fail(res.data.data)
		}
		  // setTimeout(() => {
		  //     let newData = {
		  //         "comment_id": comment_id,
		  //         "p_id": p_id,
		  //         "comment_content": content,
		  //         "love_count": 0,
		  //         "create_time": "刚刚",
		  //         "user_id": p_user_id,
		  //         "nickname": "游客",//当前用户
		  //         "avatar": 'https://profile.csdnimg.cn/B/1/E/3_ridingfish',//当前用户头像
		  //         "be_commented_user_id": this.replayUserData.user_id,
		  //         "be_commented_nickname": this.replayUserData.nickname,
		  //     }
		  //     if (this.replayUserData == '') {
		  //         //回复作品
		  //         this.videoComment.splice(0, 0, newData)
		  //     } else {
		  //         let index = this.replayUserData.index;
		  //         let index2 = this.replayUserData.index2;
		  //         if (this.replayUserData.index2 == -1) {
		  //             //回复一级人
		  //             this.videoComment[index].child_comment.splice(0, 0, newData)
		  //         } else {
		  //             //回复二级人
		  //             this.videoComment[index].child_comment.splice(index2, 0, newData)
		  //         }
		  //     }
		  //     this.replayUserData = '';
		  //     this.isSending = false;
		  // }, 500)
	  },
	  //评论点赞
	  commentLove(item, index, index2) {
		  let comment_id = item.comment_id,
			  user_id = item.user_id,
			  love_comment = item.love_comment,
			  love_flag = 0;//0:取消点赞；1：点赞
		  if (love_comment) {
			  //取消点赞
			  love_flag = 0
		  } else {
			  //添加点赞
			  love_flag = 1
		  }
		  //setTimeout模拟Ajax请求
		  setTimeout(() => {
			  if (index2 == -1) {
				  //点赞一级评论
				  this.videoComment[index].love_comment = !this.videoComment[index].love_comment;
				  if (love_flag == 1) {
					  this.videoComment[index].love_count++
				  } else {
					  this.videoComment[index].love_count--
				  }
			  } else {
				  //点赞二级评论
				  this.videoComment[index].child_comment[index2].love_comment = !this.videoComment[index].child_comment[index2].love_comment
				  if (love_flag == 1) {
					  this.videoComment[index].child_comment[index2].love_count++
				  } else {
					  this.videoComment[index].child_comment[index2].love_count--
				  }
			  }
		  }, 500)
	  },
	  //点击回复
	  replayUser(item, index, index2) {
		  item.index = index;
		  item.index2 = index2;
		  this.replayUserData = item;
		// console.log(item)
		// 下级回复设置Pid为回复的数据id
		if(!this.replayUserData.p_id || this.replayUserData.p_id == 0){
			this.replayUserData.p_id = this.replayUserData.id
		}

		  this.commentPlaceholder = `回复 @${item.nickname}：`;
		  this.$refs.content.focus();
	  },
	  //弹出评论窗口
	  changeComment() {
		  this.$parent.$parent.commentPop = true;
		  this.$parent.$parent.videoComment = [];
		  this.$parent.$parent.getComment(this.getVideo())
	  },
	  //关闭评论弹窗
	  closeComment() {
		  this.commentPop = false;
		  this.commentPlaceholder = '留下你精彩的评论吧';
		  this.replayUserData = '';
	  },
	  // 显示评论窗口
	  showComment(){
		  
	  },
	  //记录播放进度
	  changeProcess() {
		  // console.log(this.$refs['videoPlayer'])
		// console.log('记录播放。。。。')
		// top.a = this.$refs
		  let video = this.getVideo()
		  let currentTime = video.currentTime.toFixed(1);
		  // console.log(currentTime)
		  let duration = video.duration.toFixed(1);
		  this.videoProcess = parseInt((currentTime / duration).toFixed(2) * 100)
	  },
	  // 开始计时
	startProcess(){
		this.maxVideoProcess = this.getVideo().currentTime // 记录当前视频长度
		this.videoProcessInterval = setInterval(() => {
			// video.style.visibility = 'visible'
			this.changeProcess(this.getVideo())
		}, 100)
	},
	// 停止计时
	stopProcess(){
		// 视频时间重置
		let video = this.getVideo();
		video.currentTime = 0;
		this.videoProcess = 0
		clearInterval(this.videoProcessInterval)
	},
	getVideo(){
		return $('#'+this.VideoItem.id+'_html5_api')[0]
	},
	// 获取评论收藏数量
	async loadCommentAndCollectionNum(){
		// const res = await this.$http.get('/comment/queryCommentNumByWorkId?workId=4853011')
		const res = await this.$http.get('/comment/queryCommentNumByWorkId?workId=' + this.VideoItem.id)
		// console.log(res)
		// console.log(res)
		if(res.data){
			this.commentNum = res.data.commentNum
			this.collNum = res.data.collNum
		}

	},
	  // 开始拖动,暂停播放
		dragStart(e){
			clearInterval(this.videoProcessInterval)
			if(!this.iconPlayShow){
				this.playvideo()
			}

			// console.log('开始拖动')
		},
		// 结束拖动
		dragEnd(e){
			// console.log('结束拖动')
		},
		// 进度条变化触发,用于获取位置，显示当前时间
		dragInput(value){
			// console.log(value)
			clearInterval(this.videoProcessInterval)
			// if(!this.iconPlayShow){
			// 	this.playvideo()
			// }
			// 
		},
		// 进度条变化,且结束时候触发,用于加载当前位置视频
		dragChange(value){
			// alert(value)

			// let duration = document.querySelectorAll('video')[this.current].duration.toFixed(0);
			let video = this.getVideo()
			// console.log('拖动结束位置' + value)
			this.videoProcess = value
			video.currentTime = parseInt((video.duration * (value/100)).toFixed(2))
			// this.playvideo()
			this.startProcess()
		},
	  // 收藏数据
	  async collectionClick() {
	     if(localStorage.getItem('token')){
			 this.collStatus = true
	       // 判断显示状态,是收藏还是取消收藏
	       if(this.like){
	  		  const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.VideoItem.id})
	  		  if(res.data.data == '取消成功'){
	  			// this.videoList[this.current].fabulous = false
				this.like = !this.like
	  		  } else {
	  			 this.$msg.fail(res.data.message)
	  		  }
	       } else {
	  		 const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.VideoItem.id})
	  		 if(res.data.data == '收藏成功'){
	  		     // this.videoList[this.current].fabulous = true
				 this.like = !this.like
	  		 }else{
	  		     this.$msg.fail(res.data.message)
	  		 }
	       }
		   this.collStatus = false
	  	// 收藏后，重新加载收藏数据
			this.loadCommentAndCollectionNum()
	     }
	  },
    playHandler (e) {
      this.$emit('playVideo', e)
    },
    watchHandler () {
      this.$axios.get(`/api/user/${this.loginInfo.userId}/watch/${this.VideoItem.Video.videoId}`).then(res => {
      })
    },
    showCommentList (videoId, commentNum) {
      this.$emit('showCommentList', videoId, commentNum)
    },
	playVideo(){
		// 如果打开了评论窗口,点击失效
		if(this.commentPop){
			return;
		}
		// console.log(this.video)
		// top.a = this.video
		if(this.playStatus){
			this.video.pause()
		}else{
			this.video.play()
		}
		this.playStatus = !this.playStatus
	},
    toggleLike (videoId) {
      if (this.isLogged) {
        this.$axios.get(`/api/user/${this.loginInfo.userId}/triggerLike/${this.VideoItem.Video.videoId}`).then(res => {
          if (res.data.data.includes('取消')) {
            this.like = false
            this.likeNum--
          } else {
            this.like = true
            this.likeNum++
          }
          this.$socket.emit('sendTriggerLike', {
            fromUserId: this.loginInfo.userId,
            toUserId: this.VideoItem.Video.userId
          })
        })
      }
    },
    chooseUser () {
      this.$router.push(`/profile/${this.VideoItem.Video.userId}`)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.my-video
  position relative
  .icon_play
    position absolute
    top 44%
    right 0
    left 0
    bottom auto
    margin auto
    z-index 999
    height 60px
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  .input-bar
    border-top .5px solid $color-divide
    width 100%
    display flex
    height 44px
    position absolute
    bottom 0
    background rgba(26, 27, 32, 0)
    .input
      background rgba(26, 27, 32, 0)
      flex 1
      font-size $font-size-medium
      color $color-text
      padding-left 10px
      &:focus
        outline none
        border none
    .iconfont
      display flex
      justify-content center
      align-items center
      width 44px
  .video
    display block
    width 100%
    height 100%
  .text-wrap
    position absolute
    left 10px
    bottom 60px
    width 70%
    .name
      color $color-white
      margin-bottom 10px
    .desc
      font-size $font-size-medium
      color $color-text
  .side-bar
    position absolute
    right 10px
    bottom 120px
    display flex
    flex-direction column
    height 250px
    justify-content space-between
    .avatar
      position relative
      border-radius 50%
      background none
      border 1px solid $color-text
      img
        border-radius 50%
      .follow
        text-align center
        position absolute
        bottom 0
        left 50%
        transform translateX(-50%) translateY(50%)
        width 16px
        height 16px
        font-size 16px
        border-radius 50%
        background rgb(252, 52, 93)
    .like
      position relative
      .likenum
        font-size $font-size-small-s
        position absolute
        bottom -5px
        left 50%
        transform translateX(-50%) translateY(100%)
        color $color-text
    .red-heart
      color rgb(248, 53, 95)
    .comment
      position relative
      .commentnum
        font-size $font-size-small-s
        position absolute
        bottom -5px
        left 50%
        transform translateX(-50%) translateY(100%)
        color $color-text
    .share
      position relative
      .sharenum
        font-size $font-size-small-s
        position absolute
        bottom -5px
        left 50%
        transform translateX(-50%) translateY(100%)
        color $color-text
  .side-bar > div
    width 40px
    height 40px
    font-size 40px
    color $color-text
    transition color .3s
	
body{
		width:100%;
	}
	.vjs-loading-spinner:after {
	    content: none;
	}
    .clear {
        clear: both;
    }

    .back_i {
        position: fixed;
        top: 20px;
        left: 10px;
        width: 28px;
        z-index: 10;
    }


    .video-player {
        height: 100vh;
        width: 100vw;
    }

    .product_swiper {
        width: 100vw;
        height: 100vh;
		position:relative;
    }

    .van_swipe {
        width: 100vw;
        height: 100vh;
        /* max-width: 550px; */
        margin: 0 auto;
        position: relative;
    }

    .van-swipe {
        width: 100%;
        height: 98%;
    }

    .container_box {
        /* width: 100vw; */
		width:100%;
        height: 100vh;
        background: #000;
    }

    .video_box {
        /*object-fit: fill !important;*/
        /*z-index: 999;*/
		height:100%;
        width: 100%;
    }

    video {
        /* object-position: 0 0; */
		/* height:100%; */
		/* width:100%;	 */
		/* margin-top: 73%; */
		/* position: absolute;
		transform: translate(-50%, -50%);
		top: 50%;
		bottom: 50%; */
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
    }

    .icon_play {
        position: absolute;
        top: 44%;
        right: 0;
        left: 0;
        bottom: auto;
        margin: auto;
        z-index: 999;
        height: 60px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
    }

    .play,
    .platStart {
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
    }

    /*头像， 点赞，转发 */
    .tag_image {
        width: 50px;
        height: 50px;
        border: 1px solid #fff;
        box-sizing: border-box;
        border-radius: 50%;
        margin-bottom: 20px;
        position: relative;
        box-shadow: 0px 0px 10px #9d9d9d;
    }

    .tag_add {
        position: absolute;
        bottom: 12px;
        left: 0;
        right: 0;
        border-radius: 67px;
        display: inline-block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        margin: 0 auto;
        z-index: 1;
        font-size: 20px;
        color: #f44;
        background: #fff;
    }

    .tag_dui {
        position: absolute;
        bottom: 12px;
        left: 0;
        right: 0;
        border-radius: 67px;
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin: 0 auto;
        z-index: 1;
        font-size: 11px;
        color: #f44;
        background: #fff;
    }

    .tag_dui_active {
        opacity: 0;
        animation: showFollow 1.4s ease-in-out 0s;
    }

    .tag_add_num {
        position: absolute;
        bottom: 0px;
        left: 0;
        right: 0;
    }

    @keyframes showFollow {
        0% {
            opacity: 1;
            color: #fff;
            background: #F44;
            transform: rotate(-180deg) scale(1);
        }
        35% {
            opacity: 1;
            color: #f44;
            background: #fff;
            transform: rotate(0deg) scale(1.2);
        }
        80% {
            opacity: 1;
            color: #f44;
            transform: scale(1.2);
        }
        100% {
            opacity: 0;
            display: none;
            color: #f44;
            transform: scale(0);
        }
    }

    .tools_right {
        z-index: 1001;
        position: absolute;
        right: 16px;
        bottom: 180px
    }

    .tools_r_li {
        margin-bottom: 20px;
        color: #fff;
        font-size: 14px;
        position: relative;
    }

    .tools_r_li:last-child {
        margin-bottom: 0px;
    }

    .icon_right {
        margin-bottom: 5px;
        font-size: 42px;
        display: block;
        text-shadow: 0px 0px 10px #9d9d9d;
        /*transition: .5s;*/
    }

    .production_box {
        z-index: 1001;
        position: absolute;
        /* right: 16px; */
        bottom: 48px;
        text-align: left;
        padding: 0 15px 15px 15px;
        color: #fff;
        width: 100%;
        left: 0;
        box-sizing: border-box;
        background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
        /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
        /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
        /* Firefox 3.6 - 15 */
        background: linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
        /* 标准的语法 */
    }

    .production_name {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 10px;
    }

    .production_des {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        min-height: 40px;
        font-size: 13px;

    }

	.production_length {
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 3;
	    -webkit-box-orient: vertical;
	    /* min-height: 62px; */
	    font-size: 14px;
		float: right;
	}

    .container_bottom {
		/* padding-bottom:5%; */
        position: fixed;
        bottom: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.85);
        height: 48px;
        /*border-top: 1px solid rgba(255, 255, 255, 0.7);*/
        /* max-width: 550px; */
    }

    .production_top {
        display: inline-block;
        padding: 6px;
        margin-bottom: 5px;
        background: rgba(0, 0, 0, .3);
        border-radius: 6px;
        margin-top: 5px;
    }

    .product_go {
        color: #fbdd21;
    }

    .production_title {
        margin-left: 4px;
    }

    .border_progress {
        width: 0;
        height: 1px;
        background: #bababa;
        position: absolute;
        top: 0;
        transition: .1s all;
    }

    .bottom_tab {
        width: 33%;
        text-align: center;
        float: left;
        color: #c9c9c9;
        padding: 10px 0;
    }

    .bottom_tab_icon {
        width: 44px;
    }

    .bottom_tab_span {
        line-height: 28px;
        border-bottom: 2px solid transparent;
        font-weight: 600;
        font-size: 16px;
        display: inline-block;
        padding: 0 4px;
        transition: .5s all;
    }

    .tab_active .bottom_tab_span {
        border-bottom: 2px solid #fff;
        color: #fff;
    }

    .icon-shoucang {
        transition: .5s all;
    }

    .fabulous_active {
        color: #f44;
        animation: showHeart .5s ease-in-out 0s;
    }

    /*animation-name：用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致*/
    /*animation-duration ：指定元素播放动画所持续的时间*/
    /*animatino-timing-function ： 和transition中的transition-timing-function 中的值一样。根据上面@keframes中分析的animation中可能存在多个小动画，因此这里的值设置是针对每一个小动画所在时间范围内的属性变换速率。*/
    /*animation-delay：定义在浏览器开始执行动画之前等待的时间，这里是指整个animation执行之前的等待时间，而不是上面说的多个小动画*/
    /*animation-iteration-count：定义动画的播放次数，其通常为整数，默认是1,；取值为infinite，动画将无限次的播放。*/
    /*animation-direction：主要用来设置动画播放方向*/
    @keyframes showHeart {
        0% {
            color: #f44;
            transform: scale(1);
        }

        25% {
            color: #fff;
            transform: scale(0);
        }

        80% {
            color: #f44;
            transform: scale(1.2);
        }

        100% {
            color: #f44;
            transform: scale(1);
        }
    }

    /*分享样式*/
    .share_hover {
        position: fixed;
        display: none;

    }

    .share_box {
        position: fixed;
        bottom: -300px;
        width: 100%;
        z-index: 1002;
        background: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        transition: .5s;
    }

    .share_tips {
        text-align: center;
        line-height: 38px;
        color: #333;
    }

    .share_ul {
        box-sizing: border-box;
        padding: 0 25px 25px;
        border-bottom: 1px solid #e8e8e8;
    }

    .share_li {
        float: left;
        width: 33%;
        text-align: center;
    }

    .share_li i {
        font-size: 44px;
    }

    .share_cancel {
        text-align: center;
        line-height: 48px;
        color: #777;
        text-align: center;
    }

    .pengyouquan {
        color: #47D000;

    }

    .pengyouquan_li {
        animation: rotating 8s linear infinite
    }

    @keyframes rotating {
        from {
            transform: rotate(0)
        }

        to {
            transform: rotate(360deg)
        }
    }

    .weixin {
        color: #20CA2E;
    }

    .lianjie {
        color: #cdcdcd;
    }

    .share_active {
        bottom: 0px;
    }

    /*评论样式*/
    ::-webkit-input-placeholder {
        color: rgba(0, 0, 0, 0.20);
    }

    :-moz-placeholder {
        color: rgba(0, 0, 0, 0.20);;
    }

    ::-moz-placeholder {
        color: rgba(0, 0, 0, 0.20);
    }

    :-ms-input-placeholder {
        color: rgba(0, 0, 0, 0.20);
    }

    .comment_container {
        width: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .comment_box {
        padding: 0 15px 52px 15px;
    }

    .comment_top {
        text-align: center;
        font-size: 12px;
        color: #000;
        line-height: 40px;
    }

    .guanbi3 {
        float: right;
        font-size: 12px;
        padding: 0 10px;
        position: absolute;
        right: 6px;
    }

    .comment_li {
        margin-bottom: 20px;
        font-size: 14px;
        text-align: left;
    }

    .comment_author_left {
        float: left;
    }

    .comment_author_left img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
    }

    .comment_author_right {
        margin-left: 46px;
        padding-top: 4px;
    }

    .comment_author_top {
        position: relative;
    }

    .comment_author_name {
        margin-bottom: 6px;
        color: #777;
    }

    .icon-shoucang1_box {
        position: absolute;
        right: 0px;
        top: 0;
        text-align: center;
        color: #777;
    }

    .comment_author_text {
        color: #555;
        margin-bottom: 10px;
        padding-right: 35px;
    }

    .comment_replay_box {
        padding-left: 46px;
        box-sizing: border-box;
    }

    .comment_replay_li {
        margin-bottom: 10px;
    }

    .comment_replay_left {
        float: left;
    }

    .comment_replay_left img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
    }

    .comment_replay_right {
        margin-left: 35px;
        padding-top: 2px;
    }

    .comment_replay_top {
        position: relative;
        margin-bottom: 6px;
    }

    .comment_replay_text {
        padding-right: 35px;
        margin-bottom: 10px;
        color: #555;
    }

    .comment_author_text span, .comment_replay_text span {
        color: #999;
        font-size: 13px;
        margin-left: 6px;
    }

    .shoucang1_num {
        text-align: center;
        width: 30px;
        font-size: 12px;
        /* right: -4px; */
        position: relative;
    }

    .comment_ul {
        height: 400px;
        overflow-y: auto;
    }

    .comment_input_box {
        position: fixed;
        bottom: 0;
        z-index: 2999;
        width: 100%;
        border-top: 1px solid #e8e8e8;
        background: #fff;
        padding: 10px 15px;
        box-sizing: border-box;
    }

    /*.comment_form {*/
    /**/
    /*}*/

    .comment_input {
        border: none;
        resize: none;
        width: 80%;
        float: left;
        color: #555;
        caret-color: #f44;
        line-height: .44rem;
    }

    .comment_input_right {
        float: right;
    }

    .comment_i {
        font-size: 22px;
        color: #999;
        transition: .3s;
    }

    .comment_i_active {
        color: #f44;
    }

    .icon-zanwupinglun {
        font-size: 100px;
        color: #777;
    }

    .v-enter,
    .v-leave-to {
        opacity: 0;
        transform: translateY(80px);
    }

    .v-enter-active,
    .v-leave-active {
        transition: all .5s ease;
    }

    /*添加进场效果*/
    .v-move {
        transition: all 1s ease;
    }

    .v-leave-active {
        position: absolute;
    }

    .list-complete-item {
        transition: all 1s;
        display: inline-block;
        margin-right: 10px;
    }

    .list-complete-enter, .list-complete-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .list-complete-leave-active {
        position: absolute;
    }

    .love_active {
        color: #f44;
    }
	.play, .platStart{
		position: fixed;
		    margin: auto;
		    top: 0;
		    left: 0;
		    z-index: 999;
		    width: 100%;
		    height: 100%;
		    border: none;
	}
	/* .van-swipe-item{
		position: relative;
		    -webkit-flex-shrink: 0;
		    flex-shrink: 0;
		    width: 100%;
		    height: 100%;
			width: 300px;
	} */
	/* .van-swipe div{
			-webkit-transform: inherit;
	} */
    /*评论样式*/
	.production_center{
		verflow: hidden;
		    text-overflow: ellipsis;
		    display: -webkit-box;
		    -webkit-line-clamp: 3;
		    -webkit-box-orient: vertical;
		    /* min-height: 62px; */
		    font-size: 14px;
			float:left;
	}
	@media screen and (width: 375px) and (height: 812px){
	    .button {
	        padding-bottom: 34px;
	    }
	}

	/* 适配iphoneX顶部填充*/
	@supports (top: env(safe-area-inset-top)){
	  body,
	  .header{
	      padding-top: constant(safe-area-inset-top);
	      padding-top: env(safe-area-inset-top);
	  }
	}
	/* 判断iphoneX 将 footer 的 padding-bottom 填充到最底部 */
	@supports (bottom: env(safe-area-inset-bottom)){
	    body,
	    .footer{
	        padding-bottom: constant(safe-area-inset-bottom);
	        padding-bottom: env(safe-area-inset-bottom);
	    }
	}
	/* iphone x / xs / 11 pro*/
	@media only screen and (device-width: 375px) and (device-height: 690px) and (-webkit-device-pixel-ratio: 3) {
	    header{
	        padding-top: 44px;
	    }
	    footer {
	        padding-bottom:34px;
	    }
	}
	/* iphone xr / 11 */
	@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {

	}
	/* iphone xs max / 11 pro max */
	@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {

	}
	body{
		margin:0;
		padding:0;
	    padding-top: env(safe-area-inset-top);
	    padding-left: env(safe-area-inset-left);
	    padding-right: env(safe-area-inset-right);
	    padding-bottom: env(safe-area-inset-bottom);
	}
	/* .van-toast{
		position: fixed;
		    top: 50%;
		    left: 50%;
		    display: -webkit-box;
		    display: -webkit-flex;
		    display: flex;
		    -webkit-box-orient: vertical;
		    -webkit-box-direction: normal;
		    -webkit-flex-direction: column;
		    flex-direction: column;
		    -webkit-box-align: center;
		    -webkit-align-items: center;
		    align-items: center;
		    -webkit-box-pack: center;
		    -webkit-justify-content: center;
		    justify-content: center;
		    box-sizing: content-box;
		    width: 88px;
		    max-width: 70%;
		    min-height: 88px;
			z-index:99999;
		    padding: 16px;
		    color: #fff;
		    font-size: 14px;
		    line-height: 20px;
		    white-space: pre-wrap;
		    text-align: center;
		    word-wrap: break-word;
		    background-color: rgba(50,50,51,.88);
		    border-radius: 4px;
		    -webkit-transform: translate3d(-50%,-50%,0);
		    transform: translate3d(-50%,-50%,0);
	} */
/* 	. van-toast--middle{
		z-index:99999;
	}
	#app{
		z-index:200;
	} */
</style>
