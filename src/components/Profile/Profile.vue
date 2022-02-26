<template>
	<div>
<div class="profile">
    <!-- <tip ref="tip"></tip> -->
<!--    <confirm :text="'是否保删除该视频'"
      @confirm="confirm"
      @cancel="cancel"
      ref="confirm"></confirm> -->
    <me-tab class="fiexedtop"
      :videoNum="videoNum"
      :likeNum="likeNum"
      v-show="fiexedtopshow"></me-tab>
    <div class="backbtn-wrap" :class="{showbgcolor: fiexedtopshow}">
      <span class="backbtn iconfont icon-left" v-show="this.$route.params.id !== 'me'" @click.stop="GoBack"></span>
      <p class="name" :class="{showname: fiexedtopshow}" v-text="userInfo.person_name"></p>
      <div class="dotbtn iconfont icon-ellipsis" v-show="this.$route.params.id === 'me'" @click="showMenu = !showMenu">
        <transition name="up">
            <div class="more-menu" v-show="showMenu">
              <div class="menu-item" @click="showModifyInfomation = true">
                修改个人资料
              </div>
              <div class="menu-item" @click="logout">
                注销
              </div>
            </div>
        </transition>
      </div>
    </div>
    <div class="background" :style="bgimgStyle" @touchstart.prevent>
      <!-- <img class="bg" src="./1.jpg" alt=""> -->
	  <!-- <van-image fit="cover" class="bg" src="../../../assets/beijing.jpg" /> -->
	  <img class="bg" src="@/assets/beijing.jpg" style="object-fit:none;" alt="">
    </div>
    <scroll class="bottom"
            :probeType="3"
            :listenScroll="true"
            @scroll="scrollHandler"
            ref="scroll"
            @click="showCommentList=false"
            :pullup="true"
            @scrollToEnd="scrollToEnd">
      <div class="profile">
        <div class="avatar-wrap">
          <!-- <img class="avatar" :src="`${baseURL}${userInfo.userAvatar}`" alt=""> -->
		  <img src="@/assets/user_1.png"  class="avatar" >
        </div>
        <div class="name-wrap">
          <p class="name" v-text="userInfo.person_name" style="text-align:left"></p>
          <!-- <p class="subname">抖音号：{{userInfo.userId}}</p> -->
          <div class="btn" v-if="userInfo.myRelation" :class="{'btn-inactive': ['follow', 'both'].includes(userInfo.myRelation) ? true : false}" @click="triggerFollow(userInfo)" v-html="getBtnHtml(userInfo.myRelation)"></div>
        </div>
        <div class="desc-wrap" style="position: relative;">
          <p class="desc" v-text="userInfo.userDesc"></p>
          <div class="gender">
            <!-- <div class="icon iconfont" ></div> -->
            {{userInfo.person_nationality}}
          </div>、
		  <div style="position: absolute;
    top: 0;
    right: 0;
    color: white;">
			  <van-button v-if="collStatus == '否'" type="default" size="mini" style="width:6rem;color:white;background: #fc345d;border:#fc345d;border-radius:5px;" @click="collectionPersonClick">+ 关注</van-button>
			  <van-button v-if="collStatus == '是'" type="default" size="mini" style="width:6rem;color:black;background: white;border:#fc345d;border-radius:5px;" @click="collectionPersonClick">已关注</van-button>
		  </div>
          <div class="num-wrap">
            <p>{{byLikeNum}}获赞</p>
            <p @click="GoInterestList">{{followerNum}}关注</p>
            <p @click="GoFanList">{{fanNum}}粉丝</p>
          </div>
        </div>
       <div class="wrap">
          <me-tab
            :videoNum="videoNum"
            :likeNum="likeNum"></me-tab>
          <keep-alive>
          <router-view
              ref="routerView"
              @click.native.capture="closeCommentList"
              @showCommentList="fetchCommentsAndShowList"
              :userInfo="userInfo"
              @chooseVideo="chooseVideo"
              @delVideo="delVideo"></router-view>
			  
          </keep-alive>
        </div>
      </div>
    </scroll>
	
   <!-- <transition name="up">
      <comment-list
        v-if="showCommentList"
        :commentList="commentList"
        :commentNum="commentNum"
        :currentCommentVideoId="currentCommentVideoId"
        @close="closeCommentList"
        @scrollToEnd="fetchCommentsAndShowList"></comment-list>
    </transition> -->
    
   <!-- <transition name="left">
      <modify-infomation
        v-if="showModifyInfomation"
        @InfomationChanged="InfomationChanged"
        @closeModifyInfomation="showModifyInfomation = false"></modify-infomation>
    </transition> -->
