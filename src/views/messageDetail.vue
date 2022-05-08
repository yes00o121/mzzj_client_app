
<template>
  <div class="searchWrap" style="background:white">
	   <div style="play-list">
	   <van-overlay :show="show" @click="overlayClick" />
      <!-- <nav-bar></nav-bar> -->
	  <van-sticky >
	  	<van-cell  style="z-index:999;width: 100%;" class="van-ellipsis" icon="arrow-left" :title="model.nickName"  @click="returnPage"/>
	  </van-sticky>
			<div :style="'-webkit-overflow-scrolling: touch;overflow:auto;height:'+(parseInt(windowHeight*0.8))+'px'" ref="scrollDiv">
			<!-- <div :style="'-webkit-overflow-scrolling: touch;overflow:auto;height:auto'" ref="scrollDiv"> -->
				<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" :style="'touch-action: pan-y!important;width:100%;height:'+windowHeight+'px'" :swipe-options="{direction: 'horizontal'}">
				  <van-pull-refresh v-model="isLoading" @refresh="onRefresh" ref="refreshRef">
					  <div style="font-size:12px;color:#969799;margin:1rem 0 1rem 0;" v-if="noData">没有更多了</div>
				<div class="van-swipe-cell" style="width: 100%;" v-for="(item,categoryindex) in list"  >
					<!-- 焦流日期 -->
					<div style="font-size:14px">
						{{item.create_time}}
					</div>
						  			<div class="van-swipe-cell__wrapper" style="transform: translate3d(0px, 0px, 0px); transition-duration: 0.6s;">
						  				<div class="goods-card van-card" >
											<div class="van-card__header">
						  						<a class="van-card__thumb" v-if="model.id == item.source_user_id">
						  							<div class="van-image" style="width: 100%; height: 100%;">
						  							
														<img src="@/assets/mzzj120.png" style="height:40px;width:40px" alt=""  v-if="item.source_user_name == '系统通知'">
														<van-image ref="workImage"  lazy-load :src="baseURL + '/common/image?imgId=' + item.icon +'&token=' + token" style="width:100%;width:45px" v-if="item.icon"/>
														<img src="@/assets/default_img.jpg" style="height:40px;width:40px" alt=""  v-if="item.source_user_name != '系统通知' && !item.icon">
						  							</div>
						  							<div class="van-info"></div>
						  						</a>
						  						<div class="van-card__content "  >
													<div class="van-card__tag">
														<span class="van-tag van-tag--mark van-tag--danger" v-show="categoryindex < 3" style="background:#ee0a24;color:#FEFFFF;border-radius:16px;" v-if="item.noReadNum">
															{{item.noReadNum}}
														</span>
													</div>
						  							<div>
														<div style="width:20%;height: 1rem;;" v-if="item.message_category == 'TEXT'"></div>
														<div :class="getContentPoint(item)"  v-if="item.message_type == 'COMMENT' || item.message_type == 'FORWARD'">
															
															<div v-if="item.message_category == 'VIDEO'" :style="(item.source_user_id == model.id ? 'text-align:left' : 'text-align:right')" @click="openVideo(item)">
																<div v-html="item.messageContent">

																</div>
															</div>
															<div  v-if="item.message_category == 'TEXT'"  >
																	<div class="van-tag--primary" v-html="item.messageContent" style="position:relative;word-wrap: break-word;padding: .5rem .5rem;border-radius: 12px;color:#fff"></div>
															</div>
						  								</div>
						  							</div>
						  						</div>
												<a class="van-card__thumb" v-if="model.id != item.source_user_id">
													<div class="van-image" style="width: 100%; height: 100%;">
													
														<img src="@/assets/mzzj120.png" style="height:40px;width:40px" alt=""  v-if="item.source_user_name == '系统通知'">
														<van-image ref="workImage"  lazy-load :src="baseURL + '/common/image?imgId=' + item.icon +'&token=' + token" style="width:100%;width:45px" v-if="item.icon"/>
														<img src="@/assets/default_img.jpg" style="height:40px;width:40px" alt=""  v-if="item.source_user_name != '系统通知' && !item.icon">
													</div>
													<div class="van-info"></div>
												</a>
						  					</div>
											
						  				</div>
						  			</div>
						  		</div>
								   </van-pull-refresh>
								     </v-touch>
						  	</div>
		
      
	  <comment-title v-if="$route.params.id != 0 " :dataLength="lens" @Postcomment="PostSuccess" ref="commentIpt" :hideLength="true" @showUtil="showUtil" />

  </div>
  
  <transition name="left">
    <play-list-message
      class="play-list"
      ref="playListMessage"
      v-show="showPlayList"
      @close="showPlayList=false;"></play-list-message>
  </transition>
  </div>


