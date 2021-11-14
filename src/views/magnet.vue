<template>
	<div>
		<van-sticky >
			<van-cell  style="z-index:99999;"  icon="arrow-left" title="资源搜索"  @click="returnPage"/>
		</van-sticky>
		<van-search
		  v-model="value"
		  show-action
		  placeholder="请输入搜索关键词"
		  @click="onSearch"
		>
		<div slot="action" @click="onSearch">搜索</div>
		</van-search>
		<div v-if="magnetList.length > 0">
			<van-cell-group style="text-align: initial;">
				<!-- <van-cell title="磁力" value="" /> -->
			</van-cell-group>
			<van-cell :title="item.torrentName" v-for="(item,index) in magnetList" :key="index">
				<div style="margin-left: 2rem;float: left;">
					{{item.size}}
				</div>
			  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
			  <van-button type="default" size="mini" v-clipboard:copy="item.magnet" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</van-button>
			</van-cell>
		</div>
		<div v-if="magnetList.length == 0 ">
			搜索内容未找到
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return {
			value:'',
			magnetList:[]
		}
	},
	methods:{
		onCopy(){
			this.$msg.success('复制成功')
		},
		// 复制失败
		onError(){
			this.$msg.fail('复制失败')
		},
		returnPage(){
			this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			this.$router.go(-1)
		},
		onSearch(){
			if(this.value){
				this.search = false
				this.$http.get("/magnet/queryMagnet?name=" + this.value).then(res=>{
					this.magnetList = res.data
				})
			}
		}
	}
}
</script>

<style scoped>
</style>
