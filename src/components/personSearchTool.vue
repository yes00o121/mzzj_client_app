<!-- 搜索工具 -->
<template>
	<div v-show="show">
		<!-- <van-sticky> -->
		<!-- <van-tabs v-model="active" animated> -->
		  <!-- <van-tab v-for="index in 1" title=""> -->
			<div v-show="active == 0"  style="display: flex;z-index:9999;background: white;">
				<van-collapse v-model="sortNames"  @change="change" style="z-index:9999;background: white;width: 100%;">
				  <van-collapse-item title="检索" name="1">
					  <div style="text-align: left;color: black;margin-left: 16px;margin-bottom: .4rem;">罩杯</div>
					  <van-cell-group style="text-align: initial;z-index:5">
					  	<!-- <van-cell title="罩杯" value="" /> -->
					  	<van-checkbox-group v-model="cup" direction="horizontal" >
					  	  <van-checkbox class="cell-distance" name="A">A</van-checkbox>
					  	  <van-checkbox class="cell-distance" name="B">B</van-checkbox>
					  	  <van-checkbox class="cell-distance" name="C">C</van-checkbox>
					  	  <van-checkbox class="cell-distance" name="D">D</van-checkbox>
					  	  <van-checkbox class="cell-distance" name="E">E</van-checkbox>
					  	  <van-checkbox class="cell-distance" name="F">F</van-checkbox>
					  	  <van-checkbox class="cell-distance" name="G">G</van-checkbox>
						  <van-checkbox class="cell-distance" name="H">H</van-checkbox>
						  <van-checkbox class="cell-distance" name="I">I</van-checkbox>
						  <van-checkbox class="cell-distance" name="J">J</van-checkbox>
						  <van-checkbox class="cell-distance" name="K">K</van-checkbox>
						  <van-checkbox class="cell-distance" name="L">L</van-checkbox>
						  <van-checkbox class="cell-distance" name="M">M</van-checkbox>
						  <van-checkbox class="cell-distance" name="O">O</van-checkbox>
					  	</van-checkbox-group>
					  </van-cell-group>
					  
					  <van-cell-group style="text-align: initial;z-index:5;padding: 0 20px;" id="birth">
					  	<van-cell title="出生日期" value="" />
							<van-slider v-model="birthValue" range @change="onBirthChange" active-color="#ee0a24" ref="heightRef" :min="1950" :max="maxBirth">
									<div slot="button" class="custom-button-birth">
										<!-- {{ heightValue}} -->
									  </div>
							</van-slider>
							<div style="height:2rem"></div>
						</van-cell>
					  </van-cell-group>
					  <van-cell-group style="text-align: initial;z-index:5;padding: 0 20px;" id="height">
					  	<van-cell title="身高" value="" />
							<van-slider v-model="heightValue" range @change="onHeightChange" active-color="#ee0a24" ref="heightRef" :min="140" :max="190">
									<div slot="button" class="custom-button">
									    <!-- {{ heightValue}} -->
									  </div>
								</van-slider>
							</van-cell>
							<div style="height:2rem"></div>
					  </van-cell-group>
					  <van-button round  type="info" block @click="onConfirm">
					        确定
					      </van-button>
				  </van-collapse-item>
					
					
				  <!-- <van-collapse-item title="全部时长" name="2"></van-collapse-item>
				  <van-collapse-item title="全部标签" name="3"></van-collapse-item> -->
				</van-collapse>
				<!-- <van-collapse v-model="timeNames"  @change="change" style="z-index:9999;background: white;width: 100%;">
					<van-collapse-item title="全部时长" name="2" style="z-index:9999;background: white;">
					</van-collapse-item>
				</van-collapse>
				<van-collapse v-model="labelNames"  @change="change" style="z-index:9999;background: white;width: 100%;">
					<van-collapse-item title="全部标签" name="3" style="z-index:9999;background: white;">
					</van-collapse-item>
				</van-collapse> -->
			</div>
		  <!-- </van-tab> -->
		<!-- </van-tabs> -->
		<!-- <div style="display: flex;font-size:12px;background: white;" v-show="timeNames.length > 0" >
			<div style="padding: 0 10px;z-index:5" v-for="item in timeArr" :key="item.value" :style="(item.select ? 'color:#c7254e;' : '') +'z-index:9999;background: white;margin-top:-20px' ">
				{{item.name}}
			</div>
		</div>
		<div style="display: flex;font-size:12px;background: white;" v-show="labelNames.length > 0" >
			<div style="" v-for="item in labelArr" :key="item.value" :style="(item.select ? 'color:#c7254e;' : '') +'z-index:9999;background: white;margin-top:-20px;padding: 0 20px;' ">
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
		    searchStr:'',// 搜索内容字符串
		    minBirth:1950,
			maxBirth:new Date().getYear()+1900,
			birthValue:[1950,new Date().getYear()+1900],
			minHeight:140,
			maxHeight:190,
			heightValue: [140,190],// 身高范围
			cup:[],
			date: '',
			      dateShow: false,
			value:50,
			searchView:true,// 是否显示查询,查询层级太高,影响明细视频展示,如果当前页面显示才显示查询
		    overlayShow:false, // 遮罩
			active: 0,
			curSort:{
				name:'默认排序',
				value:0,
				select:true
			},
			curTime:{},
			curLabel:{},
			sortNames: [],
			timeNames:[],
			labelNames:[],
			sortArr:[{
				name:'默认排序',
				value:0,
				select:true,
			},{
				name:'播放多',
				value:1,
				select:false,
			},{
				name:'评论多',
				value:2,
				select:false,
			},{
				name:'收藏多',
				value:3,
				select:false,
			}],
			timeArr:[{
				name:'全部时长',
				value:0
			},{
				name:'10分钟内',
				value:1
			},{
				name:'30分钟内',
				value:2
			},{
				name:'60分钟内',
				value:3
			},{
				name:'60分钟+',
				value:4
			}],
			labelArr:[{
				name:'默认排序',
				value:0
			},{
				name:'播放多',
				value:1
			},{
				name:'评论多',
				value:2
			},{
				name:'收藏多',
				value:3
			}]
		}
	},
	watch: {
		show(){
			// console.log('start....')
		}
		// activeNames(cur,bef){
		// 	console.log(cur)
		// 	console.log(bef)
		// 	if(!this.cur == this.activeNames)
		// 	this.activeNames = []
		// 	this.activeNames = [cur[cur.length - 1]]
		// }
	},
	methods:{
		onBirthChange(value){
			// $('#birth .van-slider__button-wrapper-left div').text(value[0])
			// $('#birth .van-slider__button-wrapper-right div').text(value[1])
			let left = $('#birth .van-slider__button-wrapper-left div')
			let right = $('#birth .van-slider__button-wrapper-right div')
			if(value[0] == this.minBirth && value[1] == this.maxBirth){
				left.text('所有')
				right.text('所有')
			}else{
				left.text(value[0])
				right.text(value[1])
			}
		},
		onHeightChange(value){
			let left = $('#height .van-slider__button-wrapper-left div');
			let right = $('#height .van-slider__button-wrapper-right div');
			if(value[0] == this.minHeight && value[1] == this.maxHeight){
				left.text('所有')
				right.text('所有')
			}else{
				left.text(value[0])
				right.text(value[1])
			}
			// $('#height .van-slider__button-wrapper-left div').text(value[0])
			// $('#height .van-slider__button-wrapper-right div').text(value[1])
		},
		onConfirm(){
			this.searchStr = ''
			// 获取用户选择罩杯数据
			let params = {
				cup:'',
				height:'',
				birth:''
			}
			for(let i =0;i<this.cup.length;i++){
				params.cup += this.cup[i] + ','
			}
			if(this.cup.length > 0){
				params.cup = params.cup.substring(0, params.cup.length - 1)
				// this.searchStr += '罩杯：' + params.cup
			}
			// 身高
			let heightLeft = $('#height .van-slider__button-wrapper-left div').text();
			let heightRight = $('#height .van-slider__button-wrapper-right div').text();
			if(heightLeft != '所有' && heightRight != '所有'){
				params.height = heightLeft + '-' + heightRight
				// this.searchStr += '身高：' + params.height
			}
			// 出生日期
			let birthLeft = $('#birth .van-slider__button-wrapper-left div').text()
			let birthRight = $('#birth .van-slider__button-wrapper-right div').text()
			if(birthLeft != '所有' && birthRight != '所有'){
				params.birth = birthLeft + '-' + birthRight
				// this.searchStr += '出生日期：' + params.birth
			}
			// console.log(params)
			this.sortNames = []
			this.$emit('search',params)
		},
		// sortClick(item){
		// 	if(item.select){
		// 		return;
		// 	}
		// 	// 清除所有的选择状态,只设置当前选中的选择状态
		// 	this.sortArr.filter((e)=>{
		// 		if(item.value == e.value){
		// 			e.select = true
		// 			this.curSort = e
		// 			// 收回下拉
		// 			this.sortNames = []
		// 			this.overlayShow = false;
		// 			// 查询指定条件数据
		// 			this.search(e)
		// 		}else{
		// 			e.select = false
		// 		}
		// 	})
		// 	// item.select = true
		// },
		change(e){
			console.log(e)
			if(e.length > 0){
				// 初始化左右滑动的初始值
				this.$nextTick(()=>{
					setTimeout(()=>{
						let heightLeft =  $('#height .van-slider__button-wrapper-left div')
						let heightRight = $('#height .van-slider__button-wrapper-right div')
						let birthLeft = $('#birth .van-slider__button-wrapper-left div')
						let birthRight = $('#birth .van-slider__button-wrapper-right div')
						if(!heightLeft.text()){
							heightLeft.text('所有')
						}
						if(!heightRight.text()){
							heightRight.text('所有')
						}
						if(!birthLeft.text()){
							birthLeft.text('所有')
						}
						if(!birthRight.text()){
							birthRight.text('所有')
						}
						// $('#height .van-slider__button-wrapper-left div').text('所有')
						// $('#height .van-slider__button-wrapper-right div').text('所有')
						// $('#birth .van-slider__button-wrapper-left div').text('所有')
						// $('#birth .van-slider__button-wrapper-right div').text('所有')
					},200)
				})
			}
			// $('.van-cell__title').css('color','black')
			// if(e.length == 0){
			// 	this.sortNames = []
			// 	this.timeNames =[]
			// 	this.labelNames = []
			// 	this.overlayShow = false
			// }else{
			// 	this.overlayShow =true
			// 	// 获取当前的索引,把除当前的都关闭
			// 	let index = e[0]
			// 	if(index == 1){
			// 		this.timeNames =[]
			// 		this.labelNames = []
			// 		$('.van-cell__title')[0].style='color:red'
			// 	}
			// 	if(index == 2){
			// 		this.sortNames = []
			// 		this.labelNames = []
			// 		$('.van-cell__title')[1].style='color:red'
			// 	}
			// 	if(index == 3){
			// 		this.sortNames = []
			// 		this.timeNames =[]
			// 		$('.van-cell__title')[2].style='color:red'
			// 	}
			// }
			
		},
		search(curSearch){
			this.$emit('search',curSearch)
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

.van-collapse-item__wrapper{
	display: none;
}
.custom-button {
  width: 32px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: #ee0a24;
  border-radius: 100px;
}
.custom-button-birth{
	width: 32px;
	color: #fff;
	font-size: 10px;
	line-height: 18px;
	text-align: center;
	background-color: #ee0a24;
	border-radius: 100px;
}
.van-hairline--top-bottom{
	border:none;
}
</style>
