<template>
  <div class="comment" style="position: fixed;bottom:0;z-index:999;width: 100%;background:white;">
      <div v-show="!sxIcon">
		  <p class="comment-title">
		      <span>评论</span>
		      <span>({{dataLength}})</span>
		  		  <span>
		  			  <van-icon name="arrow-up" style="right: 1rem;position: fixed;" v-show="!sxIcon" @click="sxClick"/>
		  			  <van-icon name="arrow-down" style="right: 1rem;position: fixed;" v-show="sxIcon"  @click="sxClick"/>
		  		  </span>
		  </p>
		  <div class="commentMyinfo" >
		      <!-- <img :src="myuser.user_img" alt="" v-if="myuser"> -->
		  		  <img :src="baseURL + '/common/image?imgId=' + myuser.icon" alt="" v-if="myuser"  >
		  		  <img src="@/assets/default_img.jpg" alt v-else  />
		      <img src="@/assets/default_img.jpg" alt="" v-else>
		      <input  v-model="comcontent" ref="Postipt" type="text" @input="commentInput" @blur="commentOver" @mousemove="commentMove()" placeholder="说点什么吧">
		      <button @click="cmmentPublish">发表</button>
		  </div>
	  </div>
	  <van-popup
	    v-model="sxIcon"
	    position="bottom"
	    :style="{ height: '40%' }"
	  >
		<div class="comment">
				  <p class="comment-title">
				      <span>评论</span>
				      <span>({{dataLength}})</span>
				  		  <span>
				  			  <van-icon name="arrow-up" style="right: 1rem;position: fixed;" v-show="!sxIcon" @click="sxClick"/>
				  			  <van-icon name="arrow-down" style="right: 1rem;position: fixed;" v-show="sxIcon"  @click="sxClick"/>
				  		  </span>
				  </p>
				  <div class="commentMyinfo" >
				      <!-- <img :src="myuser.user_img" alt="" v-if="myuser"> -->
				  		  <img :src="baseURL + '/common/image?imgId=' + myuser.icon" alt="" v-if="myuser"  >
				  		  <img src="@/assets/default_img.jpg" alt v-else  />
				      <img src="@/assets/default_img.jpg" alt="" v-else>
				      <input  v-model="comcontent" ref="Postipt" type="text" @input="commentInput" @blur="commentOver" @mousemove="commentMove()" placeholder="说点什么吧">
				      <button @click="cmmentPublish">发表</button>
				  </div>
		</div>
		<!-- 工具栏内容 -->
		<emoticom @selectSmile="selectSmile"></emoticom>
		<!-- <div style="position: relative;height:9rem;">
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
		</div> -->
		<!--工具栏-->
		<div style="padding-top:5px">
			 <van-icon name="smile-o" @click="showSmile"  size="2rem"/>
		</div>
	  </van-popup>
	  
  </div>
</template>

<script>
import emoticom from '../common/emoticom'
export default {
  props:['dataLength'],
  mounted(){
  	mui('.mui-scroll-wrapper').scroll({
  	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  	});
  },
  data() {
      return {
		  tempContent:'',// 临时的内容,用于做数据变动对比
		    util:false, // 评论工具栏
			smile:false, // 表情工具
            myuser:null,
			sxIcon:false,
            comcontent:'',
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
  components:{
	  emoticom
  },
  methods: {
    async myUserinfo() {
      // const res = await this.$http.get("/user/" + localStorage.getItem("id"));
      // this.myuser = res.data[0];
	  this.getUser().then(response=>{
	    this.myuser = response.data.data
	  })
    },
	sxClick(){
		// if(this.sxIcon){
		// 	// this.closeUtil()
		// } else {
		// 	// this.openUtil()
		// }
		this.sxIcon = !this.sxIcon
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
    cmmentPublish() {
        if(!this.myuser && !localStorage.getItem('token')){
          this.$msg.fail('请先登录')
          return
        }
        this.$emit('Postcomment',this.comcontent,null)
        this.comcontent = ''
    },
	// 选择表情
	selectSmile(item){
		// 地址截取,保留图片名称
		// console.log(item.img)
		// const name = item.img.replace('./static/emoticom/','').replace('.png','')
		// console.log(name)
		// 表情追加
		this.appendContent(item);
	},
	showSmile(){
		this.smile = true
	},
	// 获取当前光标位置
	getTxt1CursorPosition(){
		let postipt = this.$refs.Postipt
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
    focusIpt(){
     this.$refs.Postipt.focus()
    },
	commentMove(e){
		// this.util = true;
		console.log('点击')
		// alert(1)
		// 显示图标选择框
	},
	commentOver(e){
		// if(this.tempContent == this.comcontent){
		// 	this.closeUtil()
		// }
		// console.log(e)
		
		// console.log($(e.target))
		// this.closeUtil()
		// if()
		// this.util = false;
		console.log('力开')
	},
	commentInput(e){
		console.log(e.target.value)
		console.log('shuru....')
		this.tempContent = e.target.text
	}
  },
  created() {
        if(localStorage.getItem('token')){
            this.myUserinfo();
        }
  },

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