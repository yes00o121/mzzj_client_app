<!-- 搜索工具 -->
<template>
	<div v-show="show">
		<van-dropdown-menu>
		  <van-dropdown-item :value="searchParams.searchSortType" :options="option1" @change="onConfirm1" />
		  <van-dropdown-item :value="searchParams.videoLoadTime" :options="option2" @change="onConfirm2" />
		  <!-- <van-dropdown-item :value="value2" :options="option2" @change="onConfirm2" /> -->
		</van-dropdown-menu>
		<!-- <van-sticky> -->
		<!-- <van-tabs v-model="active" animated>
		  <van-tab v-for="index in 1" title="视频">
			<div v-show="active == 0"  style="display: flex;z-index:9999">
				<van-collapse v-model="sortNames"  @change="change" style="z-index:9999">
				  <van-collapse-item :title="curSort.name" name="1" style="z-index:9999">
				  </van-collapse-item> -->
				  <!-- <van-collapse-item title="全部时长" name="2"></van-collapse-item>
				  <van-collapse-item title="全部标签" name="3"></van-collapse-item> -->
	<!-- 			</van-collapse>
				<van-collapse v-model="timeNames"  @change="change">
					<van-collapse-item title="全部时长" name="2" >
					</van-collapse-item>
				</van-collapse>
				<van-collapse v-model="labelNames"  @change="change">
					<van-collapse-item title="全部标签" name="3" >
					</van-collapse-item>
				</van-collapse>
			</div>
		  </van-tab>
		</van-tabs> -->
		<!-- <div style="display: flex;font-size:12px;z-index:1400;background: white;" v-show="sortNames.length > 0" >
			<div style="padding: 0 20px;z-index:5" v-for="item in sortArr" :key="item.value" :style="(curSort.value == item.value ? 'color:#c7254e;' : '') +'z-index:1400;background: white;margin-top:-20px' " @click="sortClick(item)">
				{{item.name}}
			</div>
		</div>
		<div style="display: flex;font-size:12px" v-show="timeNames.length > 0" >
			<div style="padding: 0 10px;z-index:5" v-for="item in timeArr" :key="item.value" :style="(item.select ? 'color:#c7254e;' : '') +'z-index:1400;background: white;margin-top:-20px' ">
				{{item.name}}
			</div>
		</div>
		<div style="display: flex;font-size:12px" v-show="labelNames.length > 0" >
			<div style="padding: 0 20px;z-index:5" v-for="item in labelArr" :key="item.value" :style="(item.select ? 'color:#c7254e;' : '') +'z-index:1400;background: white;margin-top:-20px' ">
				{{item.name}}
			</div>
		</div> -->
		<!-- </van-sticky> -->
		  	<van-overlay :show="overlayShow" ></van-overlay>
	</div>
</template>

<script>
export default{
	props: {
		show:{
			type:Boolean
		},
	},
	data(){
		return {
			searchView:true,// 是否显示查询,查询层级太高,影响明细视频展示,如果当前页面显示才显示查询
		    overlayShow:false, // 遮罩
			active: 0,
			option1: [
			  { text: '默认排序', value: 0 },
			  { text: '播放多', value: 1 },
			  { text: '评论多', value: 2 },
			  { text: '收藏多', value: 3 }
			],
			option2: [
			  { text: '全部时长', value: 0 },
			  { text: '5分钟内', value: 1 },
			  { text: '10分钟内', value: 2 },
			  { text: '10分钟+', value: 3 }
			],
			// sortType: 0,
			// 查询条件对象
			searchParams:{
				searchSortType: 0,// 排序类型
				videoLoadTime: 0, // 视频时长
			},
			// curSort:{
			// 	name:'默认排序',
			// 	value:0,
			// 	select:true
			// },
			// curTime:{},
			// curLabel:{},
			// sortNames: [],
			// timeNames:[],
			// labelNames:[],
			// sortArr:[{
			// 	name:'默认排序',
			// 	value:0,
			// 	select:true,
			// },{
			// 	name:'播放多',
			// 	value:1,
			// 	select:false,
			// },{
			// 	name:'评论多',
			// 	value:2,
			// 	select:false,
			// },{
			// 	name:'收藏多',
			// 	value:3,
			// 	select:false,
			// }],
			// timeArr:[{
			// 	name:'全部时长',
			// 	value:0
			// },{
			// 	name:'10分钟内',
			// 	value:1
			// },{
			// 	name:'30分钟内',
			// 	value:2
			// },{
			// 	name:'60分钟内',
			// 	value:3
			// },{
			// 	name:'60分钟+',
			// 	value:4
			// }],
			// labelArr:[{
			// 	name:'默认排序',
			// 	value:0
			// },{
			// 	name:'播放多',
			// 	value:1
			// },{
			// 	name:'评论多',
			// 	value:2
			// },{
			// 	name:'收藏多',
			// 	value:3
			// }]
		}
	},
	watch: {
		// activeNames(cur,bef){
		// 	console.log(cur)
		// 	console.log(bef)
		// 	if(!this.cur == this.activeNames)
		// 	this.activeNames = []
		// 	this.activeNames = [cur[cur.length - 1]]
		// }
	},
	methods:{
		onConfirm1(e){
			this.searchParams.searchSortType = e
			this.search()
		},
		onConfirm2(e){
			this.searchParams.videoLoadTime = e
			this.search()
		},
		sortClick(item){
			if(item.select){
				return;
			}
			// 清除所有的选择状态,只设置当前选中的选择状态
			this.sortArr.filter((e)=>{
				if(item.value == e.value){
					e.select = true
					this.curSort = e
					// 收回下拉
					this.sortNames = []
					this.overlayShow = false;
					// 查询指定条件数据
					this.search(e)
				}else{
					e.select = false
				}
			})
			// item.select = true
		},
		// change(e){
		// 	$('.van-cell__title').css('color','black')
		// 	if(e.length == 0){
		// 		this.sortNames = []
		// 		this.timeNames =[]
		// 		this.labelNames = []
		// 		this.overlayShow = false
		// 	}else{
		// 		this.overlayShow =true
		// 		// 获取当前的索引,把除当前的都关闭
		// 		let index = e[0]
		// 		if(index == 1){
		// 			this.timeNames =[]
		// 			this.labelNames = []
		// 			$('.van-cell__title')[0].style='color:red'
		// 		}
		// 		if(index == 2){
		// 			this.sortNames = []
		// 			this.labelNames = []
		// 			$('.van-cell__title')[1].style='color:red'
		// 		}
		// 		if(index == 3){
		// 			this.sortNames = []
		// 			this.timeNames =[]
		// 			$('.van-cell__title')[2].style='color:red'
		// 		}
		// 	}
			
		// },
		search(){
			this.$emit('search',this.searchParams)
		}
	},
	
}
</script>

<style scoped>
.van-tabs {
    position: relative;
	z-index: 1400;
	background: white;
}
.van-collapse-item{
	width: 100%;
	z-index: 1400;
}
.van-collapse-item__content{
	z-index: 1400;
	padding: 2px;
	    color: #969799;
	    font-size: 13px;
	    line-height: 1.5;
	    background-color: #fff;
}

/* .van-tabs__nav--line{
	box-sizing: content-box;
	height: 100%;
	padding-bottom: 15px;
	z-index: 9999;
}

.van-tabs__track {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    height: 100%;
    will-change: left;
    z-index: 9999;
} */
</style>
