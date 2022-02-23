<template>
	<div style="position: relative;height:9rem;overflow: auto;background:#f4f4f4">
	  <!-- <div class="mui-scroll-wrapper" > -->
		<!-- <div class="mui-scroll"> -->
			<div>
			<!-- <van-image
					style="padding:7px"
					@click="selectSmile(item)"
					width="2rem"
					height="2rem"
					v-for="item in Highlightlist"
					:key="item.img"
					:src="item.img" rel="external nofollow" 
				 /> -->
	<!-- 			 <van-list
				   :finished="true"
				   finished-text="没有更多了"
				 > -->
				   <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
				   <van-image
				   		style="padding:7px;float:left"
				   		@click="selectSmile(item)"
				   		width="2rem"
				   		height="2rem"
				   		v-for="item in Highlightlist"
				   		:key="item.img"
				   		:src="item.img" rel="external nofollow" 
				   	 />
					 <!-- <div v-for="item in Highlightlist">{{item.img}}</div> -->
					 
				 <!-- </van-list> -->
			</div>
			<!-- </div> -->
		<!-- </div> -->
	</div>
</template>

<script>
export default{
	data(){
		return {

		}
	},
	mounted(){
		// mui('.mui-scroll-wrapper').scroll({
		// deceleration: 0.6 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		// });
	},	
	methods:{
		// 选择表情
		selectSmile(item){
			// 地址截取,保留图片名称
			console.log(item.img)
			const name = item.img.replace('./static/emoticom/','').replace('.png','')
			console.log(name)
			// 表情追加
			this.$emit('selectSmile','['+name+']',null)
			// this.appendContent('['+name + ']');
		}
	}
}
</script>

<style>
</style>
