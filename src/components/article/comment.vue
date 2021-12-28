<template>
	      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
		  <div style="position: relative;height:21rem;">
			  <div class="mui-scroll-wrapper commentParent" >
			    <div class="mui-scroll">
					 <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> 
					<div class="commentParent" >
						  <div class="main">
						<div v-for="(item,index) in commentList" :key="index" style="height:7rem">
						  <div class="commentItem">
							<div class="userImg">
							<img :src="baseURL + '/common/image?imgId=' + item.avatar + '&token=' + token" alt="" v-if="item.avatar"  >
							<img src="@/assets/default_img.jpg" alt v-else  />
							</div>
							<div class="commentContent">
							  <p>
								<span v-if="item.nickname">{{item.nickname}}</span>
								<span v-else>此用户无姓名</span>
								<span>{{item.comment_date}}</span>
							  </p>
							  <!-- <div>
								<div class="comment-text" v-html="item.comment_content"></div>
								<span class="publishs" @click="publishClick(item.comment_id)">回复</span>
								 <span class="publishs" style="position: absolute;color:#908888;font-size: 3.1vw;">{{item.create_time | filterTime}}</span>
							  </div> -->
							</div>
						  </div>
						  <div class="van-multi-ellipsis--l2" style="text-align: left;font-size:14px;
    padding-left: 5rem;">
							<div class="comment-text" v-html="item.comment_content"></div>
							<span class="publishs" @click="publishClick(item.comment_id)">回复</span>
							<!-- <span class="publishs" style="position: absolute;color:#908888;font-size: 3.1vw;">{{item.create_time | filterTime}}</span> -->
						  </div>
						 <div style="padding-left:8.333vw;"><comment-item @PostPublish="publishClick" :commentChild="item.child"></comment-item></div>
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
		  isLoading:false,
		  Highlightlist: [
		  					// {img: '[傲娇]'},
		  					// {img: '[狗头]'},
		  					// {img: '[爆赞]'},
		  					// {img: '[比心]'},
		  					// {img: '[吃瓜]'},
		  					// {img: '[打call]'},
		  					// {img: '[大哭]'},
		  					// {img: '[大笑]'},
		  					// {img: '[呆]'},
		  					// {img: '[害羞]'},
		  					// {img: '[滑稽]'},
		  					// {img: '[锦鲤]'},
		  					// {img: '[猫头]'},
		  					// {img: '[惊恐]'},
		  					// {img: '[惊讶]'},
		  					// {img: '[开心]'},
		  					// {img: '[抠鼻]'},
		  					// {img: '[哭]'},
		  					// {img: '[冷]'},
		  					// {img: '[流汗]'},
		  					// {img: '[难受]'},
		  					// {img: '[怒]'},
		  					// {img: '[色]'},
		  					// {img: '[生病]'},
		  					// {img: '[死人]'},
		  					// {img: '[酸]'},
		  					// {img: '[调皮]'},
		  					// {img: '[偷瞄]'},
		  					// {img: '[偷笑]'},
		  					// {img: '[吐]'},
		  					// {img: '[无奈]'},
		  					// {img: '[无语]'},
		  					// {img: '[笑哭]'},
		  					// {img: '[嘘]'},
		  					// {img: '[赞]'}
							{img: './static/emoticom/aojiao.png'},
							{img: './static/emoticom/goutou.png'},
							{img: './static/emoticom/baozang.png'},
							{img: './static/emoticom/bixin.png'},
							{img: './static/emoticom/chigua.png'},
							{img: './static/emoticom/call.png'},
							{img: './static/emoticom/daku.png'},
							{img: './static/emoticom/daxiao.png'},
							{img: './static/emoticom/dai.png'},
							{img: './static/emoticom/haixiu.png'},
							{img: './static/emoticom/huaji.png'},
							{img: './static/emoticom/jingli.png'},
							{img: './static/emoticom/maotou.png'},
							{img: './static/emoticom/jingkong.png'},
							{img: './static/emoticom/jingya.png'},
							{img: './static/emoticom/kaixin.png'},
							{img: './static/emoticom/koubi.png'},
							{img: './static/emoticom/ku.png'},
							{img: './static/emoticom/leng.png'},
							{img: './static/emoticom/liuhan.png'},
							{img: './static/emoticom/nanshou.png'},
							{img: './static/emoticom/nu.png'},
							{img: './static/emoticom/se.png'},
							{img: './static/emoticom/shengbing.png'},
							{img: './static/emoticom/siren.png'},
							{img: './static/emoticom/suan.png'},
							{img: './static/emoticom/tiaopi.png'},
							{img: './static/emoticom/toumiao.png'},
							{img: './static/emoticom/touxiao.png'},
							{img: './static/emoticom/tu.png'},
							{img: './static/emoticom/wunai.png'},
							{img: './static/emoticom/wuyu.png'},
							{img: './static/emoticom/xiaoku.png'},
							{img: './static/emoticom/xu.png'},
							{img: './static/emoticom/zan.png'}
		  				  ],
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
	  console.log(this.commentList)
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
	  console.log(filterImg)
	  // top.a = filterImg
	  console.log(imgList)
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
		  			tempData = tempData.replace(filterImg[i],"<span>FDSFDSFSDFDSFD</span><span><img style='-webkit-mask-box-image' width='25px'  height='25px' src='"+ this.Highlightlist[i].img +"'></span>")
		  		}
		  	}
		  	console.log(tempData)
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
	
    publishClick(id) {
     this.$emit('publishClick',id)
    }
  },
  created() {
    this.commentData();
  }
};
</script>

<style lang="less">

.commentParent {
  padding: 2.778vw 2.778vw;
  > div {
    border-bottom: 0.278vw solid #e7e7e7;
  }
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