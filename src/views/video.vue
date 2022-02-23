<template>
	<div class="searchWrap">
		<header></header>
		<!-- 查询按钮 -->
		<van-icon name="search" size="24" color="white" style="position: absolute;
		    top: 0rem;z-index:1550;padding:1rem;
			
		    right: 0rem;" @click.stop="toQuery"/>
		，
			<!-- 返回按钮 -->
		<van-icon name="arrow-left" size="24" color="white" style="position: absolute;
			top: 0rem;z-index:1550;padding:1rem;
			left: 0rem;" @click.stop="returnPage"/>
		<div class="play-list">
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
					:bottomComment="false"
				  @playVideo="playHandler"
				  :VideoItem="item"
				  @showCommentList="fetchCommentsAndShowList"></my-video>
			  </div>
			  <!--留言弹窗-->
			  <comment ref="comment" @commentNum="getCommentNum" ></comment>
			</scroll>
			<footer>
			<!--底部操作栏-->
				<div class="container_bottom" v-show="bottomShow">
					<div class="bottom_tab" :class="tabIndex==0?'tab_active':''" @click="changeTab(0)">
						<span class="bottom_tab_span " @click="home">首页</span>
					</div>
					<div class="bottom_tab" :class="tabIndex==1?'tab_active':''" @click="changeTab(1)">
						<img @click="message('暂未开放')" src="http://oss.jishiyoo.com/images/file-1575427746903.png" alt="" class="bottom_tab_icon">
					</div>
					<div class="bottom_tab" :class="tabIndex==2?'tab_active':''" @click="changeTab(2)">
						<span @click="message('暂未开放')" class="bottom_tab_span">我的</span>
					</div>
				</div>
			</footer>
			</div>

	</div>
