
<template>
   <!-- <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div"> -->
	   <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" :style="'touch-action: pan-y!important;width:100%;height:'+windowHeight+'px'" :swipe-options="{direction: 'horizontal'}">
  <div v-if="model">
      <!-- <nav-bar></nav-bar> -->
	  <van-sticky >
	  	<van-cell  style="z-index:999;width: 100%;" class="van-ellipsis" icon="arrow-left" :title="model.title"  @click="returnPage"/>
	  </van-sticky>
      <div class="detailinfo">
         <div class="video" >
              <!-- <video controls="controls" :src="model.content"></video> -->
			   <!-- style="visibility: hidden;" -->
              <video v-if="model.loadMode == 4"    ref="videoPlayer" id="myVideo" class="video-js vjs-big-play-centered vjs-fluid" controls="controls"></video>
			  <video v-if="model.loadMode == 6"  ref="videoPlayer" id="myVideo" class="video-js vjs-big-play-centered vjs-fluid" :src="baseURL + '/video'+model.videoAddress+'?token=' + token" controls="controls"></video>
         </div>
         <div class="detailinfoText">
              <div>
                  <!-- <span>{{model.category.title}}</span> -->
                  <span v-show="model.dictName">{{model.dictName}}</span>
                  <span>{{model.title}}</span>
              </div>
              <div>
                  <!-- <span>{{model.userinfo.name}}</span> -->
                  <span></span>
                  <span>{{model.flowNum}}次观看</span>
                  <!-- <span>5281弹幕</span> -->
                  <span>{{model.createTime | filterTime}}</span>
              </div>
              <div>
                  <p @click="collectionClick" :class="{activeColor:collectionActive}">
                      <span class="icon-star-full" ></span>
                      <span>收藏</span>
                  </p>
                  <!-- <p @click="subscriptClick" :class="{activeColor:subscritionActive}">
                      <span class="icon-bubble"></span>
                      <span>关注</span>
                  </p> -->
                  <p>
                      <span class="icon-redo2"></span>
                      <span @click="fx()">分享</span>
                  </p>
              </div>
         </div>
          <div class="detailparent">
          <!-- <cover class="detailitem" v-for="(item,index) in commendList" :key="index"  :detailitem="item"/> -->
      </div>
      <comment @lengthselect="len => lens = len" ref="commentPulish"  @publishClick="PostChildClick" />

	  <comment-title :dataLength="lens" @Postcomment="PostSuccess" ref="commentIpt"  />
      </div>

  </div>
  </v-touch>
</template>

