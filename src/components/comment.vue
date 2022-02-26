<!-- 评论组件 -->
<template>
	<div style="z-index:9999">
		<!--留言弹窗-->
		<van-popup v-model="commentPop"  closeable :overlay="true" class="comment_container" position="bottom"  @click-overlay = "closeComment" :overlay-style="{background:'rgba(255,255,255,0)'}">
			<div class="comment_box">
				<div class="comment_top">
					{{commentNum}}条评论
					<i class="iconfont icon-guanbi1 guanbi3" @click.stop="closeComment"></i>
				</div>
				<ul class="comment_ul">
					<div v-if="videoComment.length!=0">
						<transition-group appear>
							<li class="comment_li" v-for="(item,index) in videoComment" :key="index"
								@click="replayUser(item,index,-1)">
								<div class="comment_author_left">
									<img :src="baseURL + '/common/image?imgId=' +item.avatar +'&token=' + token">
								</div>
								<div class="comment_author_right">
									<div class="comment_author_top">
										<div class="comment_author_name">{{item.nickname}}</div>
										<!-- <div class="icon-shoucang1_box" @click.stop="commentLove(item,index,-1)">
											<div class="icon_right_change"
												 :class="item.love_comment?'love_active':''">
												<i class="iconfont icon-shoucang icon-shoucang1"></i>
											</div>
											<div class="shoucang1_num">{{item.love_count}}</div>
										</div> -->
									</div>
									<div style="color:#999;margin:.4rem 0 ">{{item.create_time}}</div>
									<div class="comment_author_text" v-html="item.comment_content">
										<!-- {{item.comment_content}}<span>{{item.create_time}}</span> -->
									</div>
								</div>
								<div class="clear"></div>
								<div class="comment_replay_box">
									<transition-group appear>
										<div class="comment_replay_li" v-for="(item2,index2) in item.child_comment"
											 :key="index2" @click.stop="replayUser(item2,index,index2)">
											<div class="comment_replay_left">
												<img :src="baseURL + '/common/image?imgId=' + item2.avatar + '&token=' + token">
											</div>
											<div class="comment_replay_right">
												<div class="comment_replay_top">
													<div class="comment_replay_name">{{item2.nickname}}</div>
													<!-- <div class="icon-shoucang1_box"
														 @click.stop="commentLove(item2,index,index2)">
														<div class="icon_right_change"
															 :class="item2.love_comment?'love_active':''">
															<i class="iconfont icon-shoucang icon-shoucang1"></i>
														</div>
														<div class="shoucang1_num">{{item2.love_count}}</div>
													</div> -->
												</div>
												<div style="color:#999;margin:.4rem 0 ">{{item2.create_time}}</div>
												<span v-if="item.user_id!=item2.be_commented_user_id">回复 {{item2.be_commented_nickname}}：</span>
												<div class="comment_replay_text" v-html="item2.comment_content">
													<!-- <span v-if="item.user_id!=item2.be_commented_user_id">回复 {{item2.be_commented_nickname}}：</span> -->
													<!-- {{item2.comment_content}} -->
													<!-- <span>{{item2.create_time}}</span> -->
													</div>
											</div>
											<div class="clear"></div>
										</div>
									</transition-group>
								</div>
							</li>
						</transition-group>
					</div>
					<div class="no_message" v-if="videoComment.length==0">
						<i class="iconfont iconfont_style icon-zanwupinglun"></i>
						<div class="no_message_tips">暂无评论</div>
					</div>
				</ul>
			</div>
		</van-popup>
		<!--留言输入-->
		<div class="comment_input_box_hover"></div>
		<div class="comment_input_box" v-show="commentPop">
			<!--<form action="#" class="comment_form">-->
			<input :placeholder="commentPlaceholder" class="comment_input" v-model="comment_text" ref="content"
				   @keyup.enter="checkComment"/>
			<!--</form>-->
			<div class="comment_input_right" @click="checkComment">
				<i class="iconfont icon-fasong comment_i" :class="canSend?'comment_i_active':''"></i>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	// props:['commentPop'],
	data(){
		return {
			token: 'Bearer ' + localStorage.token, // 用户token
			// 评论相关
			commentPop:false,
			comment_text: '',//评论输入内容
			canSend: false,//是否可以发送
			videoComment: [],
			commentPlaceholder: '留下你精彩的评论吧',//评论Placeholder
			replayUserData: '',
			to_comment_id: '',
			showCommentList: false,
			commentNum: 0,
			commentList: [],
			video:'',
			id:''// 视频id
		}
	},
	watch: {
	    //监听输入变化
	    comment_text(newV, oldV) {
	        newV == '' ? this.canSend = false : this.canSend = true
	    },
		// commentPop(newV, oldV) {
		// 	// console.log(this)
		// 	if(!newV){
		// 		this.closeComment()
		// 		setTimeout(()=>{
		// 			// this.$parent.commentPop = false
		// 			// if(this.$root.$children[0]){
		// 			// 	if(this.$root.$children[0].$children[0]){
		// 			// 		this.$root.$children[0].$children[0].bottomShow = true
		// 			// 	}
		// 			// }
		// 		},200)
		// 	}else{
		// 		// this.$parent.commentPop = true
		// 		// if(this.$root.$children[0]){
		// 		// 	if(this.$root.$children[0].$children[0]){
		// 		// 		this.$root.$children[0].$children[0].bottomShow = false
		// 		// 	}
		// 		// }
		// 	}
		// }
	},
	methods:{
		changeCommentData(data) {
			  const imgList = this.Highlightlist
		
			  let filterImg = []
			  for(let i =0;i<imgList.length;i++){
					filterImg.push(imgList[i].img.replace('./static/emoticom/','[').replace('.png',']'))
			  }
		
			  let fn = ((temp)=>{
				  let arr1 = [];
				  for (var i = 0; i < data.length; i++) {
				  	if(!data[i].comment_content){
				  		continue;
				  	}
				  	// console.log(data[i].comment_content)
				  	let tempData = data[i].comment_content
					// console.log(tempData)
				  	for(let i =0;i<filterImg.length;i++){
				  		if(tempData.indexOf(filterImg[i]) != -1){
				  			tempData = tempData.replace(filterImg[i],"<span><img style='-webkit-mask-box-image' widht:'25px' height='25px' src='"+ this.Highlightlist[i].img +"'></span>")
				  		}
				  	}
		
					data[i].comment_content = tempData
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
		//获取评论
		async getComment(video) {
			this.id = video.id.replace('_html5_api','')
			// console.log(this.id)
			this.video = video
		    //setTimeout模拟Ajax请求
		    // setTimeout(() => {
				// 获取评论数据
				const res = await this.$http.get("/comment/queryComment?work_id=" + this.id)
				// const res = await this.$http.get("/comment/queryComment?work_id=4853011")
				// console.log(res)
				let data = res.data.data
				this.commentNum = data.length
				//获取评论数据
				  // this.videoComment = [...this.videoComment, ...data];
				this.videoComment = [ ...data];
				this.videoComment = this.changeCommentData(this.videoComment)
				  let to_comment_id = this.to_comment_id;
				  if (to_comment_id != 0) {
					  //从评论列表进来回复
					  this.getCommentDetail(to_comment_id);
				  }
		    // }, 500)
		},
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
				workId:this.id,
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
				this.getComment(this.video)
			}else {
				this.$msg.fail(res.data.data)
			}
		
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
		    this.commentPop = true;
		    this.videoComment = [];
		    this.getComment()
		},
		//关闭评论弹窗
		closeComment() {
			console.log('弹出关闭.....')
		    this.commentPop = false;
		    this.commentPlaceholder = '留下你精彩的评论吧';
		    this.replayUserData = '';
			// 把评论数带到父组件
			this.$emit('commentNum',this.video,this.commentNum)
			// this.$parent.commentNum = this.commentNum
			
		},
	}
}
</script>

<style scoped>
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
			z-index:2001;
			/* z-index:1500; */
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
			/* z-index:9999; */
	        width: 100%;
	        border-top-left-radius: 10px;
	        border-top-right-radius: 10px;
			position: absolute;
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
	        position: absolute;
	        bottom: 0;
	        z-index: 3500;
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
	        line-height: 1.44rem;
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
/* /deep/ .van-overlay{
	position: fixed;
	    opacity: 0;
	    top: 0;
	    left: 0;
	    z-index: 1;
	    width: 100%;
	    height: 100%;
	    background-color: none;
} */

/* /deep/ .comment_contain{
	width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		position: absolute;
} */
</style>