</template>
<script>
// import PlayList from '@/components/PlayList/PlayList'
import comment from '@/components/comment'
import Scroll from '@/base/scroll/scroll'
import MyVideo from '@/components/MyVideo/MyVideo'
	// import videoelement from '../components/videoelement.vue'
    // import Vue from "vue";
    // // import {
    // //     Swipe,
    // //     SwipeItem,
    // //     Toast,
    // // } from 'vant';
    // // // 引入微信分享
    // // // import wx from "weixin-js-sdk";
    // // Vue.use(Swipe, Toast).use(SwipeItem);


    let videoProcessInterval;
	document.addEventListener("webkitfullscreenchange", function (e) {
	  if ($('.playerVideo').videoWidth < $('.playerVideo').videoHeight) {
	    flag = !flag;
	    if (flag) {
	      $('.playerVideo').css('object-fit', 'fill')
	    } else {
	      $('.playerVideo').css('object-fit', 'contain')
	    }
	  }
	});
    export default {
        name: 'home',
        data() {
            let u = navigator.userAgent;
            return {
				bottomShow:true, // 是否显示底部菜单
				currentY: 0,
				// showCommentList: false,
				// commentNum: 0,
				// commentList: [],
				page: 0,
				currentCommentVideoId: '',
				isEnd: false,
				timer: null,
				currentHeight : 0, // 当前高度
				pageNum:1, // 第一页
				// pageSize:5,// 一次五个视频
				pageSize:10,
				playStatus:true, // 播放状态
                current: 0,
				playList:[],
				curVideoTime:0, // 当前视频时长

                isVideoShow: true,
                // playOrPause: true,
				playOrPause: true,
                // video: null,
                // iconPlayShow: true,
				iconPlayShow: false,
                isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
                isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                tabIndex: 0,
                showShareBox: false,//展示分享框
                commentPop: false,//是否展示评论弹框
                // 评论相关
                comment_text: '',//评论输入内容
                canSend: false,//是否可以发送
                videoComment: [],
                commentPlaceholder: '留下你精彩的评论吧',//评论Placeholder
                replayUserData: '',
                to_comment_id: '',
                videoProcess: 0,//视频播放进度
				commentNum:0 ,// 收藏数
				maxVideoProcess: 0, // 当前视频长度
            }
        },
		created(){
			
			this.loadData()

		},
		components:{
			comment,
			Scroll,
			MyVideo
			
			// videoelement
		},
   //      watch: {
   //          //监听输入变化
   //          comment_text(newV, oldV) {
   //              newV == '' ? this.canSend = false : this.canSend = true
   //          },
			// commentPop(newV, oldV) {
			// 	if(!newV){
			// 		this.closeComment()
			// 		setTimeout(()=>{
			// 			this.bottomShow = true
			// 		},200)
			// 	}else{
					
			// 			this.bottomShow = false
					
					
			// 	}
			// }
   //      },
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
		computed: {
		  clientHeight () {
		    return document.body.clientHeight
		  },
		  VideoItemHeightStyle () {
		    let clientWidth = document.body.clientWidth
		    let clientHeight = document.body.clientHeight
		    return {
		      // height: clientHeight + 'px',
			  height: '200px',
		      width: clientWidth + 'px'
		    }
		  }
		},
        mounted() {

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
			toQuery(){
				let index = this.currentY / this.clientHeight
				this.$refs.videos[index].stopProcess()
				this.$router.push('/videosearch')
			},
			returnPage(){
				let index = this.currentY / this.clientHeight
				this.$refs.videos[index].stopProcess()
				this.$router.push('/home')
			},
			scroll (pos) {

			  if(this.currentHeight > 0){
				  return;
			  }
			  // 如果打开了评论,不触发滑动
			  let index = this.currentY / this.clientHeight
			  let clientHeight = this.clientHeight
			  // let commentPop = this.$refs.videos[index].commentPop
			  
			  // if(commentPop){
				 //  return;
			  // }
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
			scrollEnd (pos) {
				// 结束将当前高度设置为0
				let totalHeight  = -(this.clientHeight * (this.playList.length - 1)) // 总高度
				if(pos.y == totalHeight){
					// console.log(this)
					// console.log('滑到最下面》。。。。。。。。。')
					this.pageNum = this.pageNum + 1
					this.loadData()
					// this.$parent.$children[0].queryData()
				}
				// 滑到最底下加载新数据
				// console.log(this.playList)
				if(this.currentHeight > 0){
					this.$refs.scroll.scrollTo(0, -this.currentHeight)
					this.currentHeight = 0
					
				}
			
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
			// changeVideo(type){
			// 	// console.log('切换视频')
			// 	if(!this.$refs.videos){
			// 		return;
			// 	}
			// 	// 切换视频,所有进度归0
			// 	if(this.currentY == 0){
			// 		if(this.$refs.videos[1]){
			// 			// 暂停上个视频
			// 			this.$refs.videos[1].video.pause()
			// 		}
			// 		if(this.$refs.videos[0].video){
			// 			this.$refs.videos[0].playStatus = true
			// 			this.$refs.videos[0].video.el().getElementsByTagName('video')[0].currentTime = 0
			// 			this.$refs.videos[0].video.play()
			// 		}else{
			// 			// 创建视频
			// 			this.$refs.videos[0].createVideo()
			// 		}
			
			// 		return;
			// 	}
			// 	// 获取高度,以及y轴高度,还有视频数量总高度
			// 	let clientHeight = this.clientHeight
			// 	let index = this.currentY / clientHeight
			// 	// 暂停上个视频
			// 	if(type == 1){
			// 		// this.currentHeight = clientHeight * (index + 1)
			// 		if(this.$refs.videos[index -1 ].video){
			// 			this.$refs.videos[index -1 ].video.pause()
			// 			// this.$refs.videos[index -1 ].video.removeAttribute('src');
			// 		}/*else{
			// 			this.$refs.videos[index -1].createVideo()
			// 		}*/
			
			// 	}
			// 	// 暂停下个视频
			// 	if(type == 2){
			// 		if(this.$refs.videos[index +1 ].video){
			// 			this.$refs.videos[index + 1].video.pause()
			// 			// this.$refs.videos[index + 1 ].video.removeAttribute('src');
			// 		}/*else{
			// 			this.$refs.videos[index +1].createVideo()
			// 		}*/
			
			// 	}
			// 	this.currentHeight = clientHeight * index
			// 	if(this.$refs.videos[index].video){
			// 		this.$refs.videos[index].playStatus = true
			// 		this.$refs.videos[index].video.el().getElementsByTagName('video')[0].currentTime = 0
			// 		this.$refs.videos[index].video.play()
			// 		this.$refs.videos[index].loadCommentAndCollectionNum(); // 加载评论和收藏数
			// 		// 停止记录进度条，重新记录
			// 		this.$refs.videos[index].stopProcess()
			// 		this.$refs.videos[index].startProcess()
			// 	}else{
			// 		this.$refs.videos[index].createVideo()
			// 	}
			
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
				let videoLength = this.playList.length// 视频数据
				// console.log('视频总数' + videoLength)
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
						// console.log('结束视频' + endLength)
						this.$refs.videos[endLength].video.dispose()
						this.$refs.videos[endLength].video = null;
					}
					endLength += 1
				}
			
			},
			// 开始拖动,暂停播放
			dragStart(e){
				clearInterval(videoProcessInterval)
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
				clearInterval(videoProcessInterval)
				if(!this.iconPlayShow){
					this.playvideo()
				}
			},
			// 进度条变化,且结束时候触发,用于加载当前位置视频
			dragChange(value){
				// alert(value)
				// let duration = document.querySelectorAll('video')[this.current].duration.toFixed(0);
				let video = document.querySelectorAll('video')[this.current]
				// console.log('拖动结束位置' + value)
				this.videoProcess = value
				video.currentTime = parseInt((video.duration * (value/100)).toFixed(2))
				this.playvideo()
				this.startProcess()
			},
			noSleep () {
			    let noSleep = new this.$NoSleep();
			    document.addEventListener('click',
			      function enableNoSleep () {
			        noSleep.enable();
			        document.removeEventListener('click', enableNoSleep, false);
			      },
			      false);
			  },
			// 收藏数据
			async collectionClick() {
			   if(localStorage.getItem('token')){
			     // 判断显示状态,是收藏还是取消收藏
			     if(this.videoList[this.current].fabulous){
					  const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.videoList[this.current].id,collectionType:'1'})
					  if(res.data.data == '取消成功'){
						this.videoList[this.current].fabulous = false
					  } else {
						 this.$msg.fail(res.data.message)
					  }
			     } else {
					 const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.videoList[this.current].id,collectionType:'1'})
					 if(res.data.data == '收藏成功'){
					     this.videoList[this.current].fabulous = true
					 }else{
					     this.$msg.fail(res.data.message)
					 }

			     }
				// 收藏后，重新加载收藏数据
				this.loadCollection()
			   }
			},
			message(msg){
				this.$msg.fail(msg)
			},
			// 点击首页,直接刷新页面
			home(){
				location.reload()
				// this.stopProcess()
				// this.$parent.videoStatus = false
				// this.$nextTick(()=>{
				// 	this.$parent.videoStatus = true
				// })
				// this.$router.go(0)
				// clearInterval(videoProcessInterval)
				// this.stopProcess()
				// this.current = 0
				// this.pageNum = 1;
				// this.isVideoShow= true,
				// // playOrPause: true,
				// this.playOrPause=true,
				// // video: null,
				// // iconPlayShow: true,
				// this.iconPlayShow = false,
				// this.videoList = [];
				// // location.reload();

				// setTimeout(()=>{
				// 	this.loadData()
				// },500)

			},
			onSwipeup(){
				// console.log(this.videoList.length)
				// console.log(this.current)
				// // 向上滑动判断是否视频已经加载到最后,加载到最后加载新视频数据，然后滑动组件向下一个
				// if(this.videoList.length - 1 == this.current){
				// 	// 提示加载数据
				// 	this.loadData()
				// }
			},
			showloading() {
			    var title = "加载中···";
			    this.$showLoading({
			      title: title
			    });
			  },

			  hideloading() {
			    this.$cancelLoading();
			  },
			 // 获取收藏数据
			async loadCollection(){
				// 判断是否已经有收藏数据,有收藏数据不请求,直接获取之前的展示
				const res = await this.$http.get("/collection/queryCollTotalAndUserStatus?webInfoDetailDataId=" + this.videoList[this.current].id + "&collectionType=1")
				// this.videoList[this.current].fabulous = res.data.userStatus && res.data.userStatus > 0 ? true : false
				// console.log(res.data.collectionNum)

				if(res.data.userStatus){
					this.videoList[this.current].fabulous = true
				}else {
					if(res.data.userStatus > 0){
						this.videoList[this.current].fabulous = true
					} else {
						this.videoList[this.current].fabulous = false
					}
				}
				this.videoList[this.current].collNum = res.data.collectionNum
				// console.log(this.videoList[this.current])
			},
			async loadData(fun){
				this.$msg.loading({
				  message: '加载中...',
				  forbidClick: true,
				  loadingType: 'spinner'
				});
				
				// this.showloading()
				const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
				  // typeId: categoryitem.CODE_VALUE,
				  pageNum: this.pageNum,
				  pageSize: this.pageSize,
				  // loadMode:'5',
				  loadMode:'4',
				  search: ''
				})
				// console.log(res)
				// // 追加数据
				if(res.data.data.list.length == 0) {
					this.$msg.fail('没有更多了...')
					return;
				}
				this.playList = this.playList.concat(res.data.data.list)
				this.$msg.clear()
				// 判断,如果是第一个索引,判断视频是否创建,没创建进行创建
				this.$nextTick(()=>{
					if(this.currentHeight == 0){
						if(!this.$refs.videos[0].video){
							this.$refs.videos[0].createVideo()
						}
					}
				})

				// 把之前页的视频都清了,减少内存
				// if(this.pageNum > 1){
				// 	// let index = this.currentY / clientHeight
				// 	let index = this.playList.length - this.pageNum - 3
				// 	for(let i=0;i<index;i++){
				// 		// console.log(i)
				// 		// console.log(this.$refs.videos[i].video.el())
				// 		// this.$refs.videos[i].video.dispose()
				// 	}

				// }

			},
			onSwipeLeft (a) {
				console.log('左滑.....')
				console.log(a)
				// table + 1
				// console.log(this.$parent.category.length)
				// if(this.$parent.category.length ==  this.$parent.active + 1){
				// 	return;
				// }
				// this.stopProcess()
				// // clearInterval(videoProcessInterval)
				// this.$parent.active += 1
				// this.$destroy()
			},
			onSwipeRight(a){
				console.log('右滑')
				console.log(a)
				// if(this.$parent.active == 0){
				// 	return;
				// }
				// // clearInterval(videoProcessInterval)
				// this.stopProcess()
				// this.$parent.active -= 1
				// this.$destroy()
				// console.log(a)
			},
    //         //获取评论
    //         async getComment(video) {
    //             //setTimeout模拟Ajax请求
    //             // setTimeout(() => {
				// 	// 获取评论数据
				// 	const res = await this.$http.get("/comment/queryComment?work_id=" + video.id)
				// 	// const res = await this.$http.get("/comment/queryComment?work_id=4853011")
				// 	// console.log(res)
				// 	let data = res.data.data
				// 	this.commentNum = data.length
				// 	//获取评论数据
				// 	  // this.videoComment = [...this.videoComment, ...data];
				// 	this.videoComment = [ ...data];
				// 	  let to_comment_id = this.to_comment_id;
				// 	  if (to_comment_id != 0) {
				// 		  //从评论列表进来回复
				// 		  this.getCommentDetail(to_comment_id);
				// 	  }
    //             // }, 500)
    //         },
    //         //获取单个评论
    //         getCommentDetail(to_comment_id) {
				// // console.log('......' + to_comment_id)
    //             let obj = {
    //                 action: 'show_comment_info',
    //                 comment_id: to_comment_id
    //             };
    //             setTimeout(() => {
    //                 let index;
    //                 let item = res.data;
    //                 this.videoComment.map((v, i) => {
    //                     v.child_comment.map((v2, i2) => {
    //                         if (v2.comment_id == to_comment_id) {
    //                             index = i;
    //                         }
    //                     });
    //                 });
    //                 setTimeout(() => {
    //                     //对评论重新排序，存在to_comment_id的时候排至第一个
    //                     let firstComment = this.videoComment.splice(index, 1);
    //                     this.videoComment.unshift(firstComment[0]);
    //                     //重设回复人
    //                     item.index = 0;
    //                     item.index2 = 0;
    //                     this.replayUserData = item;
    //                     this.commentPlaceholder = `回复 @${item.nickname}：`;
    //                     this.$refs.content.focus();
    //                 }, 10)
    //             }, 500)
    //         },
    //         //检测评论内容
    //         checkComment() {
    //             if (this.comment_text == '') {
    //                 this.$msg.fail('评论内容不能为空')
    //             } else {
    //                 let comment_id = 0, p_id = '', p_user_id = '', content = this.comment_text;
    //                 if (this.replayUserData != '') {
    //                     comment_id = this.replayUserData.comment_id;
    //                     p_id = this.replayUserData.p_id;
    //                     p_user_id = this.replayUserData.user_id;
    //                 }
    //                 this.sendComment(comment_id, p_id, p_user_id, content)
    //             }
    //         },
    //         //发送评论
    //         async sendComment(comment_id, p_id, p_user_id, content) {
    //             this.comment_text = '';
    //             this.isSending = true;
				// const res = await this.$http.post('/comment/addComment',{
				// 	workId:this.videoList[this.current].id,
				// 	// workId:'4853011',
				// 	commentType:'OTHER',
				// 	be_commented_user_id:p_user_id ? p_user_id : 0,
				// 	content:content,
				// 	parentId:p_id
				// })
				// // console.log(res.data)
				// if(res.data.data == '评论成功'){
				// 	this.replayUserData = '';
				// 	this.isSending = false;
				// 	// 清空回复
				// 	this.commentPlaceholder = '留下你精彩的评论吧';
				// 	this.replayUserData = '';
				// 	// 刷新评论数据
				// 	this.getComment()
				// }else {
				// 	this.$msg.fail(res.data.data)
				// }

    //         },
    //         //评论点赞
    //         commentLove(item, index, index2) {
    //             let comment_id = item.comment_id,
    //                 user_id = item.user_id,
    //                 love_comment = item.love_comment,
    //                 love_flag = 0;//0:取消点赞；1：点赞
    //             if (love_comment) {
    //                 //取消点赞
    //                 love_flag = 0
    //             } else {
    //                 //添加点赞
    //                 love_flag = 1
    //             }
    //             //setTimeout模拟Ajax请求
    //             setTimeout(() => {
    //                 if (index2 == -1) {
    //                     //点赞一级评论
    //                     this.videoComment[index].love_comment = !this.videoComment[index].love_comment;
    //                     if (love_flag == 1) {
    //                         this.videoComment[index].love_count++
    //                     } else {
    //                         this.videoComment[index].love_count--
    //                     }
    //                 } else {
    //                     //点赞二级评论
    //                     this.videoComment[index].child_comment[index2].love_comment = !this.videoComment[index].child_comment[index2].love_comment
    //                     if (love_flag == 1) {
    //                         this.videoComment[index].child_comment[index2].love_count++
    //                     } else {
    //                         this.videoComment[index].child_comment[index2].love_count--
    //                     }
    //                 }
    //             }, 500)
    //         },
    //         //点击回复
    //         replayUser(item, index, index2) {
    //             item.index = index;
    //             item.index2 = index2;
    //             this.replayUserData = item;
				// // console.log(item)
				// // 下级回复设置Pid为回复的数据id
				// if(!this.replayUserData.p_id || this.replayUserData.p_id == 0){
				// 	this.replayUserData.p_id = this.replayUserData.id
				// }

    //             this.commentPlaceholder = `回复 @${item.nickname}：`;
    //             this.$refs.content.focus();
    //         },
    //         //弹出评论窗口
    //         changeComment() {
    //             this.commentPop = true;
    //             this.videoComment = [];
    //             this.getComment()
    //         },
    //         //关闭评论弹窗
    //         closeComment() {
    //             this.commentPop = false;
    //             this.commentPlaceholder = '留下你精彩的评论吧';
    //             this.replayUserData = '';
    //         },
            //关注该作者
            checkSubscribe(item, index) {
                this.videoList.map(v => {
                    v.author_id == item.author_id ? v.tagFollow = true : '';
                })
            },
            //改变菜单
            changeTab(index) {
                this.tabIndex = index
            },
            //改变收藏状态
            changeFabulous(item, index) {
                this.videoList[index].fabulous = !this.videoList[index].fabulous
            },
            //展示分享弹窗
            changeShare() {
				this.$msg.fail('分享暂时关闭')
                // this.showShareBox = true
            },
            //取消分享
            cancelShare() {
                this.showShareBox = false
            },
			// 获取评论收藏数量
			async loadCommentAndCollectionNum(){
				// const res = await this.$http.get('/comment/queryCommentNumByWorkId?workId=4853011')
				const res = this.$http.get('/comment/queryCommentNumByWorkId?workId=' + this.videoList[this.current].id)
				// console.log(res)
				if(res.data){
					this.commentNum = res.data.commentNum
				}

			},
			setHeight(video){
				// console.log(video)
				let winHeight = document.body.clientHeight // 屏幕高度
				let vHeight = video.offsetHeight // 视频高度
				// 如果视频高度等于屏幕高度直接退出
				if(winHeight == vHeight) {
					return;
				}
				// 如果视频高度高出屏幕,将视频设置为100%
				if(vHeight > winHeight){
					video.style.height = winHeight +  'px'
					return;
				}
				// 屏幕高度减去视频高度,剩下的减少一半给视频,让其居中显示
				let height = (winHeight - vHeight)/2;
				// console.log(video.style.paddingTop)
				if(video.style.paddingTop == '' || video.style.paddingTop == null) {
					video.style.paddingTop = height + 'px'
				}

			}
			
        }
    }
</script>
<style  lang='stylus' scoped>
@import '~@/common/stylus/variable'
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
  background black
  .play-list
    position fixed
    z-index 1500
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
  .tab
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
    display flex
    .searchBar
      flex 1
      margin-right 10px
    .icon-left
      text-align center
      width 44px
      line-height 44px
  .search-list-wrap
    overflow hidden
    position absolute
    top 84px
    bottom 0
    width 100%

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
		/* z-index:2001; */
		z-index:1500;
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
		z-index:9999;
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
/* 	.iPhonex-style{ 
	 bottom:evn(safe-area-inset-buttom); 
	} */
</style>