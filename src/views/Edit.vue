<template>
		<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}">
  <div v-if="model" class="editViews">
      <div style="margin-bottom:2.778vw;"><nav-bar ref="navbar"></nav-bar></div>
      <div class="uploadfile">
          <div class="uploadimg"><van-uploader preview-size="100vw" :after-read="afterRead" /></div>
          <edit-banner left="头像">
              <img :src="this.baseURL + '/common/image?imgId=' + model.icon"  slot="right" alt="" v-if="model.icon">
              <img src="@/assets/default_img.jpg"  slot="right" alt="" v-else>
          </edit-banner>
      </div>

      <!-- <edit-banner left="昵称" @bannerClick="show = true"> -->
      <edit-banner left="昵称">
          <a href="javascript:;" slot="right">{{model.nickName}}</a>
      </edit-banner>

      <edit-banner left="账号">
          <a href="javascript:;" slot="right">{{model.username}}</a>
      </edit-banner>

      <!-- <edit-banner left="性别" @bannerClick="gendershow = true"> -->
      <edit-banner left="性别" >
           <!-- <a href="javascript:;" slot="right">{{model.gender ? '男' : '女'}}</a> -->
           <a href="javascript:;" slot="right">Gay</a>
      </edit-banner>

      <!-- <edit-banner left="个签" @bannerClick="textshow = true"></edit-banner> -->

      <div class="editback" @click="$router.back()">返回个人中心</div>


      <van-dialog v-model="show"
      title="昵称"
      show-cancel-button
      @confirm="confirmClick"
      @cancel="content = ''"
      >
          <van-field v-model="content"  autofocus />
      </van-dialog>


      <van-dialog
         v-model="textshow"
         title="个签"
         show-cancel-button
         @confirm="textareaClick"
         @cancel="content = ''"
      >
          <van-field v-model="content" type="textarea" autofocus />
      </van-dialog>


       <van-action-sheet v-model="gendershow" cancel-text="取消" :actions="actions" @select="onSelect" />
  </div>
  </v-touch>
</template>

<script>
import NavBar from '@/components/common/Navbar.vue'
import editBanner from '@/components/common/editBanner.vue'
export default {
    data() {
        return {
            model:{},
            inconUrl: null,
            show:false,
            textshow:false,
            gendershow:false,
            content:'',
            actions: [
                { name: '男',val:1 },
                { name: '女',val:0 },
            ],
        }
    },
    components:{
        NavBar,
        editBanner
    },
    methods:{
		onSwipeLeft () {
		    // console.log('页面左滑')
		  // this.$router.go(-1)
		},
		onSwipeRight(){
		    // console.log('页面右滑')
		    this.$router.go(-1)
		},
        //进入组件调取数据渲染页面
        async selectUser() {
             // const res =  await this.$http.get('/user/' + localStorage.getItem('id'))
             const res = this.getUser().then(response=>{
               this.model = response.data.data
             })
             // = res.data[0]
        },
       async afterRead(file) {
           const fromdata = new FormData()
           fromdata.append('file',file.file)
           // const res =  await this.$http.post('/upload',fromdata)
           // this.model.user_img = res.data.url
           this.$http.post('/user/uploadPhoto',fromdata).then(response=> {
             console.log(response)
               if(response.data.code == 200){
                 this.$msg.success(response.data.message)
                 // 设置预览图片
                 const res = this.getUser();
                 res.then(response=>{
                   // console.log(response)
                   this.model.icon =  response.data.data.icon
                 })

               } else {
                 this.$msg.fail(response.data.message)
               }

           })
           // this.UserUpdate()
           setTimeout(()=>{
             this.$refs.navbar.NavInit()
           },500)

       },
       async UserUpdate() {
           const res = await this.$http.post('/update/' + localStorage.getItem('id'),this.model)
           if(res.data.code == 200){
               this.$msg.fail('修改成功')
           }
       },
       confirmClick() {
           this.model.name =  this.content
           this.UserUpdate()
           this.content = ''
       },
       textareaClick() {
           this.model.user_desc = this.content
           this.UserUpdate()
           this.content = ''
       },
       onSelect(data) {
           this.model.gender = data.val
           this.UserUpdate()
           this.gendershow = false
       }
    },
    created(){
        this.selectUser()
    }
}
</script>

<style scoped lang="less">
.editViews a{
    color: #333;
}
.editViews img{
    height: 12.778vw;
    width: 12.778vw;
    border-radius: 50%;
}
.uploadfile{
    overflow: hidden;
    position: relative;
    .uploadimg{
        opacity: 0;
        position: absolute;
    }
}
.editback{
    margin-top: 5.556vw;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    color: #999;
    padding: 4.167vw 0;
    font-size: 4vw;
}
</style>
