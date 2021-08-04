<template>
	<div style="position: relative;height:9rem;">
	  <div class="mui-scroll-wrapper" >
		<div class="mui-scroll">
			<div>
			<van-image
					style="padding:7px"
					@click="selectSmile(item)"
					width="2rem"
					height="2rem"
					v-for="item in Highlightlist"
					:src="item.img" rel="external nofollow" 
				 />
			</div>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return {
			Highlightlist: [
								{img: './static/emoticom/傲娇.png'},	
								{img: './static/emoticom/狗头.png'},
								{img: './static/emoticom/爆赞.png'},
								{img: './static/emoticom/比心.png'},
								{img: './static/emoticom/吃瓜.png'},
								{img: './static/emoticom/打call.png'},
								{img: './static/emoticom/大哭.png'},
								{img: './static/emoticom/大笑.png'},
								{img: './static/emoticom/呆.png'},
								{img: './static/emoticom/害羞.png'},
								{img: './static/emoticom/滑稽.png'},
								{img: './static/emoticom/锦鲤.png'},
								{img: './static/emoticom/猫头.png'},
								{img: './static/emoticom/惊恐.png'},
								{img: './static/emoticom/惊讶.png'},
								{img: './static/emoticom/开心.png'},
								{img: './static/emoticom/抠鼻.png'},
								{img: './static/emoticom/哭.png'},
								{img: './static/emoticom/冷.png'},
								{img: './static/emoticom/流汗.png'},
								{img: './static/emoticom/难受.png'},
								{img: './static/emoticom/怒.png'},
								{img: './static/emoticom/色.png'},
								{img: './static/emoticom/生病.png'},
								{img: './static/emoticom/死人.png'},
								{img: './static/emoticom/酸.png'},
								{img: './static/emoticom/调皮.png'},
								{img: './static/emoticom/偷瞄.png'},
								{img: './static/emoticom/偷笑.png'},
								{img: './static/emoticom/吐.png'},
								{img: './static/emoticom/无奈.png'},
								{img: './static/emoticom/无语.png'},
								{img: './static/emoticom/笑哭.png'},
								{img: './static/emoticom/嘘.png'},
								{img: './static/emoticom/赞.png'}
							  ]
		}
	},
	mounted(){
		mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
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
