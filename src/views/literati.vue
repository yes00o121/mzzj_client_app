<template>
	<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}">
		<van-sticky >
			<van-cell  style="z-index:999;"  icon="arrow-left" :title="manga.title"  @click="returnPage"/>
		</van-sticky>
  <div class="home" v-if="category" :style="'height:'+windowWidth+'px'">
	<div style="position: relative;height:300px" >
		 <van-image
		   fit="contain"
		   :src="baseURL + manga.previewImg + '&width='+width+'&height='+windowWidth + '&random=1&token=' + token" rel="external nofollow" 
		   style="width:100%;"
		 />
		 <div style="position: absolute;right:0;bottom:0;">
			<van-button plain type="default" @click="collectionClick" :class="{activeColor:collectionActive}">
				<van-icon style="top:5px" name="star-o" size="1.5rem" />
				<span>&nbsp;收藏</span>
			</van-button>
		</div>
	</div>
    <div class="categorytab" >
	  <div><h1 >第一章</h1><p >歌岛是个小岛，人口一千四百人，周围不到四公里。</p><p >歌岛最美的景观有两处。其中一处是岛的顶端，那里有一座面向西北方的八代神社。</p><p >小岛位于伊势海湾口，从这里环顾伊势海面，四周景物尽收眼底。北边紧邻知多半岛，自东到北是绵延的渥美半岛。西面，由宇治山田至四日市的一带海岸隐约可见。</p><p >登上二百级的石阶，来到由一对石狮子护卫的牌坊前，站在这里回首眺望，可以看见被远景包围的、自古以来的伊势海面。本来这里生长着一棵类似牌坊的“牌坊松”，枝叶交错，为景色镶上了有趣的画框，可是数年之前干枯了。</p><p >松树绿色尚浅，然而近岸的海面却染上了春天海藻的暗红。西北的季风从津市的海口不断吹过来，给来这里赏景的人增添了几分清寒。</p><p >八代神社是祭祀海神绵津见命的。对于这位海神的信仰，自然来自渔夫们的生活。他们平素祈求海上安全，遇到海难能够得以幸免，于是争先恐后向这座神社供纳香资。</p><p >八代神社有六十六面铜镜之宝。既有八世纪的葡萄镜，也有日本仅存的六朝时代铜镜的仿制品。那些雕刻在镜子背面的鹿和松鼠，在遥远的古代，从波斯的森林经过漫长的陆路和烟水浩荡的海途，绕过半个世界来到这里，至今定住于这座小岛之上。</p><p >另一处美好的景观是靠近岛上东山山顶的灯塔。</p><p >竖立着灯塔的悬崖下面，伊良湖水道海流的轰响不绝于耳。连接伊势海和太平洋的这座狭窄的海门，在有风的日子里总是翻卷着旋涡。隔着水道，渥美半岛的尖端迫在眼前，在这片多石又荒凉的临水岸边，耸立着伊良湖岬角无人管理的小小灯塔。</p><p >自歌岛灯塔可以望到太平洋的一部分，隔着东北渥美湾周围群山的远方，在刮起强劲西风的早晨，有时可以看见富士山。</p><p >由名古屋或四日市进出港口的轮船，穿过海湾内外无数渔船，通过伊良湖水道的时候，灯塔员总是对着望远镜观察，迅速报出船名。</p><p >进入镜头视野的是三井航线的货船——一千九百吨的十胜丸，身穿作业服的两名船员一边踏步一边说话。</p><p >过了一会儿，又有一艘英国船——塔里斯曼号进港。一个船员在上甲板玩套圈游戏，身影小巧而鲜明。</p><p >灯塔员坐在值班房的桌子前边，在船舶通过表上记录着船名、信号符号、通过时分和方向，然后做成电文发出去。根据他的报告，海港的货主会尽早做好准备。</p><p >一到下午，落日被东山遮挡，灯塔附近一片荫翳，老鹰在明丽的海上盘旋。天空高渺，它不住鼓动着两翼翱翔，眼看就要俯冲下来。然而却没有俯冲，只是迅疾地在空中一缩身子滑翔下去。</p><p >太阳下山时，一位青年渔夫手里提着一条大比目鱼走出村子，登上一边的山道，直奔灯塔而来。</p><p >他前年刚从新制中学毕业，才十八岁。身材高大，体魄健壮，一脸稚气很符合他的年龄。他的肌肤被太阳晒得不能再黑了，长着极富岛民特色的端正的鼻子和皲裂的嘴唇。一双闪闪发亮的黑眼珠是以大海为家的人们从大海那里获得的赏赐，而绝不是智慧的闪现。因为他的学习成绩实在太差。</p><p >他今天整日都穿着作业服在捕鱼，这是他死去的父亲留下的裤子和粗糙的上装。</p><p >青年已经穿过静寂的小学校园，登上水车旁边的山坡，顺着石阶来到八代神社后头。神社院子中沉浸在夕暮里的桃花灼灼可见。从那到灯塔还有将近十分钟的路程。</p><p >这条山路着实崎岖不平，即使在白天，走不惯的人也会跌倒。然而这位青年，闭着眼睛也能分辨出松树根和岩石。眼下，他一边思考问题一边前行也不会被绊倒。</p><p >先前，趁着还有残照的时候，载着青年的太平丸回到了歌岛港。这位青年和船主还有一个伙伴，每天一同乘着这只小汽艇去捕鱼。回港后，他把捕的鱼卸到合作社的船上，将小船拖上岸，然后手里拎上一条比目鱼准备送往灯塔长家里。青年首先要沿着海滨回自家一趟，每逢这时候，暮色降临海滩，众多渔船回港靠岸，传来一阵阵嘈杂的吆喝声。</p><p >沙滩上有一位陌生的少女，站在一只名叫“算盘”的坚固木座旁边，她把身子靠在木座上休息。当吊车将渔船拖上岸时，这只木座就托住船底，渔船被一点点拉动上来。少女似乎刚干完活正在歇息呢。</p><p >她的额头渗出了汗水，面颊红扑扑的。寒冷的西风刮得正紧，正在干活的少女将火红的脸蛋儿裸露在风里，秀发飘扬，显得非常兴奋。她穿着棉坎肩儿，手上戴着脏污的线手套。健康的肤色和别的少女没有什么区别，只是她双目清亮，眉宇娴静。少女凝眸遥望西方海上，那里黑云攒聚之间，露出一点儿夕照的红霞。</p><p >青年没见过这张面孔，大凡歌岛的人，基本上没有他不认识的。外来人他一眼就看得出。可是这位少女却不是一副外地人的打扮啊，唯有她那独自一人盯着海面的神情，不像是岛上快活的女人们。</p><p >青年故意从少女眼前走过，就像小孩子看稀罕景。他面对面望着少女，少女微微皱起了眉头，她眼睛没有朝向青年，依然目不转睛地望着海面。</p><p >性格沉静的青年，经过一番检验之后，随即匆匆离开那里。此时，他一味沉浸在充满好奇心的幸福之中。这种有失礼仪的检验使他面带愧色，直到后来登上通往灯塔山路的时候。</p><p >青年从一排排松树之间眺望眼下潮水汹涌的海面。月出前的大海黑沉沉一片。</p><p >他拐上“女儿坡”——传说这里时常会碰到一个高个子女妖。开始可以望见灯塔上又高又亮的窗户了，那里的灯光渗入青年的眼眸。村中的发电机很早就出了故障，村子里只能点油灯。</p><p >他经常给灯塔长送鱼，是为了感谢灯塔长的恩情。据说青年从新制中学毕业时被留级，只得延长一年毕业。碰巧他母亲经常来灯塔附近收集点火的松叶，结识了灯塔长的夫人。青年的母亲对那位夫人诉苦说，要再读一年的话生活便没有了着落。夫人回去对灯塔长说了，灯塔长听后去会见了关系亲密的校长，校长免除了青年留级，使他能按时毕业。</p><p >青年出了学校就去捕鱼了。他经常给灯塔长送些水产，帮忙买买东西。所以甚得灯塔长夫妇的欢心。</p><p >通向灯塔的几段水泥阶梯前，有一块小小的空地，这里就是灯塔长的官邸。厨房的玻璃窗上晃动着夫人的身影，似乎正在做晚饭。青年从外头招呼了一声，夫人打开房门。</p><p >“哎呀，是新治啊！”</p><p >当他默默不语地把比目鱼递过去的时候，夫人高声喊道：</p><p >“孩子他爸，久保送鱼来啦！”</p><p >灯塔长在里头用质朴的嗓音回应道：</p><p >“老是麻烦你，快进来，新治君。”</p><p >青年站在厨房门口，心里犯起了踌躇。比目鱼已经搁在大白瓷盘里了，鱼鳃还在微微翕动。血水从鳃里流出来，渗进平滑、白嫩的肌理。</p></div>
    </div>
  </div>
  </v-touch>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "./cover";
