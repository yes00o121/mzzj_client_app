<template>
  <div class="home" >
	<van-sticky>
		<van-cell  style="z-index:999;width:100%;"  icon="arrow-left" class="van-ellipsis" title="百科"  @click="returnPage">
			<van-icon
			    slot="right-icon"
			    name="wap-home-o"
				size="1.2rem"
			    style="line-height: inherit;"
				@click.stop="$router.push('/')"
			  />
		</van-cell>
	</van-sticky>
	<!-- home -->
    <div class="categorytab"  v-show="tabActive == 0" >
		<back-top :showHeight="300" ref="backtop"></back-top>
      <van-tabs v-model="active" swipeable sticky  animated offset-top="40">
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy  >
			<div slot="title">
				  <div>
					<van-icon name="photo-o" v-if="item.CODE_VALUE != '6'" size="1rem" />
					<van-icon name="user-o" v-if="item.CODE_VALUE == '6'" size="1rem"/>
					  {{item.DICT_NAME}}
				  </div>
			</div>
			<!-- 嵌套一层div做内容滚动区域, 一定要有确定高度，可以使用高度100%或calc(100vh - ?px) -->
			<div style="height: calc(100vh - 10vh); overflow: auto;-webkit-overflow-scrolling: touch;" :ref="'pageScroll'" @scroll="scrolls">
				<back-top :showHeight="100"></back-top>
			<van-sticky>
				<person-search-tool :show = "categoryItem().CODE_VALUE == '6'" @search = "personSearch"></person-search-tool>
			</van-sticky>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" >
            <van-list 
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
              <div class="detailparent" ref="tab" v-show="item.CODE_VALUE != 2">	
                <cover
				  :type="item.CODE_VALUE"
                  class="detailitem"
                  :detailitem="categoryitem"
                  v-for="(categoryitem,categoryindex) in item.list"
                  
                />
              </div>
			
            </van-list>
          </van-pull-refresh>
		  </div>
        </van-tab>
      </van-tabs>
    </div>

  </div>
</template>	

