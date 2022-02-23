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
const collection = ()=>import('@/views/collection.vue')
const history = ()=>import('@/views/history.vue')
const userlog = ()=>import('@/views/userlog.vue')
const netresources = ()=>import('@/views/netresources.vue')
const message = ()=>import('@/views/message.vue')
const messageDetail = ()=>import('@/views/messageDetail.vue')
const videoUserInfo = ()=>import('@/components/Profile/Profile.vue')

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
		path:'/collection',
		name:'collection',
		 component:collection,
		 meta:{
			 index:3,
			 keepalive:true
		 }
	 },
	 {
	 		path:'/userlog',
	 		name:'userlog',
	 		 component:userlog,
	 		 meta:{
	 			 index:3,
	 			 // keepalive:true
	 		 }
	 },
	 {
	   path:'/netresources/:id',
	   name:'netresources',
	   component:netresources,
	   meta:{
	 	index:3,
	     keepalive:true
	   }
	 },
	 {
	   path:'/message',
	   name:'message',
	   component:message,
	   meta:{
	 	index:3,
	     keepalive:true
	   }
	 },
	 {
	   path:'/messageDetail/:messageSource/:id',
	   name:'messageDetail',
	   component:messageDetail,
	   meta:{
	 	index:4,
	     keepalive:true
	   }
	 },
	 
	 
	 
	 {
	 		path:'/history',
			name:'history',
	 		 component:history,
	 		 meta:{
	 			 index:3,
	 			 keepalive:true
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
	  name:'person',
	  component:person,
	  meta:{
		  keepalive:true,
		  index:4
	  }
	},
	{
	  path:'/personWork/:id',
	  name:'personWork',
	  component:personWork,
	  meta:{
		keepalive:true,
		index:5
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
		index:2,
	    keepalive:true
	  }
	},
	{
	  path:'/video',
	  component:video,
	  meta:{
		  index:7,
		  keepalive:true
	  }
	},
	{
	  path:'/set',
	  component:set,
	  name:'set',
	  meta:{
		index:2,
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
    },
	{
	  path:'/videoUserInfo/:id/:type/',
	  name:'videoUserInfo',
	  component:videoUserInfo,
	  // redirect: '/videoUserInfo/:id/:type/video',
	  children: [
	          // {
	          //   name: 'video',
	          //   path: '/video',
	          //   component: () => import('@/views/videoUserList.vue')
	          // },
			  {
			    name: 'videoUserInfo/video',
			    path: 'video',
			    component: () => import('@/views/videoUserList.vue')
			  },
	          // {
	          //   name: 'profile/videoDesc',
	          //   path: 'videoAndDesc',
	          //   component: () => import('@/views/videoAndDesc.vue')
	          // },
	          // {
	          //   name: 'profile/likes',
	          //   path: 'likes',
	          //   component: () => import('@/views/likes.vue')
	          // }
	        ]
	 //  meta:{
		// index:3,
	 //    // keepalive:true
	 //  },
	  // children: [
	  //   {
	  //     name: '/videoUserInfo/:id/:type',
	  //     path: 'video',
			   
	  //     component: () => import('@/base/searchVideoList/searchVideoList.vue')
	  //   },
	  //   // {
	  //   //   name: 'videosearch/user',
	  //   //   path: 'user',
	  //   //   component: () => import('@/base/searchUserList/searchUserList.vue')
	  //   // }
	  // ]
	},
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
