<template>
	<div>
		<van-cell icon="arrow-left" title="设置"  @click="$router.go(-1)"/>
		<div v-for="(item,index) in configList" :key="index">
		<h2 class="van-doc-demo-block__title">{{item.configName}}</h2>
			<van-radio-group v-model="item.configValue" direction="horizontal" style="padding-left: 1rem;" >
			  <van-radio  v-for="(it,i) in item.detail" :name="it.detailConfigValue" @click="change(it)">{{it.detailConfigName}} </van-radio>
			<!--  <van-radio name="2"  @click="changeImage('2')">中</van-radio>
						<van-radio name="3"  @click="changeImage('3')">高</van-radio>
						<van-radio name="4"  @click="changeImage('4')">原画</van-radio> -->
			</van-radio-group>
		</div>
		  <!-- <h2 class="van-doc-demo-block__title">图片画质</h2>
		  <van-radio-group v-model="radio" direction="horizontal" style="padding-left: 16px;" >
		    <van-radio name="1" @click="changeImage('1')">低</van-radio>
		    <van-radio name="2"  @click="changeImage('2')">中</van-radio>
			<van-radio name="3"  @click="changeImage('3')">高</van-radio>
			<van-radio name="4"  @click="changeImage('4')">原画</van-radio>
		  </van-radio-group>
		  <h2 class="van-doc-demo-block__title">加载模式</h2>
		  <van-radio-group v-model="radioNum" direction="horizontal" style="padding-left: 16px;" >
		    <van-radio name="1" @click="changeSort('1')">正序</van-radio>
		    <van-radio name="2" @click="changeSort('2')">倒序</van-radio>
			<van-radio name="3" @click="changeSort('3')">随机</van-radio>
		  </van-radio-group>
		  <h2 class="van-doc-demo-block__title">视频重复过滤</h2>
		  <van-radio-group v-model="radioNum" direction="horizontal" style="padding-left: 16px;" >
		    <van-radio name="1" @click="changeVideoRule('0')">不过滤</van-radio>
		    <van-radio name="2" @click="changeVideoRule('1')">今日</van-radio>
			<van-radio name="2" @click="changeVideoRule('2')">七日</van-radio>
		  </van-radio-group> -->
		</van-radio-group>
		
	</div>
</template>

