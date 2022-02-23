<template>
  <div class="commentitems">
    <div class="commentItem" v-for="(item,index) in dataList" :key="index">
      <div class="userImg">
         <img v-if="item.avatar && item.avatar" :src="baseURL + '/common/image?imgId=' +item.avatar + '&token=' + token" alt  style=" width: 6.722vw;height: 6.722vw;"/>
         <img v-else src="@/assets/default_img.jpg" alt="" style=" width: 6.722vw;height: 6.722vw;">
		 <div>
			 <p>
				<span v-if="item.nickname">{{item.nickname}}</span> 
				<span v-else>此用户无姓名</span>
			 </p>
			 <p>
				<span style="font-size:12px;color:#aaa">{{item.create_time}}</span>
			 </p>
			 <div style="text-align: left;font-size:14px">
				<div class="comment-text" v-html="item.comment_content" style="padding-bottom:.5rem;"></div>
				<!-- <span class="publishs" @click="publishClick(item.comment_id)">回复</span> -->
				<van-icon name="chat-o" size="1.2rem" @click="PostItemcomment(item)"/>
			 							<!-- <span class="publishs" style="position: absolute;color:#908888;font-size: 3.1vw;">{{item.create_time | filterTime}}</span> -->
			 </div>
			 
		 </div>
		 
          <!-- <p>
			<span v-if="item.nickname">{{item.nickname}}</span> 
			<span v-else>此用户无姓名</span>
          </p>
          <p>
			<span style="font-size:12px;color:#aaa">{{item.create_time}}</span>
          </p> -->
      </div>
	  
      <!-- <div class="commentContent">
        <div v-if="!temp">{{item.comment_content}} <span class="publish" @click="PostItemcomment(item.comment_id)">回复</span></div>
        <div v-else>回复 <span style="color:#478ef0">{{item.parent_user_info.name}}</span> :{{item.comment_content}}<span class="publish" @click="PostItemcomment(item.comment_id)">回复</span></div>
      </div> -->
	  
      <commentchild-item :commentChild="item.child_comment" @postChild="postChild" :temp="true"></commentchild-item>
    </div>
  </div>
</template>

<script>
export default {
  name:'commentchildItem',
  data(){
	return {
	    dataList:[],
		token: 'Bearer ' + localStorage.token
	}  
  },
  props: ["commentChild",'temp'],
  // watch:{
	 //  commentChild(){
		//   console.log('.....')
		//   console.log(this.commentChild)
	 //  }
  // },
  created(){
	// console.log('.....')  
	this.$nextTick(()=>{
		if(this.commentChild){
			console.log(this.commentChild)
			this.dataList = this.changeCommentData(this.commentChild)
		}
	})
	
  },
  methods:{
    PostItemcomment(id) {
      this.$emit('postChild',id)
      this.$emit('PostPublish',id)
    },
    postChild(id) {
      this.PostItemcomment(id)
      this.$emit('PostPublish',id)
    },
	changeCommentData(data) {
		  const imgList = this.Highlightlist

		  let filterImg = []
		  for(let i =0;i<imgList.length;i++){
				filterImg.push(imgList[i].img.replace('./static/emoticom/','[').replace('.png',']'))
		  }

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
			  			tempData = tempData.replace(filterImg[i],"<span><img style='-webkit-mask-box-image' widht:'25px' height='25px' src='"+ this.Highlightlist[i].img +"'></span>")
			  		}
			  	}

				data[i].comment_content = tempData
			  	// console.log(data[i].tempData)
			    if (data[i].parent_id == temp) {
			      arr1.push(data[i]);
			      data[i].child = fn(data[i].id);
			    }
			  }
			  return arr1;
		  })
		  
		  function replaceall( restr ,oldstr, newstr ){
		while (restr.indexOf(oldstr)  >= 0){
				restr = restr.replace(oldstr,newstr);
	
			}
	
		return restr ;
		}
	    return fn(null);
	 },
	// publishClick(item) {
	// 	console.log(item)
	// 	this.$emit('publishClick',item)
	//  // this.$emit('publishClick',item.comment_id)
	//  // console.log(this.$parent.$children[1].placeholderText)
	//  // this.$parent.$children[1].placeholderText = '回复 @' + item.nickname + ':'
	 
	// }
  }
};
</script>

<style lang="less" scoped>
.commentitems {
  .commentItem{
      display: flex;
      flex-direction: column;
      .userImg{
		  margin:2.778vw 0;
          display: flex;
          img{
              margin: 0 1.389vw 2.778vw 0;
			  border-radius: 1rem;
			 
          }
          p{
		      // padding-bottom:0.2rem;
              flex: 1;
              font-size: 3.611vw;
              color: #555;
              display: flex;
              justify-content: space-between;
              margin-bottom: 1.389vw;
          }
		  div{
			  width: 100%;
		  }
      }
      .commentContent{
        position: relative;
          margin-bottom: 2.778vw;
          .publish{
            position: absolute;
            right: 15px;
            color: red;
          }
      }
  }
}
// html{
// 	/deep/ img{
// 		widht:25px;
// 		height:25px;
// 	}
// }


// ::v-deep img{
// 	widht:25px;
// 	height:25px;
// }
</style>