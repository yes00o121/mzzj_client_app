<template>
  <div class="video" :style="'height:' + (windowHeight* ((page + 1)/ 2.2) + 200) + 'px'">
    <loading v-if="isLoading"></loading>
   <!-- <div v-if="!isLoading"> -->
    <div >
      <video-list
      :list="list"
      @chooseVideo="chooseVideo"
      @delVideo="delVideo"></video-list>
      <no-more class="no-more" v-if="isBottom"></no-more>
    </div>
  </div>
</template>

<script>
import VideoList from '@/components/VideoList/VideoList'
import NoMore from '@/base/NoMore/NoMore'
import Loading from '@/base/loading/loading'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      page: 0,
	  pageSize:12,
      isLoading: true,
      list: [],
	  isBottom:false// 是否没有更多数据
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  created () {
    this.fetchVideoList()
  },
  methods: {
    chooseVideo (index) {
      this.SET_PLAYLIST_DETAIL(this.list)
      this.$emit('chooseVideo', index)
	  
    },
	// 加载新数据
	fetchLikeList(){
		this.loadVideo()
	},
    delVideo (videoId) {
      this.$emit('delVideo', videoId)
    },
    fetchVideoList () {
		console.log(this.$route.params)

		this.loadVideo();

      // let userId = this.$route.params.id === 'me' ? this.loginInfo.userId : this.$route.params.id
      // this.isLoading = true
      // this.page++
      // this.$axios.get(`/api/user/${userId}/Videos/page/${this.page}`).then((r) => {
      //   this.list = this.list.concat(r.data.data)
      //   this.isLoading = false
      // })
    },
	async loadVideo(){
			  this.page += 1
			  // const res = await this.$http.post("/person/queryWebInfoDataByPersonId", {
			  //   pageNum: this.page,
			  //   pageSize: this.pageSize,
			  //   personId: this.$route.params.id
			  // })
			  // this.list = res.data.data.list
			  // this.isLoading = false
			  // this.$parent.commentList = res.data.data.list
			  
			  const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
			    pageNum: this.page,
			      pageSize: this.pageSize,
			    search: '',
			    loadMode: 4,
				personId:this.$route.params.id,
				sortType:2// 正序
			  })
			  console.log(res.data.data.list)
			  this.isLoading = false
			  // this.list = this.list.push(...res.data.data.list)
			  this.list.push(...res.data.data.list)
			  // top.aa = this.$parent
			  console.log(this.list)
			  // this.$parent.commentList = this.$parent.$parent.commentList.concat(this.list)
			  // this.$parent.commentList = this.list
			  // this.CLEAN_PLAYLIST_DETAIL();
			  // this.$set(this.$parent,'videoNum',res.data.data.total)
			  // this.$parent.videoNum = res.data.data.total
			  this.APPEND_PLAYLIST_DETAIL(res.data.data.list)
			  if(res.data.data.total <= this.list.length){
				  this.isBottom = true
			  }
			  this.$nextTick(()=>{
				  console.log('222222222222222222')
				  console.log(this)
				  // top.a = this.$parent
				  // this.$parent.scroll.refresh()
			  })
	},
    ...mapMutations([
      'SET_PLAYLIST_DETAIL',
	  'APPEND_PLAYLIST_DETAIL',
	  'CLEAN_PLAYLIST_DETAIL'
    ])
  },
  components: {
    VideoList,
    NoMore,
    Loading
  }
}
</script>

<style scoped lang='stylus'>
.no-more
  margin-top 12px
</style>