<script>
export default{
	data(){
		return {
			configList:[],// 配置集合
			radio:'2', // 图片画质
			radioNum:'1', // 排序方式
			imgQuality:'' ,
			loadMode:'',
			videoRule:'',
			// initStatus:true // 页面初始化状态,初始化时候不执行change方法
		}
	},
	created(){
		this.queryConfigAll();
	},
	methods:{
		async queryConfigAll(){
			this.configList = []
			// 查询用户配置信息
			const res = await this.$http.post('/config/queryConfigAll/',{})
			// console.log(res.data)
			let keys = Object.keys(res.data)
			for(let i =0;i<keys.length;i++){
				this.configList.push(res.data[keys[i]])
			}
			// console.log(this.configList)
		},
		// 初始化图片清晰度
		initImgQuality(res){
			this.imgQuality = res.data[0]
			// 图片质量,0.2低 ,0.5中, 0.8 高,1原画,对应1,2,3,4
			let imgQuality = res.data[0].configValue
			if(imgQuality == 0.2){
				this.radio = '1'
			}
			if(imgQuality == 0.5){
				this.radio = '2'
			}
			if(imgQuality == 0.8){
				this.radio = '3'
			}
			if(imgQuality == 1){
				this.radio = '4'
			}
		},
		// 初始化排序方式
		initSort(res){
			this.loadMode = res.data[1]
			this.radioNum = this.loadMode.configValue
		},
		// 初始化配置
		initConfig(res){
			// console.log(res)
			let data = res.data
			// console.log(data)
		},
		// 视频规则
		// initVideoRule(res){
		// 	this.videoRule = res.data[1]
		// 	this.radioNum = this.videoRule.configValue
		// },
		// 修改配置方法
		change(data){
			// console.log(data)
			// return;
			// if(this.initStatus){
			// 	return;
			// }
			// 配置存在，走修改
			if(data.uId){
				this.$http.post('/config/updateUserConfigValueById',{
					configValue: data.detailConfigValue,
					configKey:data.configKey,
					configId:data.id
				}).then(res=>{
					if(res.data.code == 200){
						if(data.id == 6){
							localStorage['back_top'] = data.detailConfigValue
						}
						if(data.id == 7){
							localStorage['slideReturn'] = data.detailConfigValue
						}
						if(data.id == 8){
							localStorage['manga_history_position'] = data.detailConfigValue
						}
					}else{
						this.$msg.fail(res.data.message)
					}
				})
			} else {
				// 配置不存在走新增
				this.$http.post('/config/insertConfigValue',{
					configKey:data.configKey,
					configValue: data.detailConfigValue,
					configId:data.id
				}).then(res=>{
					// console.log(res)
					if(res.data.code == 200){
						// 请求已配置数据,刷新配置信息
						if(data.id == 6){
							localStorage['back_top'] = data.detailConfigValue
						}
						if(data.id == 7){
							localStorage['slideReturn'] = data.detailConfigValue
						}
						if(data.id == 8){
							localStorage['manga_history_position'] = data.detailConfigValue
						}
						this.queryConfigAll()
					}else {
						this.$msg.fail(res.data.message)
					}
				})
			}
		},
		// 视频重复规则
		changeVideoRule(index){
			// if(index == '0'){
			// 	this.imgQuality.configValue = '0'
			// }
			// if(index == '1'){
				
			// }
			// if(index == '2'){
				
			// }
			this.imgQuality.configValue = index
			
		},
		changeImage(index){
			if(index == '1'){
				this.imgQuality.configValue = '0.2'
			}else if(index == '2'){
				this.imgQuality.configValue = '0.5'
			}else if(index == '3'){
				this.imgQuality.configValue = '0.8'
			}else if(index == '4'){
				this.imgQuality.configValue = '1'
			}
			// console.log(this.imgQuality.uId + '.....')
			// 配置存在，走修改
			this.changeConfig(this.imgQuality)
			// if(this.imgQuality.uId){
			// 	this.$http.post('/config/updateUserConfigValueById',{
			// 		configValue: this.imgQuality.configValue,
			// 		id:this.imgQuality.uId
			// 	}).then(res=>{
			// 		console.log(res)
			// 		if(res.data.code == 200){
						
			// 		}else{
			// 			this.$msg.fail(res.data.message)
			// 		}
			// 	})
			// } else {
			// 	// console.log('新增.....')
				
			// 	// 配置不存在走新增
			// 	this.$http.post('/config/insertConfigValue',{
			// 		configId:this.imgQuality.id,
			// 		configName: this.imgQuality.configName,
			// 		configValue: this.imgQuality.configValue
			// 	}).then(res=>{
			// 		// console.log(res)
			// 		if(res.data.code == 200){
			// 			// 请求已配置数据,刷新配置信息
			// 			this.queryConfigAll()
			// 		}else {
			// 			this.$msg.fail(res.data.message)
			// 		}
			// 	})
			// }
			// 修改用户图片画质配置
			// console.log(e)
			// const res = await this.$http.post('/config/deleteCollection/',{webInfoDetailDataId:this.videoList[this.current].id})
		},
		changeSort(){
			this.loadMode.configValue = this.radioNum
			this.changeConfig(this.loadMode)
			// if(this.loadMode.uId){
			// 	this.$http.post('/config/updateUserConfigValueById',{
			// 		configValue: this.loadMode.configValue,
			// 		id:this.loadMode.uId
			// 	}).then(res=>{
			// 		console.log(res)
			// 		if(res.data.code == 200){
						
			// 		}else{
			// 			this.$msg.fail(res.data.message)
			// 		}
			// 	})
			// } else {
			// 	// 配置不存在走新增
			// 	this.$http.post('/config/insertConfigValue',{
			// 		configId:this.loadMode.id,
			// 		configName: this.loadMode.configName,
			// 		configValue: this.loadMode.configValue
			// 	}).then(res=>{
			// 		// console.log(res)
			// 		if(res.data.code == 200){
			// 			// 请求已配置数据,刷新配置信息
			// 			this.queryConfigAll()
			// 		}else {
			// 			this.$msg.fail(res.data.message)
			// 		}
			// 	})
			// }
		}
	}
}
</script>

<style scoped>
	.van-doc-demo-block__title{
		margin: 0;
		padding: 32px 16px 16px;
		color: rgba(69, 90, 100, 0.6);
		font-weight: normal;
		font-size: 14px;
		line-height: 16px;
		text-align: initial;
	}
</style>
