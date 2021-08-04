
<template>
   <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div">
  <div v-if="model">
      <nav-bar></nav-bar>
      <div class="detailinfo">
         <div class="video">
              <!-- <video controls="controls" :src="model.content"></video> -->
              <video  ref="videoPlayer" id="myVideo" class="video-js vjs-big-play-centered vjs-fluid" controls="controls"></video>
         </div>
         <div class="detailinfoText">
              <div>
                  <!-- <span>{{model.category.title}}</span> -->
                  <span>{{model.dictName}}</span>
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
                  </p>
                  <p>
                      <span class="icon-redo2"></span>
                      <span>分享</span>
                  </p> -->
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
		    return val.split('T')[0]
		  }
		  return "";
		},
	},
    methods:{

        onSwipeLeft () {
            // console.log('页面左滑')
          // this.$router.go(-1)
        },
        onSwipeRight(){
            // console.log('页面右滑')
            this.$router.go(-1)
        },
        //获取文章信息
        async articleitemData() {
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
            const date = new Date()
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
        PostChildClick(id) {
            this.Postcom.parent_id = id
            this.$refs.commentIpt.focusIpt()
        },
        //收藏文章
        async collectionClick() {
           if(localStorage.getItem('token')){
             // 判断显示状态,是收藏还是取消收藏
             if(!this.collectionActive){
               const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.$route.params.id})
               // console.log(res)
               if(res.data.data == '收藏成功'){
                   this.collectionActive = true
               }else{
                   // this.collectionActive = false
                   this.$msg.fail(res.data.message)
               }
             } else {
               const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.$route.params.id})
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
                    webInfoDetailDataId:this.$route.params.id
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
                         //初始化播放器
              this.myVideo = videojs(
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

        this.myVideo = null;
        // $('#myVideo').empty()
      if(this.myVideo){
        this.myVideo.destory();
      }
         this.articleitemData()
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

<style lang="less">
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

</style>