</template>

<script>
// import Scroll from '@/base/scroll/scroll'
import Scroll from '@/base/scroll/scroll'
import PlayListMessage from '@/components/PlayList/PlayListMessage'
import { mapGetters, mapMutations } from 'vuex'
import NavBar from '@/components/common/Navbar.vue'
import cover from './cover'
import commentTitle from '@/components/article/commentTitle.vue'
import comment from '@/components/article/comment.vue'

import {formatTime} from '@/common/js/util.js'
export default {
	
    data() {
        return {
			noData:false,// 没有更多数据了
			name:'messageDetail',
			show:false, // 遮罩
			videoList:[], // 视频数组
			// 每种类型消息高度
			widthObject:{
				text: 'auto',
				comment:15
			},
			showPlayList: false,
			isLoading:false,
			token: 'Bearer ' + localStorage.token,
            model:{},
			list:[],
            commendList:null,
            lens:null,
            myVideo:null,
            Postcom:{
                comment_content:'',
                comment_date:'',
                parent_id:null,
                article_id:null
            },
            collectionActive:false,
            subscritionActive:null,
			pageNum:1,
			pageSize:20,
			curUser:{},
			currentScroll:0

        }
    },

    components:{
        NavBar,
        cover,
        commentTitle,
        comment,
		Scroll,
		PlayListMessage
    },
	filters:{
		filterTime(val) {
		  if(val){
		    // return val.split('T') ? val.split('T')[0] : ''
			return val.substring(0,16).replaceAll('T',' ')
		  }
		  return "";
		},
	},
	computed:{
		VideoItemHeightStyle () {
		  let clientWidth = document.body.clientWidth
		  let clientHeight = document.body.clientHeight
		  return {
		    height: clientHeight + 'px',
		    width: clientWidth + 'px'
		  }
		},

	},
    methods:{
		...mapMutations([
		  'SET_PLAYLIST_MESSAGE',
		  'CLEAN_PLAYLIST_MESSAGE',
		  'APPEND_PLAYLIST_MESSAGE',
		  'SET_MESSAGE_TOTAL_NUM'
		]),
		// 打开视频
		openVideo(item){
			// 清除视频缓存,追加当前列表所有视频的数据进来
			this.videoList = []
			let index = 0;// 记录点击视频的下标
			let tempIndex = 0;// 临时下标
			for(let i =0;i<this.list.length;i++){
				// console.log(this.list[i])
				if(this.list[i].message_category == 'VIDEO'){
					// console.log('追加.....')
					this.videoList.push(this.list[i])
					if(item.id == this.list[i].id){
						index = tempIndex
					}
					tempIndex += 1
				}
				
			}
			console.log('点击的弟' + index + '个视频')
			// this.videoList = JSON.parse('[{"collectionUser":"是","source_user_id":9,"videoLength":307,"create_time":"下午 15:13","nickName":"轮子","videoType":"m3u8","message_category":"VIDEO","message_type":"FORWARD","nextAddress":"/91_-604663","collection":"否","title":"完整版已上传 反差JK学妹说热就是想炫耀她好看的胸","message_source":"USER","personName":"许木学长","message_status":"1","user_id":1,"personId":4968,"id":1056,"business_id":234371,"messageContent":"<div data-v-22a44f8e=\\"\\" class=\\"van-image\\" style=\\"width: 10rem; height: 20rem; overflow: hidden; border-radius: 12px; object-position: center top;\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<img src=\\"http://192.168.1.105:8109/common/image?imgId=622849ffc02f6462442c603e&token=Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsdW56aSIsImNyZWF0ZWQiOjE2NDczMTc0NDM0NjksImV4cCI6MjI1MjExNzQ0M30.fI-c-mmt51dONEuVfKhyzoJUrp93yPCk2t8JhPQziDMu7_JIRQKwh8mOX74GKI5lGtFaIFg1fKFKYBnNnBYzpw\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"van-image__img\\" style=\\"object-fit: cover;\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<img data-v-22a44f8e=\\"\\" src=\\"static/play.svg\\" style=\\"position: absolute; right: 0px; top: 50%; left: 50%;\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div data-v-22a44f8e=\\"\\" class=\\"van-ellipsis\\" style=\\"position: absolute; left: 0px; top: 90%; color: white; width: 10rem; font-size: 12px;\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t完整版已上传 反差JK学妹说热就是想炫耀她好看的胸\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>","previewImg":"/common/image?imgId=622849ffc02f6462442c603e","child":[]},{"collectionUser":"是","source_user_id":9,"videoLength":307,"create_time":"下午 15:13","nickName":"轮子","videoType":"m3u8","message_category":"VIDEO","message_type":"FORWARD","nextAddress":"/91_-604663","collection":"否","title":"完整版已上传 反差JK学妹说热就是想炫耀她好看的胸","message_source":"USER","personName":"许木学长","message_status":"1","user_id":1,"personId":4968,"id":1060,"business_id":234371,"messageContent":"<div data-v-22a44f8e=\\"\\" class=\\"van-image\\" style=\\"width: 10rem; height: 20rem; overflow: hidden; border-radius: 12px; object-position: center top;\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<img src=\\"http://192.168.1.105:8109/common/image?imgId=622849ffc02f6462442c603e&token=Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsdW56aSIsImNyZWF0ZWQiOjE2NDczMTc0NDM0NjksImV4cCI6MjI1MjExNzQ0M30.fI-c-mmt51dONEuVfKhyzoJUrp93yPCk2t8JhPQziDMu7_JIRQKwh8mOX74GKI5lGtFaIFg1fKFKYBnNnBYzpw\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"van-image__img\\" style=\\"object-fit: cover;\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<img data-v-22a44f8e=\\"\\" src=\\"static/play.svg\\" style=\\"position: absolute; right: 0px; top: 50%; left: 50%;\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div data-v-22a44f8e=\\"\\" class=\\"van-ellipsis\\" style=\\"position: absolute; left: 0px; top: 90%; color: white; width: 10rem; font-size: 12px;\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t完整版已上传 反差JK学妹说热就是想炫耀她好看的胸\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>","previewImg":"/common/image?imgId=622849ffc02f6462442c603e","child":[]}]')
			this.showPlayList = true
			this.CLEAN_PLAYLIST_MESSAGE()
			this.SET_PLAYLIST_MESSAGE(this.videoList)
			this.$refs.playListMessage.scrollToIndex(index)
		},
		// 接收消息
		getWebSocketMessage(data){
			console.log('3333')
			// 判断消息是否是当前聊天用户发的,如果是消息追加到当前内容中,不然将消息提示出来
			if(data.message.sendUserId == this.$route.params.id){
				// this.list = []
				// this.pageNum = 1
				console.log('相同用户.........')
				// this.getMessage();// 刷新数据
				// this.list.push({
				// 	messageContent:data.message.content,
				// 	message_category:'TEXT',
				// 	message_source:'USER',
				// 	message_status:'1',
				// 	message_type: data.msgType,
				// 	nickName:data.title,
				// 	source_user_id:data.message.sendUserId,
				// 	user_id:data.message.user_id
				// })
				let tempData = [Object.assign({
					id:Math.random(),
					icon:data.message.icon,
					messageContent:data.message.content,
					// message_category:'TEXT',
					message_source:'USER',
					message_status:'1',
					message_type: data.msgType,
					nickName:data.title,
					source_user_id:data.message.sendUserId,
					user_id:data.message.user_id
				},data.message)]
				this.list.push(...this.changeCommentData(tempData))
				// 滚动到最下面
				this.$nextTick(()=>{
					 if(this.pageNum == 1){
						 this.$refs.scrollDiv.scrollTop = this.$refs.scrollDiv.scrollHeight
					 } 
				})
			}else{
				this.$notify({
					message: data.title + '\n' + data.message.content,
					  duration: 2000,
					  type: 'success'
				})
			}
		},
		// 图片加载结束
		imgLoad(){
			console.log('img on load.....')
			// 图片加载结束,如果分页是1定位到底部
			if(this.pageNum == 1){
				this.$nextTick(()=>{
					this.scrollToBottom()
				})
				
			}
		},
		// 点击遮罩
		overlayClick(){
			this.show = !this.show
			if(!this.show){
				// 收起输入框
				this.$refs.commentIpt.util = false
			}
		},
		// 内容位置
		getContentPoint(item) {
			if(item.source_user_id != this.model.id){
				return "van-card__title-right";
			}
			return "van-card__title-left";
		 
		},
		// 获取是左边还是右边
		getisLeftOrRight(item){
			if(item.source_user_id != this.model.id){
				return "2";
			}
			return "1";
		},
		onRefresh() {       //下拉刷新
		            setTimeout(() => {
						this.pageNum += 1;
						 this.isLoading = true;
						this.getMessage();
		                // this.finished = false;
		               
		                // // this.list = []
		                // let categoryitem = this.categoryItem();
		                // categoryitem.page = 1;
		                // categoryitem.list = []
		                // this.selectArticle();
		            }, 500);
		        },
		scroll (pos) {
			console.log('1111')
		},
		async getUser(){
			// 系统消息
			if(this.$route.params.id == 0){
				this.model.id = this.$route.params.id
				this.model.nickName = '系统消息'
				
			}else{
				const res = await this.$http.get('/admin/' + this.$route.params.id)
				// console.log('......')
				console.log(res.data.data)
				this.model = res.data.data
				
				const res2 = await this.$http.get('/admin/info')
				console.log(res2)
				this.curUser = res2.data.data
			}
			
			
		},
		fx(){
			this.$msg.fail('功能暂时关闭')
		},
		returnPage(){
			this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			// alert('漫画高度' + this.curScroll)
			this.$router.go(-1)
		},
        onSwipeLeft () {
            // console.log('页面左滑')
          // this.$router.go(-1)
        },
        onSwipeRight(){
            console.log('页面右滑')
            // this.$router.go(-1)
			if(localStorage.slideReturn == 1){
				this.$router.go(-1)
			}
        },
		showUtil(item){
			if(item){
				console.log('显示了....')
				// 评论框弹出、添加遮罩
				this.show =true
			}else{
				console.log('关闭了....')
				this.show = false
			}
			
		},

        //发送评论
        async PostSuccess(res,parentId) {
			console.log(res)
			console.log('....')
			if(res){
				

				// return;
				// 保存评论
				const result = await this.$http.post('/message/addMessage',{
					user_id: this.$route.params.id,
					message_category:'TEXT',
					message_type:'COMMENT',
					message_content:res,
					message_source:'USER'
				})
				// console.log(result)
				// this.Postcom.parent_id = null
				if(result.data.data == '成功') {
				    // this.$msg.fail('评论发表成功')
					this.$refs.commentIpt.closeUtil()
					// this.list = []
					// this.pageNum = 1
					//  将评论的数据追加到内容中
					// 如果数据是空的,在消息添加成功后,请求刷新所有消息缓存
					if(this.list.length == 0){
						this.getMessage();
						this.websocket.send('init')
					}else{
						console.log('追加数据......')
						let tempData = [{
							id:Math.random(),
							messageContent:res,
							message_category:'TEXT',
							message_source:'USER',
							message_status:'1',
							message_type: 'COMMENT',
							nickName:this.model.nickName,
							icon: this.curUser.icon,
							source_user_id:this.curUser.id,
							user_id: this.model.id
						}]
						
						this.list.push(...this.changeCommentData(tempData))
						this.$nextTick(()=>{
							for(let i =0;i<this.$store.getters.messageList.length;i++){
								// 更新缓存
								if(this.model.id == this.$store.getters.messageList[i].user_id){
								   this.$store.getters.messageList[i].messageContent = res
								   // console.log(this.$store.getters.messageList[i])
									this.$store.getters.messageList[i].lastTime.time = new Date().getTime()
								}
							}
	
							// 重新加载缓存
							 this.$refs.scrollDiv.scrollTop = this.$refs.scrollDiv.scrollHeight
						})
					}
					
				}else{
					this.$msg.fail('评论失败!')
				}
			}else{
				this.$msg.fail('评论不能为空!')
				
			}
            
        },
        //聚焦输入框
        PostChildClick(item) {
			console.log(item)
            this.Postcom.parent_id = item.comment_id
			this.$refs.commentIpt.placeholderText = '回复 @' + item.nickname + ':'
			this.$refs.commentIpt.util = true;
            // this.$refs.commentIpt.focus()
        },
		// 去除回复状态
		clearPostStatus(){
			// this.$refs.commentIpt.placeholderText = '和谐社会,请文明发言'
			this.Postcom.parent_id = ''
		},
        //收藏文章
        async collectionClick() {
           if(localStorage.getItem('token')){
             // 判断显示状态,是收藏还是取消收藏
             if(!this.collectionActive){
               const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'1'})
               // console.log(res)
               if(res.data.data == '收藏成功'){
                   this.collectionActive = true
               }else{
                   // this.collectionActive = false
                   this.$msg.fail(res.data.message)
               }
             } else {
               const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'1'})
               if(res.data.data == '取消成功'){
                 this.collectionActive = false
               } else {
                  this.$msg.fail(res.data.message)
               }
             }

                // this.$msg.fail(res.data.msg)
           }
        },
        //进入页面获取是否收藏
        async collectionInit() {
            if(localStorage.getItem('token')){
                const res = await this.$http.post('/collection/queryCollectionByUseridAndDetailDataId',{
                    webInfoDetailDataId:this.$route.params.id,
					collectionType:'1'
                })
                // console.log(res.data)
            this.collectionActive = res.data.data == '1' ? true : false;
            }
        },
        //点击关注发帖用户
        async subscriptClick() {
           if(localStorage.getItem('token')){
               const res = await this.$http.post('/sub_scription/' + localStorage.getItem('id'),{sub_id:this.model.userid})
               if(res.data.msg == '关注成功'){
                   this.subscritionActive = true
               }else{
                   this.subscritionActive = false
               }
               this.$msg.fail(res.data.msg)

           }
        },
		 async getMessage(){
			 let curTop = 0;
			 // 判断如果不是第一页,记录当前滚动位置,加载完成后定位到当前位置上
			 if(this.pageNum > 1){
				 curTop = this.$refs.scrollDiv.scrollHeight
				 console.log('之前高度' + curTop)
			 }
			 const res = await this.$http.post('/message/queryMessage',{
				 pageNum:this.pageNum,
				 pageSize:this.pageSize,
				 sourceUserId:this.$route.params.id,
				 sortType:'DESC'
			 })
			  this.isLoading = false
			 // 判断如果没有数据显示没有更多了提示
			 if(res.data.data.list.length > 0){
				 this.noData = false;
				 this.list.unshift(...this.changeCommentData(res.data.data.list))
				 this.$nextTick(()=>{
				 
				 	// 判断高度,如果高度比屏幕的80%小，说明数据不够填满屏幕，定位到顶部
				 	if(this.$refs.refreshRef.$el.scrollHeight < (this.windowHeight * 0.8)){
				 		this.$refs.scrollDiv.scrollTop = 0
				 	}else{
				 		if(this.pageNum == 1){
				 			this.$refs.scrollDiv.scrollTop = this.$refs.scrollDiv.scrollHeight
				 		}else{
				 			 // 加载更多数据定位到滑动的位置,当前高度减去之前高度
				 			 this.$refs.scrollDiv.scrollTop = this.$refs.scrollDiv.scrollHeight - curTop - 20
				 		}
				 	}
					// 修改用户查看状态
					this.$http.get('/message/updateMessageReadStatus?sourceUserId=' + this.$route.params.id);
				 
				 })
			 }else{
				 this.noData = true
				 // 页数恢复
				 this.pageNum -= 1
			 }
		 },
		 changeCommentData(data) {
		 	  const imgList = this.Highlightlist

		 	  let filterImg = []
		 	  for(let i =0;i<imgList.length;i++){
		 			filterImg.push(imgList[i].img.replace('./static/emoticom/','[').replace('.png',']'))
		 	  }

		 	  let fn = ((temp)=>{
		 		  let arr1 = [];
		 		  for (var i = 0; i < data.length; i++) {
					  // console.log(data[i])
					  let tempData =  data[i].messageContent
					  if(!data[i].messageContent){
					  	continue;
					  }
					// 评论
					if(data[i].message_type == 'COMMENT'){
						
						for(let i =0;i<filterImg.length;i++){
							if(tempData.indexOf(filterImg[i]) != -1){
								tempData = tempData.replace(filterImg[i],"</span><img style='position:inherit;top:5px;-webkit-mask-box-image' width='25px'  height='25px' src='"+ this.Highlightlist[i].img +"'><span>")
							}
						}
						
						
					}  
					// 转发
					if(data[i].message_type == 'FORWARD'){
						// tempData = `<van-image @load="imgLoad" style="object-position:top;" fit="cover" radius ="12" :src="${this.baseURL}${data[i].previewImg}&token=${this.token}"  v-if="${data[i].previewImg}" width="10rem" height="20rem">
						// 				<img src="@/assets/play.svg" style="position: absolute;right: 0;top:50%;left:50%;">
						// 				<div class="van-ellipsis" style="position: absolute;left: 0;top:90%;color:white;width:10rem;font-size:12px;" >
						// 					${data[i].title}
						// 				</div>
						// 			</van-image>
						// 			<van-image @load="imgLoad"   radius ="12" :src="require('@/assets/bk_black.png')"  v-if="!${data[i].previewImg}" width="10rem" height="20rem">
						// 				<img src="@/assets/play.svg" style="position: absolute;right: 0;top:50%;left:50%;">
						// 				<div class="van-ellipsis" style="position: absolute;left: 0;top:90%;color:white;width:10rem;font-size:12px;" >
						// 					${data[i].title}
						// 				</div>
						// 			</van-image>`
						
						
						if(data[i].previewImg){
							tempData = `<div data-v-22a44f8e="" class="van-image" style="width: 10rem; height: 20rem; overflow: hidden; border-radius: 12px; object-position: center top;">
											<img src="${this.baseURL}${data[i].previewImg}&token=${this.token}"
											class="van-image__img" style="object-fit: cover;">
											<img data-v-22a44f8e="" src="static/play.svg" style="position: absolute; right: 0px; top: 50%; left: 50%;">
											<div data-v-22a44f8e="" class="van-ellipsis" style="position: absolute; left: 0px; top: 90%; color: white; width: 10rem; font-size: 12px;">
												${data[i].title}
											</div>
										</div>`
						}else{
							tempData = `<div data-v-22a44f8e="" class="van-image" style="width: 10rem; height: 20rem; overflow: hidden; border-radius: 12px; object-position: center top;">
											<img src="static/bk_black.png" class="van-image__img" style="object-fit: cover;">
											<img data-v-22a44f8e="" src="static/play.svg" style="position: absolute; right: 0px; top: 50%; left: 50%;">
											<div data-v-22a44f8e="" class="van-ellipsis" style="position: absolute; left: 0px; top: 90%; color: white; width: 10rem; font-size: 12px;">
												${data[i].title}
											</div>
										</div>`
						}
						
					}
					
					data[i].messageContent = tempData

		 		  	
		 		  	// console.log(data[i].tempData)
		 		    if (data[i].parent_id == temp) {
		 		      arr1.push(data[i]);
		 		      data[i].child = fn(data[i].id);
		 		    }
		 		  }
		 		  return arr1;
		 	  })

		 	  
		 	  function replaceall( restr ,oldstr, newstr ){
		 	while (restr.indexOf(oldstr)  >= 0){
		 			restr = restr.replace(oldstr,newstr);
		 
		 		}
		 
		 	return restr ;
		 	}
		     return fn(null);
		  },

		  slideTo (targetPageY) {
			  let div  = this.$refs.scrollDiv
		    var timer = setInterval(function () {
		        var currentY = div.scrollTop;//当前及滑动中任意时刻位置
				// console.log(currentY)
		        var distance = targetPageY < currentY ? targetPageY - currentY : currentY - targetPageY;//剩余距离
		        var speed = Math.ceil(distance/10);//每时刻速度
		        if (currentY == targetPageY) {
		         clearInterval(timer);
		        } else {
					window.scrollTo(0,targetPageY < currentY ? currentY + speed : currentY - speed);
		        }
		       },10);
		   },
		 scrollEvent(){
			 console.log('滑动........................')  
		   },
		 scrollEnd (pos) {
			 
		 	// 结束将当前高度设置为0
		 	// let totalHeight  = -(this.clientHeight * (this.playList.length - 1)) // 总高度
		 	// if(pos.y == totalHeight){
		 	// 	// console.log(this)
		 		console.log('滑到最下面》。。。。。。。。。')
		 	// 	this.pageNum = this.pageNum + 1
		 	// 	this.loadData()
		 	// 	// this.$parent.$children[0].queryData()
		 	// }
		 	// // 滑到最底下加载新数据
		 	// // console.log(this.playList)
		 	// if(this.currentHeight > 0){
		 	// 	this.$refs.scroll.scrollTo(0, -this.currentHeight)
		 	// 	this.currentHeight = 0
		 		
		 	// }
		 
		 },
		 scrollToBottom(){

			 	// top.a = this.$refs.scrollDiv
			 	// console.log(this.$refs.scrollDiv.scrollHeight)
			 		 this.$refs.scrollDiv.scrollTo(0,this.$refs.scrollDiv.scrollHeight + 300)
		 }
    },
	// 显示重新加载数据
	activated(){
		
	},
    created() {

		 this.getUser();
		 // 查询用户消息
		 this.getMessage();
		 
		 // if(!this.websocket){
			//  this.createWebSocket()
		 // }
		 // 加载完后跳到最下面的消息位置
		// setTimeout(()=>{
		// 	this.openVideo()
		// },2000)
    },
	mounted (){
		console.log('======')
		// this.scrollToBottom()
	},
	// updated(){
	// 	console.log('....')
	// 	this.scrollToBottom()
	// // 	console.log(this.model)
	// // 	if(!this.model.bottom){
	// // 		this.$nextTick(()=>{
	// // 			 this.$refs.scrollDiv.scrollTo(0,9999999999)
	// // 			 setTimeout(()=>{
	// // 				 this.model.bottom = true;
	// // 			 },500)
				 
	// // 		})
	// // 	}
		
	// },
	// 跳转其他页面之前
	beforeRouteLeave(to, from ,next){
		if(from.name == 'messageDetail'){
			// console.log('....@@@@')
			// top.a = this.$refs
			this.currentScroll = this.$refs.scrollDiv.scrollTop
			// alert(this.currentScroll)
		}
	 next();
	},
    watch:{
		$route(to,from) {

			// top.a = this.$refs
			// console.log(to)
			// 跳转高度
			if(to.name == 'messageDetail'){
				// 切换路由刷新数据
				this.list = []
				this.pageNum = 1
				this.getUser();
				this.getMessage();
			// 	// alert(this.currentScroll)
			// 	this.$nextTick(()=>{
			// 		// document.documentElement.scrollTop = this.currentScroll
			// 		// document.body.scrollTop = this.currentScroll
			// 		// this.$refs.scrollDiv.scrollTop = this.currentScroll
			// 		// console.log('跳转之前位置....' + this.currentScroll)
			// 		// 刷新缓存数据
			// 		// this.initMessage()
			// 	})
			}
			
			// id不同刷新
			// if(to.name =='messageDetail' && to.params.id != this.model.id){
			// 	console.log('数据刷新...')
			// 	this.list = []
			// 	this.pageNum = 1
			// 	this.getUser();
			// 	this.getMessage();
			// 	// this.$forceUpdate()
			// 	// scroll(0,0)
			// 	// this.loadMode = 0
			// 	// this.person = {}
			// 	// const categoryitem = this.categoryItem();
			// 	// categoryitem.list = []
			// 	// categoryitem.page = 1
			// 	// categoryitem.finished = false;
			// 	// categoryitem.loading = true;
			// 	// this.selectArticle();
			// 	// this.collectionInit()
			// }
		},
		'$store.state.websocketSendData'(data){
			console.log('追加数据.........')
			// 追加数据
			this.getWebSocketMessage(data)
			// console.log('优数据推送了..............')
			// console.log(old)
			// console.log(new)
		}
    }
}
</script>

