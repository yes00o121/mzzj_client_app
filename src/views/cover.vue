<template>
  <div @click="pathPush" v-if="detailitem">
      <div class="detailItem">
          <div class="imgparent">
               <img :src="/*baseURL + */detailitem.previewImg"  alt="" style="width:100%;height:47.778vw;">
              <div class="bottom">
                  <div class="icon-play2"><span class="video">&nbsp;{{detailitem.flowNum}}</span></div>
                  <!-- <div class="icon-file-text"> <span class="comment">{{!detailitem.commentlen ? 66 : detailitem.commentlen}}</span> </div> -->
              </div>
          </div>
          <p>{{detailitem.title}}</p>
      </div>
  </div>
</template>

<script>
export default {
    data(){
      return {
        // CURRENT_IP:'http://192.168.1.100:8095'
      }
    },
    props:['detailitem'],
    methods:{
        pathPush() {
            if(this.$route.path != `/article/${this.detailitem.id}/${this.detailitem.loadMode}`) {
                this.$router.push(`/article/${this.detailitem.id}/${this.detailitem.loadMode}`)
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

</style>
