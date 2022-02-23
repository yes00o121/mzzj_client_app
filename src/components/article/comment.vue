<template>
	      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
		  <div style="position: relative;height:21rem;">
			  <div class="mui-scroll-wrapper commentParent" >
			    <div class="mui-scroll" ref="muiScroll">
					 <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> 
					<div class="commentParent" >
						  <div class="main">
						<div v-for="(item,index) in commentList" :key="index" >
						  <div class="commentItem">
							<div class="userImg">
							<img :src="baseURL + '/common/image?imgId=' + item.avatar + '&token=' + token" alt="" v-if="item.avatar" style="border-radius: 1rem;" >
							<img src="@/assets/default_img.jpg" alt v-else style="border-radius: 1rem;"  />
							</div>
							<div class="commentContent">
							  <p>
								<span v-if="item.nickname">{{item.nickname}}</span>
								<span v-else>此用户无姓名</span>
							  </p>
							  <p>
								  <span style="font-size:12px;color:#aaa">{{item.create_time}}</span>
							  </p>
							  <!-- <div>
								<div class="comment-text" v-html="item.comment_content"></div>
								<span class="publishs" @click="publishClick(item.comment_id)">回复</span>
								 <span class="publishs" style="position: absolute;color:#908888;font-size: 3.1vw;">{{item.create_time | filterTime}}</span>
							  </div> -->
							  <div style="text-align: left;font-size:14px;widht:80%">
									<div class="comment-text" v-html="item.comment_content" style="padding-bottom:.5rem;width:90%"></div>
									<!-- <span class="publishs" @click="publishClick(item.comment_id)">回复</span> -->
									<van-icon name="chat-o" size="1.2rem" @click="publishClick(item)"/>
							  							<!-- <span class="publishs" style="position: absolute;color:#908888;font-size: 3.1vw;">{{item.create_time | filterTime}}</span> -->
							  </div>
							</div>
							
						  </div>
						  
						 <div style="padding-left:8.333vw;"><comment-item @PostPublish="publishClick" :commentChild="item.child_comment"></comment-item></div>
						</div>
						</div>
					</div>
				  </van-pull-refresh>
			    </div>
			  </div>
<!-- 			  
  <div class="commentParent" style="margin-bottom: 27%;overflow: auto;height: 21rem;-webkit-overflow-scrolling: touch; overflow-scrolling: touch;">
	  <div class="main">
    <div v-for="(item,index) in commentList" :key="index">
      <div class="commentItem">
        <div class="userImg">
		<img :src="baseURL + '/common/image?imgId=' + item.icon" alt="" v-if="item.icon"  >
		<img src="@/assets/default_img.jpg" alt v-else  />
        </div>
        <div class="commentContent">
          <p>
            <span v-if="item.nick_name">{{item.nick_name}}</span>
            <span v-else>此用户无姓名</span>
            <span>{{item.comment_date}}</span>
          </p>
          <div>
            <div class="comment-text" v-html="item.comment_content"></div>
            <span class="publishs" @click="publishClick(item.comment_id)">回复</span>
			 <span class="publishs" style="position: absolute;color:#908888;font-size: 3.1vw;">{{item.create_time | filterTime}}</span>
          </div>
        </div>
      </div>
     <div style="padding-left:8.333vw;"><comment-item @PostPublish="publishClick" :commentChild="item.child"></comment-item></div>
    </div>
	</div>
  </div> -->
  	  <!-- </van-pull-refresh> -->
	  </div>
</template>

