<template>
  <div class="home" v-if="category">
    <!-- <div class="categorytab">
      <van-tabs v-model="active" swipeable sticky animated >
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy >
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
			style="padding-bottom: 50px;"
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
    </div> -->
  </div>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "@/views/cover";
export default {
  data() {
    return {
      category: [],
      // menu:[{id:1,DICT_NAME:'收藏'},{id:2,DICT_NAME:'评论'}],
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
      const menu = [{DICT_NAME:'消息'},{DICT_NAME:'视频'},{DICT_NAME:'漫画'}]
      this.category = this.changeCategory(menu);
      this.selectArticle();
    },
    changeCategory(data) {
      const category1 = data.map((item, index) => {
        item.list = [];
        item.page = 1;
        item.finished = false;
        item.loading = true;
        item.pagesize = 10;
        return item;
      });
      return category1;
    },
    async selectArticle() {
      const categoryitem = this.categoryItem();
	const res = await this.$http.post("/message/queryMessage", {
          // typeId: categoryitem.CODE_VALUE,
          pageNum: categoryitem.page,
          pageSize: categoryitem.pagesize,
          // : ''
        })
        if(res.data.data.list == 0){
          categoryitem.finished = true;
          return
        }
        categoryitem.list.push(...res.data.data.list);
        categoryitem.loading = false;
        if (res.data.data.list.length < categoryitem.pagesize) {
          categoryitem.finished = true;
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
	  // console.log(categoryitem)
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
      // console.log(categoryitem)
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
  // background-color: white;
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
    background-color: #ee0a24;
  }
}

</style>
s