<style  lang='stylus' scoped>
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
    z-index 3000
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

.detailparent {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .detailitem {
    margin: 1.389vw 0;
    width: 45%;
  }
}
.categorytab{
  position: relative;
  .category-ico{
    position: absolute;
    z-index: 5;
    right: 0;
    top: 1.944vw;
    padding: 1.389vw 2.778vw;
    background-color: #ee0a24;
  }
}

/deep/ .van-card{
	position: relative;
	    box-sizing: border-box;
	    padding: 8px 16px;
	    color: #323233;
	    font-size: 12px;
	    background-color: white;
}

.van-card__desc{
	position: absolute;
	right: 0;
	bottom: 0;
}
.van-card__more{
	position: absolute;
	right: 0;
	bottom: 0;
}
/deep/ .van-card__header{
	display: flex;
	height:auto;
}
/deep/ .van-card__thumb{
	position: relative;
	    flex: none;
	    width: 40px;
	    margin-right: 8px;
}

.van-card__num{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
		 // left: 1rem; 
		bottom: 0;
}
/deep/ .van-card__title-left {

    font-weight: 500;
    line-height: 25px;
	padding-right:.5rem;
	text-align: left;
	word-break: break-all;
	/* position: absolute; */
	font-size: 14px;
	float:left;
	    font-weight: 600;
	    /* top: 0.4rem; */
	    /* left: 1.2rem; */
		letter-spacing:1px;
}

