<template>
  <div class="comment" style="position: fixed;bottom:0;z-index:999;width: 100%;background:white;">

<!-- 	  <van-popup
	    v-model="utilShow"
		:overlay="false"
	    position="bottom"
	    :style="{ height: util ? '40%' : '12%','overflow': 'hidden','transition':'all 0.5s ease 0s'}"
	  > -->
	  <!-- <div> -->
		  <div class="van-popup van-popup--bottom" :style="{ height: util ? '40%' : '12%','overflow': 'hidden','transition':'all 0.5s ease 0s','z-index': '2001'}">
		<div class="comment">
			  <p class="comment-title" v-if="!hideLength">
				  <span v-if="!hideLength">评论</span>
				  <span v-if="!hideLength">({{dataLength}})</span>
					  <span>
						  <van-icon name="arrow-up" style="right: 1rem;position: fixed;" v-show="!util" @click="utilClick"/>
						  <van-icon name="arrow-down" style="right: 1rem;position: fixed;" v-show="util"  @click="utilClick"/>
					  </span>
			  </p>
			  <div class="commentMyinfo" >
					  <img :src="baseURL + '/common/image?imgId=' + myuser.icon +'&token=' + token" alt="" v-if="myuser"  >
					  <img src="@/assets/default_img.jpg" alt v-else  />
				  <img src="@/assets/default_img.jpg" alt="" v-else>
				 <input  v-model="comcontent" ref="Postipt2" type="text" @input="commentInput"  @focus="commentMove()" :placeholder="placeholderText">
				  <button @click="cmmentPublish" style="margin-left:.5rem" v-if="util">发表</button>
				  <van-icon name="smile-o"   size="2rem" style="margin-left:.5rem" @click="util = true"  v-if="!util"/>
			  </div>
			</div>
			<!-- 工具栏内容 -->
			<emoticom @selectSmile="selectSmile"></emoticom>
			<!--工具栏-->
			<div style="float:left">
				 <van-icon name="smile-o" @click="showSmile"  size="2rem" style="background:#f4f4f4;padding:.5rem"/>
			</div>
		</div>
		</div>
	  <!-- </van-popup> -->
  </div>
</template>

<script>
import emoticom from '../common/emoticom'
export default {
  props:['dataLength','hideLength','overlay'],
  mounted(){
  	mui('.mui-scroll-wrapper').scroll({
  	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  	});
  },
  data() {
      return {
		  overlayStatus:false,// 遮罩状态
		  token: 'Bearer ' + localStorage.token,
		  tempContent:'',// 临时的内容,用于做数据变动对比
		  utilShow:true,// 是否显示评论组件
		    util:false, // 评论工具栏
			smile:false, // 表情工具
            myuser:null,
			sxIcon:true,
			placeholderText:'留下你的精彩评论吧',
            comcontent:''
      }
  },
  components:{
	  emoticom
  },
  methods: {
    async myUserinfo() {
	  this.getUser().then(response=>{
	    this.myuser = response.data.data
	  })
    },
	utilClick(){
		this.util = !this.util
	},
	openUtil(){
		this.util = true
		this.smile = true
	},
	closeUtil(){
		this.util = false
		this.smile = false
		this.sxIcon = false
		
	},
	commentMove(){
		this.util = true
	},
    cmmentPublish() {
        if(!this.myuser && !localStorage.getItem('token')){
          this.$msg.fail('请先登录')
          return
        }
		// console.log(this.comcontent)
        this.$emit('Postcomment',this.comcontent,null)
        this.comcontent = ''
    },
	// 选择表情
	selectSmile(item){
		// 表情追加
		this.appendContent(item);
	},
	showSmile(){
		this.smile = true
	},
	// 获取当前光标位置
	getTxt1CursorPosition(){
		let postipt = this.$refs.Postipt2
		return  postipt.selectionStart;
	        },
	// 追加内容
	appendContent(content){
		const postipt =  this.getTxt1CursorPosition();
		// 光标为0追加最后
		if(postipt == 0){
			this.comcontent += content;
			return
		}
		console.log(postipt)
		let startContent = this.comcontent.substring(0,postipt);
		let endContent = this.comcontent.substring(postipt,this.comcontent.length);
		this.comcontent = startContent + content + endContent
	},
	commentInput(e){
		this.tempContent = e.target.text
	}
  },
  created() {
        if(localStorage.getItem('token')){
            this.myUserinfo();
        }
		window.addEventListener('resize', function () {
			if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
			  window.setTimeout(function () {
				document.activeElement.scrollIntoViewIfNeeded()
			  }, 0)
			}
		  })
  },
  watch:{
	  util(cur,bef){
		  // 窗口关闭,取消回复状态
		  if(!cur){
			  if(this.$parent.$parent.clearPostStatus){
				  			  this.$parent.$parent.clearPostStatus()
			  }
		  }
		  this.$emit('showUtil',cur)
	  }
  }
};
</script>

<style lang="less">
body{
	padding-bottom: env(safe-area-inset-bottom); 
	padding-bottom: constant(safe-area-inset-bottom);
}
.comment{
    // padding: 8.333vw 2.778vw 0 2.7778vw;
	padding: 3.333vw 2.778vw 0 2.7778vw;
    .comment-title{
        span:nth-child(2) {
            color: #aaa;
            margin-left: 2.778vw;
        }
    }
    .commentMyinfo{	
      /* padding: 2.778vw 0;*/
	  padding: 6.778vw 0;
      display: flex;
      img{
        height: 7.944vw;
        width: 7.944vw;
        border-radius: 50%;
      }
      input{
        outline: none;
        border: 0;
		width:60%;
        background-color: #f4f4f4;
        border-radius: 3.611vw;
        font-size: 3.333vw;
        padding: 0 5.556vw 0 4.167vw;
        margin-left: 2.778vw;
      }
      button{
        outline: none;
        border: 0;
        border-radius: 3.333vw;
        background: #fb7299;
        color: white;
        font-size: 3.333vw;
        padding: 0 4.167vw;
      }
    }
}
</style>