import backTop from '@/components/backTop'
export default {
  data() {
    return {
		windowWidth:'300',
		curScroll:0, // 当前滚动位置
	  curPage:null, // 当前页面路径
		width:'',
		height:'',
      img:'',
	  collectionActive:false,
      manga:{}, // 漫画基础信息
      category: [],
      active: 0,
	  token: 'Bearer ' + localStorage.token,
      isLoading: false,   //是否处于下拉刷新状态
    };
  },
  components: {
    NavBar,
    cover,
	backTop
  },
  activated() {
    if(localStorage.getItem('newCat')) {
        let newCat = JSON.parse(localStorage.getItem('newCat'))
        this.category = this.changeCategory(newCat)
        this.selectArticle();
    }
	if(this.curPage == this.$route.params.id){
		if(this.curScroll > 0){
			scroll(0,this.curScroll)
		} else {
			scroll(0,0)
		}
		return;
	}
	this.curScroll = 0 // 不是相同页面,重置高度
	if(this.curPage){
		this.category = [];
		// this.curPage = this.$route.params.id
		this.selectCategory();
		this.collectionInit()
		this.$nextTick(()=>{
				  // let war = this.$refs.
			this.width = document.body.clientWidth
		})
	}
	this.curPage = this.$route.params.id // 当前页面设置为该id
  },
  filters:{
  	filterTime(val) {
  	  if(val){
  	    return val.split('T')[0]
  	  }
  	  return "";
  	},
  },
  methods: {
	  load(){
	
	  },
	  //收藏文章
	  async collectionClick() {
	     if(localStorage.getItem('token')){
	       // 判断显示状态,是收藏还是取消收藏
	       if(!this.collectionActive){
	         const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.$route.params.id})
	         // console.log(res)
	         if(res.data.data == '收藏成功'){
	             this.collectionActive = true
	         }else{
	             // this.collectionActive = false
	             this.$msg.fail(res.data.message)
	         }
	       } else {
	         const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.$route.params.id})
	         if(res.data.data == '取消成功'){
	           this.collectionActive = false
	         } else {
	            this.$msg.fail(res.data.message)
	         }
	       }
	  
	          // this.$msg.fail(res.data.msg)
	     }
	  },
	  //进入页面获取是否收藏
	  async collectionInit() {
	      if(localStorage.getItem('token')){
	          const res = await this.$http.post('/collection/queryCollectionByUseridAndDetailDataId',{
	              webInfoDetailDataId:this.$route.params.id
	          })
	          // console.log(res.data)
	      this.collectionActive = res.data.data == '1' ? true : false;
	      }
	  },
    onScroll(){
      // console.log('2222222222222222')
    },
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
	  this.$msg.loading({
	    message: '加载中...',
	    forbidClick: true,
	    loadingType: 'spinner'
	  });
	  // this.showloading()
	  scroll(0,0)
      // 查询漫画基础信息
      const res = await this.$http.post('/webInfoDetailData/queryDetailDataByTypeId',{
        id:this.$route.params.id
      })
      // console.log(res.data)
      this.manga = res.data.data.list[0]
      // this.$route.params.id
      // const res = await this.$http.get("/webInfoDetailData/queryMenu");
      const menu = [{DICT_NAME:this.manga.title}]
      this.category = this.changeCategory(menu);
      this.selectArticle();
    },
    changeCategory(data) {
      const category1 = data.map((item, index) => {
        // console.log(item)
        item.list = [];
        item.page = 0;
        item.finished = false;
        item.loading = true;
        item.pagesize = 100000;
        return item;
      });
      return category1;
    },
    async selectArticle() {
      const categoryitem = this.categoryItem();
      // 获取漫画目录数据
        const res = await this.$http.post('/manga/queryMangaMenuByWebInfoDataId',{
          webInfoDataId:this.$route.params.id,
		  pxh:this.$route.params.pxh
        })
		// console.log(res.data.data)
        // const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
        //   typeId: categoryitem.CODE_VALUE,
        //   pageNum: categoryitem.page,
        //   pageSize: categoryitem.pagesize,
        //   search: ''
        // })

        categoryitem.list.push(...res.data.data);
        categoryitem.loading = false;
        if (res.data.data.length < categoryitem.pagesize) {
		  categoryitem.loading = true;
          categoryitem.finished = true;
        }
		// this.hideloading()
		this.$msg.clear()
    },
	onSwipeLeft () {
		// alert('页面右滑')
	    // console.log('页面左滑')
	  // this.$router.go(-1)
	},
	onSwipeRight(){
	    // alert('页面右滑')
		// 跳转其他页面的时候记录高度
		// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
		// alert('漫画高度' + this.curScroll)
	    // this.$router.go(-1)
	},
	toDetail(item){
		// console.log(item)
		// 跳转漫画明细页面
		// this.$route.push()
		 this.$router.push(`/mangaDetail/${item.webInfoDetailDataId}/${item.pxh}`)
	},
	returnPage(){
		this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
		// alert('漫画高度' + this.curScroll)
		this.$router.go(-1)
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
        categoryitem.page = 1;
        this.selectArticle();
      }, 1000);
    },
    categoryItem() {
      const categoryitem = this.category[this.active];
      // console.log(categoryitem)
      return categoryitem;
    },

  },
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){
	
   next();
  },
  // 其他页面跳转过来
  beforeRouteEnter(to, from,next){
	  next();
  },
  destroyed(){
	// console.log('返回了..........................')  
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
	  this.collectionInit()
	  this.$nextTick(()=>{
		  // let war = this.$refs.
		  this.width = document.body.clientWidth
	  })
  },
  $route() {
      this.collectionInit()
  },
  mounted(){
    // this.select
  }
};
</script>