<script>
import cover from "./cover";
import backTop from '@/components/backTop'
import personSearchTool from '@/components/personSearchTool'
export default {
  data() {
    return {
	    personParams:{},// 人员参数
		token: 'Bearer ' + localStorage.token,
	  curScroll:{},
      category: [],
	  tabActive:0,// 底部菜单
	  beforetabActive:0,// 之前选中的底部
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	  // websocket:null
	  // videoStatus:true, // 视频状态,用于子组件刷新
    };
  },
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){
	
	  this.recordScroll(this.tabActive)
	  next()
  },
  beforeRouteEnter(to, from,next){
	  next()
  },
  components: {
    cover,
	personSearchTool,
	backTop
	// shortvideo
  },
  activated() {
  
		this.toBeforeScroll(this.tabActive)
	
  },
  methods: {
	  returnPage(){
	  	this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
	  	this.$router.go(-1)
	  },
	  slideTo (targetPageY,ref,fun) {
	    var timer = setInterval(function () {
	        var currentY = ref.scrollTop;//当前及滑动中任意时刻位置
	        var distance = targetPageY > currentY ? targetPageY - currentY : currentY - targetPageY;//剩余距离
	        var speed = Math.ceil(distance/10);//每时刻速度
	        if (currentY == targetPageY) {
	         clearInterval(timer);
			 fun()
	        } else {
				ref.scrollTo(0,targetPageY > currentY ? currentY + speed : currentY - speed);
	        }
	       },10);
	   },
	  scrolls(e){},
	  // 之前滚动位置跳转
	  toBeforeScroll(cur){
		  let pageScroll = this.$refs['pageScroll']
		  if(pageScroll && cur == 0){
			  for(let i =0;i<pageScroll.length;i++){
				  pageScroll[i].scrollTop = this.pageScroll[this.$route.name + 'pageScroll_'+ i]
			  }
		  }
			
		  if(cur == 1){
			   this.$nextTick(()=>{
				if(this.$refs.hot){
					this.$refs.hot.toBeforeScroll()
				}  
			})
		  }

	  },
	  // 记录滚动位置
	  recordScroll(cur){
		  let pageScroll = this.$refs['pageScroll']
		  if(pageScroll && cur == 0){
			  for(let i =0;i<pageScroll.length;i++){
				  this.pageScroll[this.$route.name + 'pageScroll_'+i] = pageScroll[i].scrollTop
				  
			  }
		  }
		  if(cur == 1){
			  if(this.$refs.hot){
				  this.$refs.hot.recordScroll()
			  }

		  }

	  },
    onScroll(){

    },
    async selectCategory() {
	  const res = [{
	  		  DICT_NAME:'演员',
	  		  CODE_VALUE:6
	  },{
	  		  DICT_NAME:'作品',
	  		  CODE_VALUE:7
	  }]
	  
      this.category = this.changeCategory(res);
      this.selectArticle();
    },
    changeCategory(data) {

      const category1 = data.map((item, index) => {
        item.list = [];
        item.page = 1;
        item.finished = false;
        item.loading = true;
        item.pagesize = 20;
		if(item.CODE_VALUE == 8){
		 	// 初始化的时候追加热门数据
			this.$http.post("/ranking/queryLatelyFlowData", {
				dataType: 2
			}).then(res=>{
				item.flowData = res.data.data
			})
		}
        return item;
      });
      return category1;
    },
	// 查询人员数据
	async selectPerson(){
		const categoryitem = this.categoryItem();
		const res = await this.$http.post("/person/queryPerson", Object.assign({
			pageNum: categoryitem.page,
			pageSize: categoryitem.pagesize,
			personType:'SEX'
		},this.personParams))
		for(let i =0;i<res.data.data.list.length;i++){
			res.data.data.list[i].flowNum = res.data.data.list[i].person_flow_num
			// if(res.data.data.list[i].person_label == 'avperformer_avfemale'){
			// 	res.data.data.list[i].previewImg = encodeURI('/video/person/' + res.data.data.list[i].person_nationality + '/' + res.data.data.list[i].person_name +'/head.jpg') + '?token=' + this.token
			// }
			res.data.data.list[i].title = res.data.data.list[i].person_name
			res.data.data.list[i].descript = ''
		}
		categoryitem.list.push(...res.data.data.list);
		categoryitem.loading = false;
		if (res.data.data.list.length < categoryitem.pagesize) {
			categoryitem.loading = true;
		  categoryitem.finished = true;
		}
	},
	
    async selectArticle() {
      const categoryitem = this.categoryItem();
		// 如果categoryitem.CODE_VALUE等于9,但是查询女优数据
		if(categoryitem.CODE_VALUE == 6){
			this.selectPerson(this.personParams)
			return;
		}else if(categoryitem.CODE_VALUE == 7){
			const res = await this.$http.post("/person/queryPersonWorks", {
			  pageNum: categoryitem.page,
			  pageSize: categoryitem.pagesize,
			  loadMode: categoryitem.CODE_VALUE
			})
			categoryitem.list.push(...res.data.data.list);
			categoryitem.loading = false;
			if (res.data.data.list.length < categoryitem.pagesize) {
			  categoryitem.loading = true;
			  categoryitem.finished = true;
			}
		}
    },
    onRefresh() {       //下拉刷新
                setTimeout(() => {
                    this.finished = false;
                    this.isLoading = false;
                    let categoryitem = this.categoryItem();
                    categoryitem.page = 1;
                    categoryitem.list = []
					categoryitem.finished = false;
                    this.selectArticle();
                }, 500);
            },
    onLoad() {
      const categoryitem = this.categoryItem();
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
      return categoryitem;
    },
	personSearch(params){
		const categoryitem = this.categoryItem();
		categoryitem.page = 1
		categoryitem.pagesize = 20 
		categoryitem.list = []
		categoryitem.finished = false;
		this.personParams = params
		this.selectPerson()
	},
	
  },
  
  watch: {
    active(current,before) {
	  const categoryitem = this.categoryItem();
	  // 切换时候记录之前位置
      if (!categoryitem.list.length) {
        this.selectArticle();
      }
    },
	tabActive(cur,bef){
		this.recordScroll(bef)
		this.$nextTick(()=>{
			this.toBeforeScroll(cur)
		})
	}
  },
  created() {
	  
	  this.$msg.loading({
	    message: '加载中...',
	    forbidClick: true,
	    duration:0
	  });
      this.selectCategory();
	  this.$msg.clear()
  }
};
</script>

<style lang="less" scoped>
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
.swipe-text{
	position: absolute;
	    bottom: 0.2rem;
	    margin-left: 0.75rem;
	    height: 30px;
	    line-height: 30px;
	    font-family: "Microsoft YaHei";
	    font-size: 16px;
	    position: absolute;
	    background: #5fa3ea;
		color:white;
		padding: 0 1rem;
		max-width:19rem;
}

.cell-distance{
	padding: 10px 16px;
}

.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: #ee0a24;
  border-radius: 100px;
}
.participates-photo{
	/* -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3); */
	width:100%;
	 // height:30.778vw;
	height:100%;
	/* height:100%; */
	/* height:90px; */
	margin:.0rem .3rem;
	/* float:left */
}
#swipeId img{
	object-position:top;
	border-radius:15px;
}
</style>