</div style="z-index:9999">
<transition name="left">
      <play-list-detail
        class="play-list"
        ref="playListDetail"
        v-show="showPlayList"
        @close="showPlayList=false"></play-list-detail>
    </transition>
</div>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import MeTab from '@/components/MeTab/MeTab'
import CommentList from '@/components/CommentList/CommentList'
import playListDetail from '@/components/PlayList/PlayListDetail'
import ModifyInfomation from '@/components/ModifyInfomation/ModifyInfomation'
// import Confirm from '@/base/confirm/confirm'
import { mapGetters, mapMutations } from 'vuex'
import { deduplicateCommentList } from '@/common/js/util'

const VIDEO_NUM_PER_REQUEST = 10

export default {
  created () {
	  $('#app').css('background','#161622')
	// 查询人员数据
	  this.loadPerson();
	  // 设置用户页面
	  this.userInfo.pageNum = 0
	  this.userInfo.pageSize = 10
	  this.getVideoNum();// 加载作品数量
    // if (this.$route.params.id === 'me') {
    //   this.userInfo = this.loginInfo
    //   let userId = this.userInfo.userId
    //   this.getFollowerNum(userId)
    //   this.getFanNum(userId)
    //   this.getByLikeNum(userId)
    //   this.getLikeNum(userId)
    //   this.getVideoNum(userId)
    // } else {
    //   this.$axios.get(`/api/user/${this.$route.params.id}/getUserInfo/${this.loginInfo.userId}`).then((r) => {
    //     this.userInfo = r.data.data
    //     let userId = this.userInfo.userId
    //     this.getFollowerNum(userId)
    //     this.getFanNum(userId)
    //     this.getByLikeNum(userId)
    //     this.getLikeNum(userId)
    //     this.getVideoNum(userId)
    //   })
    // }
  },
  data () {
    return {
      timer: null,
      userInfo: {},
      fanNum: 0,
      likeNum: 0,
      videoNum: 0,
      byLikeNum: 0,
      followerNum: 0,
      bgimgHeight: 150,
	  collStatus:false,// 收藏状态
      showMenu: false,
      showPlayList: false,
      fiexedtopshow: false,
      showCommentList: false,
      showModifyInfomation: false,
      commentList: [],
      currentCommentVideoId: ''
    }
  },
  computed: {
    bgimgStyle () {
      let height = Math.max(150, this.bgimgHeight)
      let scale = height / 150
      return {
        height: height + 'px',
        transform: `scaleX(${scale})`
      }
    },
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
	  selectItem (item) {
	    this.$router.push(`/profile/${item.userId}`)
	  },

	async loadPerson(){
		const res = await this.$http.post("/person/queryPerson", {
		  pageNum: 1,
		  pageSize: 10,
		  personType:this.$route.params.type,
		  personId: this.$route.params.id,
		  personLabel:'avperformer_91'
		})
		console.log(res)
		this.userInfo = res.data.data.list[0]
	},
	  
    InfomationChanged (userinfo) {
      this.userInfo = Object.assign({}, this.loginInfo, userinfo)
      this.userInfo.userAvatar += `?v=${Math.random()}`
    },
    scrollHandler (pos) {
		console.log('滚动.....')
      if (this.showCommentList) {
        this.showCommentList = false
        this.currentCommentVideoId = ''
        this.isEnd = false
      }
      if (pos.y > 0) {
        this.bgimgHeight = pos.y + 150
      }
      if (pos.y < -360) {
        this.fiexedtopshow = true
      } else {
        this.fiexedtopshow = false
      }
    },
    scrollToEnd () {
		console.log('------------------------')
      if (this.$route.name === 'profile/likes') {
        let page = this.$refs.routerView.page
        if (page * VIDEO_NUM_PER_REQUEST < this.likeNum) this.$refs.routerView.fetchLikeList()
      } else {
        let page = this.$refs.routerView.page
        if (page * VIDEO_NUM_PER_REQUEST < this.videoNum) this.$refs.routerView.fetchLikeList()
      }
    },
    closeCommentList (e) {
      if (this.showCommentList) {
        this.currentCommentVideoId = ''
        e.stopPropagation()
        this.showCommentList = false
      }
    },
    fetchCommentsAndShowList (videoId, commentNum) {
		console.log('00000000000000000')
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
    GoBack () {
	$('#app').css('background','white')  
      // this.$router.back()
	  this.$router.go(-1)
    },
    GoInterestList () {
      this.$router.push(`/InterestList/${this.$route.params.id}`)
    },
    GoFanList () {
      this.$router.push(`/FanList/${this.$route.params.id}`)
    },
    chooseVideo (index) {
		// 层级问题,先隐藏解决
		setTimeout(()=>{
			$('.profile').css('visibility','hidden')
		},500)
		// alert(10)
		console.log(index)
		console.log(this.commentList)
		// this.CLEAN_PLAYLIST_DETAIL()
		// this.SET_PLAYLIST_DETAIL(this.commentList)
		console.log(this.$refs.playListDetail)
      this.showPlayList = true
      this.$refs.playListDetail.scrollToIndex(index)
	  
	  // this.showPlayList = true
	  // console.log(this.searches)
	  // this.CLEAN_PLAYLIST()
	  // this.SET_PLAYLIST(this.searches)
	  // // console.log('索引' + index)
	  // this.$refs.playList.scrollToIndex(index)
    },
    delVideo (videoId) {
      this.$refs.confirm.show()
    },
    confirm () {
      this.$refs.tip.show('暂不支持删除')
    },
    cancel () {

    },
    triggerFollow (item) {
      if (this.timer) return
      this.timer = setTimeout(() => {
        this.$axios.get(`/api/user/${this.loginInfo.userId}/triggerFollow/${item.userId}`).then(res => {
          if (this.$route.params.id === 'me') {
            if (res.data.data.includes('取消')) {
              this.$refs.tip.show('取关成功')
              item.bothStatus = false
            } else {
              this.$refs.tip.show('关注成功')
              item.bothStatus = true
            }
          } else {
            if (res.data.data.includes('取消')) {
              this.$refs.tip.show('取关成功')
              switch (item.myRelation) {
                case 'follow': item.myRelation = 'none'; break
                case 'both': item.myRelation = 'fan'; break
              }
            } else {
              this.$refs.tip.show('关注成功')
              switch (item.myRelation) {
                case 'fan': item.myRelation = 'both'; break
                case 'none': item.myRelation = 'follow'; break
              }
            }
          }
          this.$socket.emit('sendTriggerFollow', {
            fromUserId: this.loginInfo.userId,
            toUserId: item.userId
          })
          this.timer = null
        }).catch(e => {
          this.$refs.tip.show('网络错误')
          this.timer = null
        })
      }, 300)
    },
    getBtnHtml (myRelation) {
      switch (myRelation) {
        case 'fan':
        case 'none': return '关注'
        case 'follow': return '已关注'
        case 'both': return '互相关注'
      }
    },
    async logout () {
      let res = await this.$axios.get(`/api/user/${this.loginInfo.userId}/logout`)
      if (res.data.code === 200) {
        this.SET_ISLOGGED(false)
        this.$socket.emit('logout', this.loginInfo.userId)
        this.SET_LOGININFO({})
        this.SET_FANUNREADNUM(0)
        this.$router.push('/home')
      }
    },
    async getFollowerNum (userId) {
      let res = await this.$axios.get(`/api/user/${userId}/FollowersNum`)
      if (res.data.code === 200) {
        this.followerNum = res.data.data
      }
    },
    async getFanNum (userId) {
      let res = await this.$axios.get(`/api/user/${userId}/FansNum`)
      if (res.data.code === 200) {
        this.fanNum = res.data.data
      }
    },
    async getByLikeNum (userId) {
      let res = await this.$axios.get(`/api/user/${userId}/byLikesNum`)
      if (res.data.code === 200) {
        this.byLikeNum = res.data.data
      }
    },
    async getLikeNum () {
  //     let res = await this.$http.get(`/person/queryPersonVariousNum?personId=` + this.$route.params.id)
	 //  // console.log(res.data.videoTotal)
  //     if (res.status == 200) {
  //       this.likeNum = res.data.videoTotal
		// console.log(this.likeNum)
  //     }
	  
    },
    async getVideoNum () {
      // let res = await this.$axios.get(`/api/user/${userId}/VideosNum`)
      // if (res.data.code === 200) {
      //   this.videoNum = res.data.data
      // }
	  
	  let res = await this.$http.get(`/person/queryPersonVariousNum?personId=` + this.$route.params.id)
	  // console.log(res.data.videoTotal)
	  if (res.status == 200) {
	    this.videoNum = res.data.videoTotal
		this.collStatus = res.data.personCollStatus
	  }
    },
	//收藏人员
	async collectionPersonClick() {
	   if(localStorage.getItem('token')){
	     // 判断显示状态,是收藏还是取消收藏
	     if(this.collStatus == '否'){
	       const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'2'})
	       // console.log(res)
	       if(res.data.data == '收藏成功'){
	           // this.collectionActive = true
					this.collStatus = '是'
	       }else{
	           // this.collectionActive = false
	           this.$msg.fail(res.data.message)
	       }
	     } else {
	       const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'2'})
	       if(res.data.data == '取消成功'){
			 this.collStatus = '否'
				  // this.collectionActive = false
	       } else {
	          this.$msg.fail(res.data.message)
	       }
	     }
	
	        // this.$msg.fail(res.data.msg)
	   }
	},
    ...mapMutations([
      'SET_ISLOGGED',
      'SET_LOGININFO',
      'SET_FANUNREADNUM',
	  'SET_PLAYLIST_DETAIL',
	  'CLEAN_PLAYLIST_DETAIL',
    ])
	// ...mapMutations([
	//   'SET_PLAYLIST',
	//   'CLEAN_PLAYLIST',
	//   'APPEND_PLAYLIST'
	// ])
  },
  watch: {
	  showPlayList(bef){
		  if(!bef){
			  $('.profile').css('visibility','visible')
		  }
	  },
    '$route': function () {
      if (this.showCommentList) {
        this.showCommentList = false
      }
      this.$nextTick(() => {
        this.fiexedtopshow = false
        this.$refs.scroll.refresh()
      })
    }
  },
  components: {
    Scroll,
    MeTab,
    CommentList,
    playListDetail,
    ModifyInfomation,
    // Confirm
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.up-enter-active, .up-leave-active
  transition all .5s
.up-enter, .up-leave-to
  opacity 0
  transform translateY(100%)
.left-enter-active, .left-leave-active
  transition all .5s
.left-enter, .left-leave-to
  opacity 0
  transform translateX(100%)
.play-list
  position fixed
  z-index 9999
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
.fiexedtop
  position fixed
  z-index 255
  top 42px
  left 0
  right 0
  background $color-background
.showbgcolor
  background $color-background
.backbtn-wrap
  position fixed
  top 0
  height 42px
  width 100%
  display flex
  z-index 255
  align-items center
  transition all 0.3s
  .name
    visibility hidden
    text-align center
    flex 1
  .showname
    visibility visible
  .backbtn
    margin-left 10px
    padding 8px
    background rgba(22, 24, 35, .6)
    border-radius 50%
    font-size $font-size-small
  .dotbtn
    position relative
    margin-right 10px
    padding 8px
    background rgba(22, 24, 35, .6)
    border-radius 50%
    font-size $font-size-small
    font-weight 600
    .more-menu
      position absolute
      top 40px
      right -2px
      width 80px
      display flex
      flex-direction column
      background rgba(22, 24, 35, .6)
      .menu-item
        flex 1
        line-height 44px
        height 44px
        width 100%
        text-align center
      &:after
        display block
        position absolute
        top -16px
        right 8px
        border 8px solid transparent
        border-bottom 8px solid rgba(22, 24, 35, .6)
        content ''
.profile
  .background
    width 100%
    height 150px
    .bg
      width 100%
      height 100%
  .bottom
    position absolute
    top 0
    left 0
    bottom 0
    right 0
    margin 150px 0 44px 0
    .profile
      position relative
      width 100%
      background $color-background
      .logout
        position absolute
        top 20px
        right 20px
        padding 5px
        color $color-text
      .avatar-wrap
        position absolute
        left 10px
        top -15px
        border-radius 50%
        padding 5px
        width 80px
        height 80px
        background $color-background
        .avatar
          border-radius 50%
          width 100%
          height 100%
      .name-wrap
        position relative
        margin 0 10px
        padding 80px 10px 10px
        border-bottom 1px solid $color-divide
        .btn
          position absolute
          right 5px
          top 20px
          text-align center
          line-height 25px
          font-size $font-size-small
          margin-right 5px
          width 70px
          height 25px
          background rgb(248, 53, 95)
        .btn-inactive
          background rgb(56, 59, 68)
        .name
          color $color-white
          font-size $font-size-large-x
        .subname
          margin-top 5px
          color $color-white
          font-size $font-size-small
      .desc-wrap
        margin 10px
        .desc
          color $color-desc
          font-size $font-size-small
        .gender
          margin-top 10px
          padding 5px 8px
          border-radius 5px
          background rgba(67, 51, 63, 0.7)
          font-size $font-size-small-s
          max-width 50px
          color $color-desc
          .icon
            display inline-block
            width 10px
            height 10px
            font-size 10px
          .icon-man
            color #14bae2
          .icon-woman
            color #da6969
        .num-wrap
          margin-top 10px
          width 200px
          display flex
          justify-content space-between
        .num-wrap > p
          font-size $font-size-medium
        .wrap
          position relative
          height 100%
</style>
