<template>
  <div class="van-doc-demo-block">
    <div style="padding-left:5%;padding-top:5%;"><van-icon name="cross" /></div>
    <!-- <div class="van-doc-demo-block__title"  >
        <div>当前图片</div>
        <van-uploader :disabled="true" :deletable ="false" v-model="currentImge" />
    </div> -->

    <div class="van-doc-demo-block__title">上传图片</div>
    <div>
      <van-uploader :max-size="200000" :after-read="afterRead" :deletable ="false" v-model="fileList" multiple :max-count="2" :before-read="beforeRead"/>
    </div>
  </div>
</template>

<script>
export default {
    props:['address','fileId'],
    data() {
        return {
          fileList: [
            // { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
            // // Uploader 根据文件后缀来判断是否为图片文件
            // // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
            // { url: 'https://cloud-image', isImage: true }
          ]
        }
    },
    methods:{
      afterRead(file) {
        // 此时可以自行将文件上传至服务器
        console.log(file);
        var formData = new FormData(); //构造一个 FormData，把后台需要发送的参数添加
    　　formData.append('file', file.file); //接口需要传的参数
        this.$http.post('/user/uploadPhoto',formData).then(response=> {
          console.log(response)
            if(response.data.code == 200){
              this.$msg.success(response.data.message)
              // 设置预览图片
              const res = this.getUser();
              res.then(response=>{
                console.log(response)
                this.fileId = response.data.icon
                this.fileList[0] = {
                  url : this.baseURL + '/common/image?imgId=' + response.data.icon
                }
              })

            } else {
              this.$msg.fail(response.data.message)
            }

        })
    // 　　this.$upload('/user/uploadPhoto', formData).then(res => {//将formDate文件上传到阿里云服务器，会返回图片地址
    // 　　　　console.log(res);
    // // 　　　　let str = res.response_data[0];
    // // 　　　　this.uploadImages.push(str);//将图片地址存入一个数组中
    // 　　});
      },
      // 返回布尔值
    beforeRead(file) {
      if (file.type !== 'image/jpeg') {
        this.$msg.fail('请上传 jpg 格式图片');
        return false;
      }
      if(this.fileList.length > 0){

      }
      console.log(file)
      return true;
    },
    // 返回 Promise
    asyncBeforeRead(file) {
      return new Promise((resolve, reject) => {
        if (file.type !== 'image/jpeg') {
            this.$msg.fail('请上传 jpg 格式图片');
            reject();
          } else {
            resolve();
          }
        });
    }
    },
    mounted() {
        if(this.fileId){
          this.fileList[0] = {
            url : this.baseURL + '/common/image?imgId=' + this.fileId
          }
        }
    }
}
</script>

<style scoped lang="less">
.van-doc-demo-block__title{
  margin: 0;
    padding: 32px 16px 16px;
    color: rgba(69, 90, 100, 0.6);
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
}
</style>