/deep/ .van-card__title-right {
	text-align:left;
    /* width 90%; */
	/* margin-right:1.5rem; */
    font-weight: 500;
    line-height: 25px;
	padding-right:.5rem;
	word-break: break-all;
	/* text-align: initial; */
	/* float:right; */
	/* position: absolute; */
	font-size: 14px;
	    font-weight: 600;
	    /* top: 0.4rem; */
	    /* right: 1.2rem; */
		letter-spacing:1px;
		float:right;
}

/deep/ .van-card__type2{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
		 // left: 1rem; 
		bottom: 2.5rem;
		//right: 0;
		top: 2rem;
		    left: 1.2rem;
			letter-spacing:1px;
}
.van-card__chat{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
	left: 3.5rem; 
	bottom: 0;
}
/deep/ .van-card__thumb img{
	border-radius:30px;
}

/deep/ .van-swipe-cell{
	 /* height:4rem; */
	height:auto;
}

/deep/ .van-card__thumb{
	position: relative;
	    flex: none;
	    width: 40px;
	    /* height: 88px; */
		height:50px;
	    margin-right: 8px;
}

/deep/ .van-card__content{
	position: relative;
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: flex;
	    -webkit-box-flex: 1;
	    -webkit-flex: 1;
	    flex: 1;
	    -webkit-box-orient: vertical;
	    -webkit-box-direction: normal;
	    -webkit-flex-direction: column;
	    flex-direction: column;
	    -webkit-box-pack: justify;
	    -webkit-justify-content: space-between;
	    justify-content: space-between;
	    min-width: 0;
	    /* min-height: 88px; */
}

