<template>
	<div style="position: relative;height:9rem;overflow: auto;">
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
			Highlightlist: [
					{img: './static/emoticom/aojiao.png'},	
					{img: './static/emoticom/goutou.png'},
					{img: './static/emoticom/baozang.png'},
					{img: './static/emoticom/bixin.png'},
					{img: './static/emoticom/chigua.png'},
					{img: './static/emoticom/call.png'},
					{img: './static/emoticom/daku.png'},
					{img: './static/emoticom/daxiao.png'},
					{img: './static/emoticom/dai.png'},
					{img: './static/emoticom/haixiu.png'},
					{img: './static/emoticom/huaji.png'},
					{img: './static/emoticom/jingli.png'},
					{img: './static/emoticom/maotou.png'},
					{img: './static/emoticom/jingkong.png'},
					{img: './static/emoticom/jingya.png'},
					{img: './static/emoticom/kaixin.png'},
					{img: './static/emoticom/koubi.png'},
					{img: './static/emoticom/ku.png'},
					{img: './static/emoticom/leng.png'},
					{img: './static/emoticom/liuhan.png'},
					{img: './static/emoticom/nanshou.png'},
					{img: './static/emoticom/nu.png'},
					{img: './static/emoticom/se.png'},
					{img: './static/emoticom/shengbing.png'},
					{img: './static/emoticom/siren.png'},
					{img: './static/emoticom/suan.png'},
					{img: './static/emoticom/tiaopi.png'},
					{img: './static/emoticom/toumiao.png'},
					{img: './static/emoticom/touxiao.png'},
					{img: './static/emoticom/tu.png'},
					{img: './static/emoticom/wunai.png'},
					{img: './static/emoticom/wuyu.png'},
					{img: './static/emoticom/xiaoku.png'},
					{img: './static/emoticom/xu.png'},
					{img: './static/emoticom/zan.png'}
							  ]
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
