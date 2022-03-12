<template>
  <div @click="pathPush" v-if="detailitem" ref="wrapper"> 
      <div class="detailItem">
          <div class="imgparent">
               <!-- <img :src="baseURL + detailitem.previewImg"  alt="" style="width:100%;height:47.778vw;"> -->
			   <!-- <van-image lazy-load :src="baseURL +   detailitem.previewImg + '&width='+width+'&height=' + height + '&token=' + token" style="width:100%;height:57.778vw;"> -->
			   <van-image lazy-load :src="baseURL +   detailitem.previewImg + '&token=' + token" style="min-height:4.5rem" v-if="detailitem.previewImg">
					  <template v-slot:error>
						 加载失败
					  </template>
					  <template v-slot:loading>
					      <van-loading type="spinner" size="20" />
					    </template>
			   </van-image>
			    <img src="@/assets/nowprinting.gif" v-else />
			   <!-- <img class="com-image" v-if="detailitem.person_nationality && detailitem.person_nationality == '日本'" src="@/assets/taiwan.jpg" alt="" > -->
			   <!-- <img class="com-image" v-if="detailitem。person_nationality && detailitem。person_nationality == '日本'" src="@/assets/taiwan.jpg" alt="" > -->
			   <!-- <img class="com-image" v-if="detailitem.person_nationality && detailitem.person_nationality == '中国香港'" src="@/assets/taiwan.jpg" alt="" > -->
			   <!-- <img class="com-image" v-if="detailitem.person_nationality && detailitem.person_nationality == '中国'" src="@/assets/taiwan.jpg" alt=""> -->
              <div class="bottom">
                  <!-- <div class="icon-play2"><span class="video">&nbsp;{{detailitem.flowNum}}</span></div> -->
				  <div v-if="detailitem.flowNum"><span class="video"><van-icon name="eye-o" />&nbsp;{{detailitem.flowNum}}</span></div>
                  <!-- <div class="icon-file-text"> <span class="comment">{{!detailitem.commentlen ? 66 : detailitem.commentlen}}</span> </div> -->
              </div>
          </div>
		  <!-- <p v-if="detailitem.descript">{{detailitem.descript}}</p> -->
          <p>{{detailitem.title}}</p>
		  <!-- 作品显示番号 -->
		  <p v-if="detailitem.works_number" style="color:#c00">{{detailitem.works_number}}&nbsp;/&nbsp;<span>{{detailitem.createTime}}</span></p>
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
			// console.log(this.detailitem)
            const loadMode = `${this.detailitem.loadMode}`;
			// 没有loadMode，走人员页面
			if(loadMode == 'undefined'){
				if(this.detailitem.person_label == 'avperformer_avfemale'){
					this.$router.push(`/person/${this.detailitem.id}/${this.detailitem.person_type}`)
				}
				if(this.detailitem.person_label == 'avperformer_91'){
					this.$router.push(`/videoUserInfo/${this.detailitem.id}/SEX/video`)
				}
			}
            // 视频页面
            if(loadMode == 4 || loadMode == 6){
              if(this.$route.path != `/article/${this.detailitem.id}/${this.detailitem.loadMode}`) {
                  this.$router.push(`/article/${this.detailitem.id}/${this.detailitem.loadMode}`)
              }
            }
            // 漫画页面
            if(loadMode == 2){
              // alert('漫画')
                this.$router.push(`/manga/${this.detailitem.id}`)
            }
			
			// 女优作品页面
			if(loadMode == 7){
				this.$router.push(`/personWork/${this.detailitem.id}`)
			}

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