<style lang="less" scoped>
.activeColor{
            color: #fb7299;
        }
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

.goods-card {
  margin: 5;
  background-color: white;
}

.delete-button {
  height: 100%;
}
.van-card__thumb{
	position: relative;
	    -webkit-box-flex: 0;
	    -webkit-flex: none;
	    flex: none;
	    width: 120px;
	    height: 80px;
	    margin-right: 20px;
}
.van-card__title{
	font-size:16px;
	
}

.van-card__desc{
bottom: 0;
    position: absolute;
}
.van-swipe-cell{
	position: relative;
	    overflow: hidden;
	    background: white;
	    cursor: grab;
}
input[type='button']:enabled:active, input[type='button'].mui-active:enabled, input[type='submit']:enabled:active, input[type='submit'].mui-active:enabled, input[type='reset']:enabled:active, input[type='reset'].mui-active:enabled, button:enabled:active, button.mui-active:enabled, .mui-btn:enabled:active, .mui-btn.mui-active:enabled{
	color:black;
	background-color:white
}
.van-button--hairline::after{
	border-color:white
}
.van-button::before{
	// border-color:black;
	border-color:black;
	background-color:white;
}
.van-cell__title{
	-webkit-box-flex: 1;
	-webkit-flex: 1;
	flex: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
