<template>
<div>
	<div class="userdetail">
	  <div>
	    <div class="user_img">
	      <!-- <img :src="baseURL + '/common/image?imgId=' + userInfo.icon" alt="" v-if="userInfo.icon"  > -->
	      <!-- <img src="@/assets/default_img.jpg" alt v-else  /> -->
	    </div>
	    <div class="user_edit">
	      <div>
	        <p>
	          <span>0</span>
	          <span class="user_text">粉丝</span>
	        </p>
	        <p>
	          <span>0</span>
	          <span class="user_text">关注</span>
	        </p>
	        <p>
	          <span>0</span>
	          <span class="user_text">获赞</span>
	        </p>
	      </div>
	      <div  @click="$router.push('/edit')">
	        <div class="user_editBtn">编辑资料</div>
	      </div>
	    </div>
	  </div>
	  <div>
	    <!-- <h2>{{userInfo.name}}</h2> -->
	    <!-- <p v-if="userInfo.user_desc">{{userInfo.user_desc}}</p> -->
	    <!-- <p v-else>这个人很神秘，什么都没有写</p> -->
	  </div>
	</div>
  <div class="home" v-if="category">
    <div class="categorytab">

      <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
      <van-tabs v-model="active" swipeable sticky animated>
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
              <div class="detailparent" ref="tab">
                <cover
                  class="detailitem"
                  :detailitem="categoryitem"
                  v-for="(categoryitem,categoryindex) in item.list"
                  :key="categoryindex"
                />
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "@/views/cover";
export default {
  data() {
    return {
      category: [],
      // menu:[{id:1,DICT_NAME:'作品'},{id:2,DICT_NAME:'评论'}],
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
    };
  },
  components: {
    NavBar,
    cover
  },
  activated() {
    if(localStorage.getItem('newCat')) {
        let newCat = JSON.parse(localStorage.getItem('newCat'))
        this.category = this.changeCategory(newCat)
        this.selectArticle();
    }
  },
  methods: {
    onScroll(){
      // console.log('2222222222222222')
    },
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
      // const res = await this.$http.get("/webInfoDetailData/queryMenu");
      // console.log(res)
      const menu = [{DICT_NAME:'作品'}/*,{DICT_NAME:'评论'}*/]
      this.category = this.changeCategory(menu);
      this.selectArticle();
    },
    changeCategory(data) {
      const category1 = data.map((item, index) => {
        item.list = [];
        item.page = 0;
        item.finished = false;
        item.loading = true;
        item.pagesize = 10;
        return item;
      });
      return category1;
    },
    async selectArticle() {
      const categoryitem = this.categoryItem();
      if(categoryitem.DICT_NAME == '作品'){
		  // 擦
		  // const res = await this.$http.post("/person/queryPerson", {
		  //   personType:'SEX'
		  // })
        // console.log(categoryitem)
        const res = await this.$http.post("/person/queryPersonWork", {
          // typeId: categoryitem.CODE_VALUE,
		  personId: this.$route.params.id,
          pageNum: categoryitem.page,
          pageSize: categoryitem.pagesize,
          // search: ''
        })
        if(res.data.data.list == 0){
          categoryitem.finished = true;
          return
        }
		for(let i =0;i<res.data.data.list.length;i++){
			res.data.data.list[i].flowNum = res.data.data.list[i].works_flow_num
			res.data.data.list[i].previewImg = '/common/image?imgId=' + res.data.data.list[i].works_photo
			res.data.data.list[i].title = res.data.data.list[i].works_name
		}
        categoryitem.list.push(...res.data.data.list);
        categoryitem.loading = false;
        if (res.data.data.list.length < categoryitem.pagesize) {
          categoryitem.finished = true;
        }
      }
      if(categoryitem.DICT_NAME == '评论'){
        categoryitem.loading = false;
        if(res.data.data.list == 0){
          categoryitem.finished = true;
        }
      }

    },
    onRefresh() {       //下拉刷新
                setTimeout(() => {
                    this.finished = false;
                    this.isLoading = false;
                    // this.list = []
                    let categoryitem = this.categoryItem();
                    categoryitem.page = 1;
                    categoryitem.list = []
                    this.selectArticle();
                }, 500);
            },
    onLoad() {
      const categoryitem = this.categoryItem();
	  console.log(categoryitem)
	  if(categoryitem.list.length == 0){
		  categoryitem.finished = true
	  }
      setTimeout(() => {
        categoryitem.page += 1;
        this.selectArticle();
      }, 1000);
    },
    categoryItem() {
      const categoryitem = this.category[this.active];
      console.log(categoryitem)
      return categoryitem;
    },

  },
  watch: {
    active() {
      const categoryitem = this.categoryItem();
      if (!categoryitem.list.length) {
        this.selectArticle();

        // this.$refs.tab.scrollTop = this.$refs.tab.$refs.wrapper.scrollTop;
      }
    }
  },
  created() {
      this.selectCategory();
  }
};
</script>

<style lang="less">
.home {
  background-color: white;
}
.detailparent {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .detailitem {
    margin: 1.389vw 0;
    width: 45%;
  }
}
.categorytab{
  position: relative;
  .category-ico{
    position: absolute;
    z-index: 5;
    right: 0;
    top: 1.944vw;
    padding: 1.389vw 2.778vw;
    background-color: white;
  }
}
.userdetail {
  background-color: white;
  padding: 2vw 3.333vw;
  > div:nth-child(1) {
    display: flex;
    .user_img {
      margin-right: 5.556vw;
      img {
        height: 23.611vw;
        width: 23.611vw;
        border-radius: 50%;
      }
    }
    .user_edit {
      flex: 1;
      div:nth-child(1) {
        display: flex;
        p {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-size: 3.611vw;
          .user_text {
            color: #aaa;
          }
        }
        p:nth-child(1),
        p:nth-child(2) {
          border-right: 0.278vw solid #ccc;
        }
      }
      div:nth-child(2) {
        padding: 0.556vw 2.778vw;
        .user_editBtn {
          border: 0.278vw solid #fb7a9f;
          padding: 0.833vw;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fb7a9f;
          border-radius: 1.111vw;
        }
      }
    }
  }
  >div:nth-child(2){
      h2{
          margin: 2.778vw 0 0.833vw 0;
          font-weight: 400;
      }
     p{
         padding: 0;
         margin: 2.778vw 0 0 0;
         color: #999;
     }
  }
}
</style>