<script>
import commentItem from "./commentItem";
export default {
    mounted(){
		mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
	},
  data() {
      return {
		  token: 'Bearer ' + localStorage.token,
          commentList:[],
		  isLoading:false
      }
  },
  components: {
    commentItem
  },
  // <van-image
  //   style="padding:8px"
  //   @click="selectSmile(item)"
  //   width="2rem"
  //   height="2rem"
  //   fit="contain"
  // 			v-for="item in Highlightlist"
  //   :src="item.img" rel="external nofollow" 
  // />
  filters:{
  	filterTime(val) {
  	  if(val){
		  let time = val.split('T')
		  if(time[1]){
			  let m = time[1].substring(0,8)
			  return time[0] + ' ' + m;
		  }
		  
  	    return time[0];
  	  }
  	  return "";
  	},
  },
  methods: {
  onRefresh() {       //下拉刷新
			  setTimeout(() => {
				  this.commentData()
				  // this.finished = false;
				  this.isLoading = false;
				  // // this.list = []
				  // let categoryitem = this.categoryItem();
				  // categoryitem.page = 1;
				  // categoryitem.list = []
				  // this.selectArticle();
			  }, 500);
		  },
    async commentData() {
		const res = await this.$http.get('/comment/queryComment?work_id=' + this.$route.params.id)
		// console.log(res)
      // const res = await this.$http.get("/comment/" + this.$route.params.id);
      if(res.data.data){
        this.$emit('lengthselect',res.data.data.length)
      }
      this.commentList = this.changeCommentData(res.data.data)
	  // 数据获取后评论滚到最上面
	  if(this.$refs.muiScroll){
		  // console.log(this.$refs.muiScroll)
		  this.$refs.muiScroll.style.transform = 'translate3d(0px, 0px, 0px) translateZ(0px)'
	  }
	  // console.log(this.commentList)
    },
    changeCommentData(data) {
	  const imgList = this.Highlightlist
	  // const filterImg = [].concat(imgList).filter((e)=>{
		 //  e.img = e.img.replace('./static/emoticom/','[').replace('.png',']')
		 //  return e;
	  // })
	  let filterImg = []
	  for(let i =0;i<imgList.length;i++){
			filterImg.push(imgList[i].img.replace('./static/emoticom/','[').replace('.png',']'))
	  }
	  // console.log(filterImg)
	  // top.a = filterImg
	  // console.log(imgList)
	  // fn = ()=>{
		  
	  // }
	  let fn = ((temp)=>{
		  let arr1 = [];
		  for (var i = 0; i < data.length; i++) {
		  	if(!data[i].comment_content){
		  		continue;
		  	}
		  	// console.log(data[i].comment_content)
		  	let tempData = data[i].comment_content
		  	for(let i =0;i<filterImg.length;i++){
		  		if(tempData.indexOf(filterImg[i]) != -1){
		  			tempData = tempData.replace(filterImg[i],"<span><img style='-webkit-mask-box-image' width='25px'  height='25px' src='"+ this.Highlightlist[i].img +"'></span>")
		  		}
		  	}
		  	// console.log(tempData)
		  	// 内容处理,表情替换
		  	// for(var j=0;j<imgList.length;j++) {
		  	// 	// const img = imgList[j].img.replace('[','').replace(']','')
		  	// 	// tempData = replaceall(tempData,imgList[j].img,"<span><img style='-webkit-mask-box-image' width='30PX'  height='30PX' src='./static/emoticom/"+ img +".png'></span>" )
		  	// 	tempData = replaceall(tempData,imgList[j].img,"<span><img style='-webkit-mask-box-image' width='30PX'  height='30PX' src='"+ tempData,imgList[j].img +"'></span>" )
		  	// }
		  	// data[i].comment_content = '<div>' +tempData + '</div>'
			data[i].comment_content = tempData
		  	// console.log(data[i].tempData)
		    if (data[i].parent_id == temp) {
		      arr1.push(data[i]);
		      data[i].child = fn(data[i].id);
		    }
		  }
		  return arr1;
	  })
   //    function fn(temp) {
   //      let arr1 = [];
   //      for (var i = 0; i < data.length; i++) {
			// if(!data[i].comment_content){
			// 	continue;
			// }
			// // console.log(data[i].comment_content)
			// let tempData = data[i].comment_content
			// for(let i =0;i<filterImg.length;i++){
			// 	if(tempData.indexOf(filterImg[i]) != -1){
			// 		tempData = tempData.replace(filterImg[i],"<span><img style='-webkit-mask-box-image' width='30PX'  height='30PX' src='"+ this.Highlightlist[i] +"'></span>")
			// 	}
			// }
			
			// // 内容处理,表情替换
			// // for(var j=0;j<imgList.length;j++) {
			// // 	// const img = imgList[j].img.replace('[','').replace(']','')
			// // 	// tempData = replaceall(tempData,imgList[j].img,"<span><img style='-webkit-mask-box-image' width='30PX'  height='30PX' src='./static/emoticom/"+ img +".png'></span>" )
			// // 	tempData = replaceall(tempData,imgList[j].img,"<span><img style='-webkit-mask-box-image' width='30PX'  height='30PX' src='"+ tempData,imgList[j].img +"'></span>" )
			// // }
			// // data[i].comment_content = '<div>' +tempData + '</div>'
			// // console.log(data[i].tempData)
   //        if (data[i].parent_id == temp) {
   //          arr1.push(data[i]);
   //          data[i].child = fn(data[i].id);
   //        }
   //      }
   //      return arr1;
   //    }
	  
	  function replaceall( restr ,oldstr, newstr ){
	while (restr.indexOf(oldstr)  >= 0){
			restr = restr.replace(oldstr,newstr);

		}

	return restr ;
	}
       return fn(null);
    },
	
    publishClick(item) {
		console.log('被调用....')
		console.log(item)
		this.$emit('publishClick',item)
     // this.$emit('publishClick',item.comment_id)
	 // console.log(this.$parent.$children[1].placeholderText)
	 // this.$parent.$children[1].placeholderText = '回复 @' + item.nickname + ':'
	 
    }
  },
  created() {
    this.commentData();
  }
};
</script>

<style lang="less" scoped>

.commentParent {
  padding: 2.778vw 2.778vw;
  // > div {
  //   border-bottom: 0.278vw solid #e7e7e7;
  // }
  .commentItem {
    display: flex;
    margin: 2.778vw 0;
    .userImg {
      margin-right: 2.778vw;
      img {
        width: 9.722vw;
        height: 9.722vw;
      }
    }
    .commentContent {
      flex: 1;
      position: relative;
      p {
		  padding-bottom: 0.2rem;
        font-size: 3.611vw;
        color: #555;
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.389vw;
      }
      div {
        font-size: 3.611vw;
      }
      .publishs{
        // position: absolute;
        right: 0;
		// left:0;
        color: red;
      }
    }
  }
}
</style>