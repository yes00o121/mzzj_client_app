<template>
	<!-- <div> -->
	  <van-sticky :offset-top="clientHeight" z-index="9999" @scroll="scroll" >
	    <!-- <van-button type="info">吸顶距离</van-button> -->
		<van-button round  type="info" style="position: absolute;right: 5%;" v-show="show" @click="backTop">
			<!-- <van-icon name="arrow-up" style="position: absolute; top: 4px;"/> -->
			<van-icon name="arrow-up" />
		</van-button>
		<!-- <van-icon name="ascending" size="2rem" style="position: absolute;right: 10%;"/> -->
		<!-- <van-icon name="back-top" color="#1989fa" size="2rem"  style="position: absolute;right: 10%;" /> -->
		<!-- <van-icon name="back-top" size="2rem" color="red" style="position: absolute;right: 10%;"/> -->
		<!-- <van-icon name="arrow-up" size="2rem" color="red" style="position: absolute;right: 10%;"/> -->
	  </van-sticky>
	<!-- </div> -->
</template>

<script>
export default{
	props:['showHeight'],
	data(){
		return {
			show:false
		}
	},
	methods:{
		backTop(){
		   this.slideTo(0)
		},
		scroll(e){
			if(e.scrollTop > this.showHeight){
				this.show = true
			} else {
				this.show = false
			}
		},
		slideTo (targetPageY) {
		  var timer = setInterval(function () {
		      var currentY = document.documentElement.scrollTop || document.body.scrollTop;//当前及滑动中任意时刻位置
		      var distance = targetPageY > currentY ? targetPageY - currentY : currentY - targetPageY;//剩余距离
		      var speed = Math.ceil(distance/10);//每时刻速度
		      if (currentY == targetPageY) {
		       clearInterval(timer);
		      } else {
		       window.scrollTo(0,targetPageY > currentY ? currentY + speed : currentY - speed);
		      }
		     },10);
		 }
	},
	computed:{
		clientHeight () {
		  return document.body.clientHeight * 0.9
		},
	}
}
</script>

<style scoped>
.van-sticky--fixed {
	position: fixed;
	top: 0;
	right: -60%;
	left: 0;
	z-index: 99;
}
.van-icon-back-top:before {
    content: '\e66d';
}
</style>
