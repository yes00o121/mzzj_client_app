<template>
	<v-touch  v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" :style="'touch-action: pan-y!important;width:100%;height:'+windowHeight+'px'" :swipe-options="{direction: 'horizontal'}">
	<div>
<!-- 		  <van-sticky>
		  	<van-cell  style="z-index:999;width:100%;"  icon="arrow-left" class="van-ellipsis" title="消息"  @click="returnPage">
		  		<van-icon
		  		    slot="right-icon"
		  		    name="wap-home-o"
		  			size="1.2rem"
		  		    style="line-height: inherit;"
		  			@click.stop="$router.push('/')"
		  		  />
		  	</van-cell>
		  </van-sticky> -->
		 <div style="height:100px;margin-top:100px;">
			  {{baseURL + '/' + path +  temp}}
		 </div>
		  <!-- <video :src="baseURL + '/video/video/' + temp" style="height:300px;width:300px;"></video> -->
		  <video   ref="videoPlayer" style="height:300px"  class="container video-js vjs-big-play-centered vjs-fluid" :src="baseURL + '/video/video/'+ path + temp+''" controls="controls"></video>
		<temp-list v-for="(item,index) in dataList" :detailitem="item.name" ></temp-list>
		<span v-for="(item,index) in list" :key="index">
			<van-button type="primary" @click="toPage(item)">{{item.name}}</van-button>
		</span>
		<van-image :src="baseURL + '/video/video/' + path +temp+''" />
	</div>
	</v-touch>
</template>

<script>
	import tempList from '@/views/tempList.vue'
export default {
	components:{
		tempList
	},
	data(){
		return {
			list:[],
			dataList:[],
		    Item:{},
			temp:'',
			img:'',
			path:''
		}
	},
	created(){
		// this.$msg.loading({
		//   message: '加载中...',
		//   duration:0,
		//   // forbidClick: true,
		//   loadingType: 'spinner'
		// });
		// this.$http.get('/temp/list').then((res)=>{
		// 	console.log(res.data)
		// 	this.list = res.data
		// 	this.$msg.clear()
		// })
		this.$http.post('/webInfoDetailData/queryVideoRandom',{}).then((res)=>{
			console.log(res.data)
			this.list = res.data
			// this.$msg.clear()
		})
		
		
	},
	methods:{
		returnPage(){
			// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			this.$router.go(-1)
		},
		toPage(item){
			if(!item.name.endsWith('mp4') && !item.name.endsWith('jpg')){
				if(!item.path){
					item.path = ''
				}
				this.$http.post('/webInfoDetailData/queryVideoRandom',{name: item.path + item.name +'/' }).then((res)=>{
					console.log(res.data)
					this.list = res.data
					// this.$msg.clear()
				})
			}else{
				this.temp = item.path + item.name
				// window.open(this.baseURL + '/video/video/'+this.temp)
			}
			// console.log(item)
			// this.temp = item;
			// window.open(this.baseURL + '/video/video/'+item)
			// this.
			// this.$msg.loading({
			//   message: '加载中...',
			//   duration:0,
			//   // forbidClick: true,
			//   loadingType: 'spinner'
			// });
			// this.$http.get('/temp/getPageAll?url=' + item.videoUrl).then((res)=>{
			// 	console.log(res)
			// 	this.dataList = res.data
			// 	this.$msg.clear()
			// })
		},
		onSwipeLeft () {
		
		},
		onSwipeRight(){
				  console.log('滑动......')
			if(localStorage.slideReturn == 1){
				this.$router.go(-1)
			}
		},
	}
}
</script>

<style>
</style>