.van-info{
	position: absolute;
	    top: 0;
	    right: 0;
	    box-sizing: border-box;
	    min-width: 16px;
	    padding: 0 3px;
	    color: #fff;
	    font-weight: 500;
	    font-size: 12px;
	    font-family: -apple-system-font,Helvetica Neue,Arial,sans-serif;
	    line-height: 1.2;
	    text-align: center;
	    background-color: #ee0a24;
	    border: 1px solid #fff;
	    border-radius: 16px;
	    -webkit-transform: translate(50%,-50%);
	    transform: translate(50%,-50%);
	    -webkit-transform-origin: 100%;
	    transform-origin: 100%;
}

/deep/ .van-card__tag{
	position: absolute;
	    top: 2px;
	    left: -1rem;
}

/deep/ .van-overlay{
		position: fixed;
	    top: 0;
	    left: 0;
	    z-index: 1;
	    width: 100%;
	    height: 100%;
	    background-color: none;
		/* opacity:0; */
}

.cover{
	height: 100%;
	width:100%;
}
  
.icon-delete{
	position: absolute;
	right: 5px;
	top: 5px;
	font-size:14px;
	padding: 0 0 10px 10px;
}
  
.desc{
	position: absolute;
	left: 5px;
	bottom: 5px;
	font-size:14px;
}

.desc .icon{
	display: inline-block;
	width: 12px;
	height: 12px;
	font-size: 12px;
	margin-right: 5px;
	vertical-align: top;
}


</style>
