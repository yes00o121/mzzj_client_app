<template>
  <div @click="pathPush" v-if="detailitem" ref="wrapper"> 
      <div class="detailItem">
          <div class="imgparent">
               <!-- <img :src="baseURL + detailitem.previewImg"  alt="" style="width:100%;height:47.778vw;"> -->
			   <!-- <van-image lazy-load :src="baseURL +   detailitem.previewImg + '&width='+width+'&height=' + height + '&token=' + token" style="width:100%;height:57.778vw;"> -->
			   <van-image :src="detailitem.img" style="min-height:4.5rem" v-if="detailitem.img">
					  <template v-slot:error>
						 加载失败
					  </template>
					  <template v-slot:loading>
					      <van-loading type="spinner" size="20" />
					    </template>
			   </van-image>
			    <img src="@/assets/nowprinting.gif" v-else />
              <div class="bottom">
                  <!-- <div class="icon-play2"><span class="video">&nbsp;{{detailitem.flowNum}}</span></div> -->
				  <!-- <div v-if="detailitem.flowNum"><span class="video"><van-icon name="eye-o" />&nbsp;{{detailitem.flowNum}}</span></div> -->
                  <!-- <div class="icon-file-text"> <span class="comment">{{!detailitem.commentlen ? 66 : detailitem.commentlen}}</span> </div> -->
              </div>
          </div>
		  <!-- <p v-if="detailitem.descript">{{detailitem.descript}}</p> -->
          <p>{{detailitem.title}}</p>
		  <!-- 作品显示番号 -->
		  <!-- <p v-if="detailitem.works_number" style="color:#c00">{{detailitem.works_number}}&nbsp;/&nbsp;<span>{{detailitem.createTime}}</span></p> -->
      </div>
  </div>
</template>

<script>
export default {
    data(){
      return {
		  width : '',
		  height:'',
		  token: 'Bearer ' + localStorage.token
      }
    },
    props:['detailitem'],
    activated() {
		
　　　　//保持滚动到的位置
// 　　　　this.$refs.wrapper.scrollTop = this.scrollTop;
　　　},
created(){
	this.$nextTick(()=>{
		let war = this.$refs.wrapper
		// console.log(this.$refs.wrapper.clientHeight)
		if(war){
			this.height = this.$refs.wrapper.clientHeight
			this.width = this.$refs.wrapper.clientWidth
		}
	})
},
    methods:{
        pathPush() {
			let last = this.detailitem.url.lastIndexOf('/') + 1
			let id = this.detailitem.url.substring(last,this.detailitem.url.length).split('.')[0]
			console.log(id)
			// 请求获取m3u8地址
			this.$msg.loading({
			  message: '加载中...',
			  duration:0,
			  // forbidClick: true,
			  loadingType: 'spinner'
			});
			// this.$http.get('/temp/getM3u8?id=' + id).then(res=>{
			// 	console.log(res)
			// 	let m3u8 = res.data
				this.$router.push(`/article/${id}/20`)
			// 	this.$msg.clear()
			// })
			
		}
    }
}
</script>

<style scoped lang="less">
.detailItem{
    p{
        font-size: 3.333vw;
        padding: 0.833vw 0;
    }
    .imgparent{
        position: relative;
         .bottom{
            padding: 0 2.778vw;
            margin-bottom: 1.389vw;
            position: absolute;
            bottom: 0.556vw;
            background: linear-gradient(0deg,rgba(0,0,0,.85),transparent);
            justify-content: space-between;
            color: white;
            display: flex;
            left: 0;
            right: 0;
        }
    }
}

.com-image{
	position: absolute;
	right: 1rem;
	// bottom: 1rem;
	bottom: 0.3rem;
	border-radius:50%;
	width:2rem;
	height:2rem;
}

</style>
