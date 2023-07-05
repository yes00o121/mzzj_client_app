<template>
	<div>
		<van-sticky>
			<van-nav-bar v-if="!showSearch" :title="title" left-text="返回" left-arrow @click-left="returnPage" @click-right="buttonClick">
				<!-- 查询 -->
			  <van-icon name="search" slot="right" v-if="rightButtonType == 'search'" size="1.5rem"/>
			  <van-icon name="wap-home-o" slot="right" v-if="rightButtonType == 'home'" size="1.5rem"/>
			</van-nav-bar>
			<form action="/" v-if="showSearch">
			  <van-search
			    v-model="searchTxt"
				input-align="center"
			    show-action
				shape="round"
				left-icon=""
			    placeholder="请输入搜索关键词"
			    @search="onSearch"
			    @cancel="onCancel"
			  />
			</form>
		</van-sticky>
	</div>
</template>

<script>
export default{
	props:{
		title : {
			type : String,
			default : ''
		},
		// 右侧按钮类型
		rightButtonType : {
			type : String,
			default : 'home'
		}
	},
	data(){
		return {
			showSearch : false,// 是否显示查询窗口
			searchTxt: '',// 搜索内容
			buttons : [{
				type : 'search',
				name : '查询按钮',
				event : 'showSearchWin',
				runType : '0'
			},{
				type : 'custom',
				name : '自定义按钮',
				event : 'navBarCustom',
				runType : '1'
			},{
				type : 'home',
				name : '首页按钮',
				event : 'toHome',
				runType : '0'
			}]
		}
	},
	methods:{
		showSearchWin(_this){
			_this.showSearch = true;
		},
		onCancel(){
			this.showSearch = false;
		},
		onSearch(){
			console.log('触发查询...')
			this.$emit('onSearch',this.searchTxt)
		},
		returnPage(){
			this.$router.go(-1)
		},
		toHome(){
			console.log('跳转首页..')
		},
		// 右侧按钮
		buttonClick(){
			console.log('点击按钮....')
			let _this = this;
			this.buttons.forEach((item,index)=>{
				
				if(item.type == this.rightButtonType){
					if(item.runType == '1'){
						
					}
					if(item.runType == '0'){
						console.log(this.$options.methods)
						console.log(item.event)
						this.$options.methods[item.event](this)
					}
				}
			})
			
			// for(let item of this.buttons){
			// 	console.log(this)
			// 	if(item.type == this.rightButtonType){
			// 		if(item.runType == '1'){
						
			// 		}
			// 		if(item.runType == '0'){
			// 			this.$options.methods[item.event](this)
			// 		}
			// 	}
			// }
			
			// for(let (index,item) in this.buttons){
			// 	if(item.type == this.rightButtonType){
			// 		if(item.runType == '1'){
						
			// 		}
			// 		if(item.runType == '0'){
			// 			this.$options.methods[item.event](this)
			// 		}
			// 	}
			// }
		}
	}
}
</script>

<style scoped>
	/*  */
/* /deep/ .van-icon-search{
	top: 5px;
	right: 2px;
} */
</style>
