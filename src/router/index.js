import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('@/views/Home.vue')
const register = ()=>import('@/views/register.vue')
const login = ()=>import('@/views/Login.vue')
const userinfo = ()=>import('@/views/userinfo.vue')
const edit = ()=>import('@/views/Edit.vue')
const article = ()=>import('@/views/Article.vue')
const editcategory = ()=>import('@/views/EditCategory.vue')
const upload = ()=>import('@/components/common/upload.vue')
const manga = ()=>import('@/views/mangaMenu.vue')
const mangaDetail = ()=>import('@/views/mangaMenuDetail.vue')
const person = ()=>import('@/views/person.vue')
const personWork = ()=>import('@/views/personWork.vue')
const search = ()=>import('@/views/fullSearch.vue')
// const search = ()=>import('@/views/search.vue')
const video = ()=> import('@/views/video.vue')
const videosearch = () => import('@/views/videosearch.vue')
const set = () => import('@/views/set.vue')
const magnet = ()=>import('@/views/magnet.vue')
const literati = ()=>import('@/views/literati.vue')
// const dynamic = ()=>import('@/views/dynamic.vue')
Vue.use(VueRouter)
  const routes = [
     {
       path:'/home',
       component:Home,
	   name:'home',
       meta:{
		 index:1,
         keepalive:true
       }
     },
     {
       path:'/register',
       component:register
     },
     {
       path:'/',
       component:login
     },
     {
       path:'/userinfo',
       component:userinfo,
       meta:{
		 index:2,
         istoken:true
       }
     },
     {
       path:'/edit',
       component:edit,
       meta:{
		index:3,
        istoken:true
      }
     },
     {
       path:'/article/:id/:loadMode',
       component:article,
	   meta:{
		   index:4
	   }
     },
    {
      path:'/editcategory',
      component:editcategory
    },
    {
      path:'/upload',
      component:upload
    },
    {
      path:'/manga/:id',
      component:manga,
	  name:'manga',
	  meta:{
		index:5,
	    keepalive:true
	  }
    },
	{
	  path:'/mangaDetail/:id/:pxh',
	  component:mangaDetail,
	  name:'mangaDetail',
	  meta:{
		  index:3,
	  //   keepalive:false
	  }
	},
	{
	  path:'/magnet',
	  component:magnet,
	  meta:{
		  keepalive:true
	  }
	},
	{
	  path:'/person/:id/:type',
	  component:person,
	  meta:{
		  keepalive:true
	  }
	},
	{
	  path:'/personWork/:id',
	  component:personWork,
	  meta:{
		keepalive:true  
	  }
	},
	{
	  path:'/literati/:id',
	  component:literati,
	  meta:{
		keepalive:true  
	  }
	},
	{
	  path:'/search',
	  component:search,
	  name:'search',
	  meta:{
		index:6,
	    keepalive:true
	  }
	},
	{
	  path:'/video',
	  component:video,
	  meta:{
		  index:7
	  }
	},
	{
	  path:'/set',
	  component:set,
	  name:'set',
	  meta:{
		index:10,
	    keepalive:true
	  }
	},
  {
      path: '/videosearch/',
      component: videosearch,
      redirect: '/videosearch/video',
      children: [
        {
          name: 'videosearch/video',
          path: 'video',
          component: () => import('@/base/searchVideoList/searchVideoList.vue')
        },
        // {
        //   name: 'videosearch/user',
        //   path: 'user',
        //   component: () => import('@/base/searchUserList/searchUserList.vue')
        // }
      ]
    }
	// {
	//   path:'/dynamic',
	//   component:dynamic
	// }
  ]

const router = new VueRouter({
  routes
  // mode:'history'
  // mode:'hash'
})

router.beforeEach((to,from,next) => {
  if(!localStorage.getItem('token')&&to.meta.istoken == true){
    router.push('/')
    Vue.prototype.$msg.fail('请重新登录')
    return
  }
  if (from.meta.keepAlive) {
      const $content = document.querySelector('.content'); // 列表的外层容器
      const scrollTop = $content ? $content.scrollTop : 0;
      console.log('scrollTop', scrollTop)
      from.meta.scrollTop = scrollTop;
    }
  next()
})

export default router
