<template>
  <div class="video" :style="'height:' + (windowHeight/1.2) + 'px'">
    <loading v-if="isLoading"></loading>
   <!-- <div v-if="!isLoading"> -->
    <div >
      <video-list
      :list="list"
      @chooseVideo="chooseVideo"
      @delVideo="delVideo"></video-list>
      <no-more class="no-more"></no-more>
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
	  pageSize:200,
      isLoading: true,
      list: []
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
      this.SET_PLAYLIST(this.list)
      this.$emit('chooseVideo', index)
	  
    },
    delVideo (videoId) {
      this.$emit('delVideo', videoId)
    },
    fetchVideoList () {
		console.log(this.$route.params)

		this.loadPersonWork();

      // let userId = this.$route.params.id === 'me' ? this.loginInfo.userId : this.$route.params.id
      // this.isLoading = true
      // this.page++
      // this.$axios.get(`/api/user/${userId}/Videos/page/${this.page}`).then((r) => {
      //   this.list = this.list.concat(r.data.data)
      //   this.isLoading = false
      // })
    },
	async loadPersonWork(){
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
				personId:this.$route.params.id
			  })
			  console.log(res)
			  this.isLoading = false
			  this.list = res.data.data.list
			  top.aa = this.$parent
			  this.$parent.commentList = this.$parent.$parent.commentList.concat(this.list)
			  
			  // this.$set(this.$parent,'videoNum',res.data.data.total)
			  // this.$parent.videoNum = res.data.data.total
			  // this.APPEND_PLAYLIST(this.commentList)
	},
    ...mapMutations([
      'SET_PLAYLIST'
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