<script>
import NavBar from '@/components/common/Navbar.vue'
import cover from './cover'
import commentTitle from '@/components/article/commentTitle.vue'
import comment from '@/components/article/comment.vue'
export default {
    data() {
        return {
			token: 'Bearer ' + localStorage.token,
            model:null,
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

        }
    },
    components:{
        NavBar,
        cover,
        commentTitle,
        comment
    },
	filters:{
		filterTime(val) {
		  if(val){
		    return val.split('T') ? val.split('T')[0] : ''
		  }
		  return "";
		},
	},
    methods:{
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
            // console.log('页面右滑')
            // this.$router.go(-1)
			if(localStorage.slideReturn == 1){
				this.$router.go(-1)
			}
        },
		// 获取本地视频
		async getVideo(){
			this.$msg.loading({
			  message: '加载中...',
			  forbidClick: true,
			  loadingType: 'spinner'
			});
			if(this.$route.params.loadMode == 4){
			// const res = await this.$http.get('/webInfoDetailData/queryDetailDataByTypeId?id=' + this.$route.params.id)
			const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
			  id:this.$route.params.id,
			  pageNum: 1,
			  pageSize: 10,
			  search: '',
			  loadMode: this.$route.params.loadMode
			})
			console.log(res)
			this.model = res.data.data.list[0]

			
				this.model.vid = this.model.nextAddress.split('_-')[1]
				this.model.playUrl = this.baseURL + '/webInfoVideo/' + this.model.vid + '/' + this.model.vid + '?token=' + this.token
				console.log(this.model.playUrl)
				this.$nextTick(()=>{
					this.$msg.clear()
					this.play(this.model.playUrl);
				})
			}
			
			if(this.$route.params.loadMode == 6){
				
				const res = await this.$http.get("/person/getPersonVideoUrlByWorkId?workId=" + this.$route.params.id)
				console.log(res.data)
				this.$msg.clear()
				this.model = {
					videoAddress:res.data,
					loadMode: this.$route.params.loadMode
				}
			}
		},
        //获取文章信息
        async articleitemData() {
			this.$msg.loading({
			  message: '加载中...',
			  forbidClick: true,
			  loadingType: 'spinner'
			});
            // 获取数据类型,判断加载页面
            // let loadMode = this.$route.params.loadMode;
            // if(loadMode == 4){
		   const res = await this.$http.get('/webInfoVideo/getVideoMenuDataByWebInfoDetailDataId?webInfoDetailDataId=' + this.$route.params.id)
		   // console.log(res)
		   this.model = res.data.data
		   // console.log(this.model)
		   // 提取视频地址
		   let html = this.model.html
		   let start = html.indexOf('src="') + 5
		   let end = html.indexOf('" type')
		   this.model.content = html.substring(start,end)
		   this.model.content = this.model.content.replace('http://121.201.2.228:10824',this.baseURL)
		   // console.log(this.model)
		   if(this.model) {
			   this.subscritionInit()
		   }
		   this.$nextTick(()=> {
			 this.play(this.model.content)
		   })
		   this.$msg.clear()
            // }

        },
        //获取推荐文章
        async commendData() {
            const res = await this.$http.get('/commend')
            this.commendList = res.data
        },
        //发送评论
        async PostSuccess(res,parentId) {
			// console.log(res)
            // const date = new Date()
            // let m = date.getMonth() + 1
            // let d = date.getDate()
            // if(m < 10) {
            //     m = '0' + m
            // }
            // if(d < 10) {
            //     d = '0' + d
            // }
            // let str = `${m}-${d}`
            // this.Postcom.comment_content = res
            // this.Postcom.comment_date = str
            // this.Postcom.article_id = this.$route.params.id
            // const result = await this.$http.post('/comment_post/' + localStorage.getItem('id'),this.Postcom)
			if(res){
				console.log(res)
				console.log(parentId)
				console.log(this.Postcom.parent_id)
				if(!parentId){
					parentId = this.Postcom.parent_id
				}
				// return;
				// 保存评论
				const result = await this.$http.post('/comment/addComment',{
					workId: this.$route.params.id,
					commentType:'OTHER',
					content:res,
					parentId:parentId
				})
				// console.log(result)
				// this.Postcom.parent_id = null
				if(result.data.data == '评论成功') {
				    this.$msg.fail('评论发表成功')
					this.$refs.commentPulish.commentData()
					this.$refs.commentIpt.closeUtil()
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
			this.$refs.commentIpt.placeholderText = '留下你的精彩评论吧'
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
        //进入页面获取是否收藏
        async subscritionInit() {
            // if(localStorage.getItem('token')){
                // const res = await this.$http.get('/sub_scription/' + localStorage.getItem('id'),{
                //     params:{
                //         sub_id:this.model.userid
                //     }
                // })
                // const res = await this.$http.post('/collection/queryCollectionByUseridAndDetailDataId',{
                //    webInfoDetailDataId:this.$route.params.id
                // })
                // if(res.data.data == '0'){
                //   this.subscritionActive = false;
                // } else {
                //   this.subscritionActive = true;
                // }
                // console.log(res)
            // this.subscritionActive = res.data.success
            // }
        },
         play(vdoSrc){
			 console.log(this.$refs.videoPlayer)
                         //初始化播放器
              this.myVideo = this.$video(
                      this.$refs.videoPlayer,
                      // this.options,
                      function onPlayerReady() {}
                    );
            this.myVideo.src({
              src:vdoSrc,
              type: 'application/x-mpegURL' //在重新添加视频源的时候需要给新的type的值
            })
            this.myVideo.play()

         }
    },
    created() {
		if(this.$route.params.loadMode == 6){
			this.getVideo()
		}else{
			this.myVideo = null;
			  // $('#myVideo').empty()
			if(this.myVideo){
			  this.myVideo.destory();
			}
		   this.getVideo()
			   // this.articleitemData()

		}
       
         // this.commendData()
         this.collectionInit()
    },
    watch:{
        'model.content'(){
          // alert(11)
          // this.play(this.model.content)
        },
        $route() {
            this.articleitemData()
            // this.commendData()
            this.collectionInit()
        }
    }
}
</script>

<style lang="less" scoped>
.myVideo-dimensions.vjs-fluid{
	padding-top:15rem
}
.container{
  width:100vh;
  height:100vh;
}
.detailinfo{
    background-color: white;
    .video{
        width: 100%;
        video{
            width: 100%;
        }
    }
}
.detailinfoText{
    padding: 4.167vw;
    div:nth-child(1) {
        span:nth-child(1) {
            padding:0 2.778vw;
            color: #fb7299;
            background-color: #f4f4f4;
            border-radius: 2.778vw;
        }
    }
    div:nth-child(2) {
        padding: 2.778vw 2.778vw;
        span{
            color: #aaa;
            font-size: 3.333vw;
            margin-right: 2.778vw;
        }
        span:nth-child(1) {
            color: black;
            font-size: 4vw;
            padding-right:2.778vw;
        }
    }
    div:nth-child(3) {
        padding: 0 2.778vw;
        display: flex;

        p{
            margin-right: 10px;
            display: flex;
            align-items: center;
            color: #757575;
            span:nth-child(1) {
                margin-right: 3px;
                font-size: 21px;
            }
            span:nth-child(2) {
                font-size: 13px;
            }
        }
        .activeColor{
            color: #fb7299;
        }
    }

}

.detailparent {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .detailitem {
    margin: 1.389vw 0;
    width: 45%;
  }
}

video{
	// visibility: hidden;
}
</style>
