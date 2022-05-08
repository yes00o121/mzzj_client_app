<template>
	<v-touch  v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" :style="'touch-action: pan-y!important;width:100%;height:'+windowHeight+'px'" :swipe-options="{direction: 'horizontal'}">
	<div>
		  <van-sticky>
		  	<van-cell  style="z-index:999;width:100%;"  icon="arrow-left" class="van-ellipsis" title="消息"  @click="returnPage">
		  		<van-icon
		  		    slot="right-icon"
		  		    name="wap-home-o"
		  			size="1.2rem"
		  		    style="line-height: inherit;"
		  			@click.stop="$router.push('/')"
		  		  />
		  	</van-cell>
		  </van-sticky>
		<temp-list v-for="(item,index) in dataList" :detailitem="item" ></temp-list>
		<span v-for="(item,index) in list" :key="index">
			<van-button type="primary" @click="toPage(item)">{{item.title}}</van-button>
		</span>
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
		}
	},
	created(){
		this.$msg.loading({
		  message: '加载中...',
		  duration:0,
		  // forbidClick: true,
		  loadingType: 'spinner'
		});
		this.$http.get('/temp/list').then((res)=>{
			console.log(res.data)
			this.list = res.data
			this.$msg.clear()
		})
	},
	methods:{
		returnPage(){
			// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			this.$router.go(-1)
		},
		toPage(item){
			// this.
			this.$msg.loading({
			  message: '加载中...',
			  duration:0,
			  // forbidClick: true,
			  loadingType: 'spinner'
			});
			this.$http.get('/temp/getPageAll?url=' + item.videoUrl).then((res)=>{
				console.log(res)
				this.dataList = res.data
				this.$msg.clear()
			})
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
