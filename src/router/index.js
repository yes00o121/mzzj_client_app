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
const search = ()=>import('@/views/search.vue')
const video = ()=> import('@/views/video.vue')
// const dynamic = ()=>import('@/views/dynamic.vue')
Vue.use(VueRouter)
  const routes = [
     {
       path:'/home',
       component:Home,
       meta:{
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
         istoken:true
       }
     },
     {
       path:'/edit',
       component:edit,
       meta:{
        istoken:true
      }
     },
     {
       path:'/article/:id/:loadMode',
       component:article
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
      component:manga
    },
	{
	  path:'/mangaDetail/:id/:pxh',
	  component:mangaDetail,
	  meta:{
	    keepalive:false
	  }
	},
	{
	  path:'/person/:id',
	  component:person
	},
	{
		  path:'/search',
		  component:search
		},
		{
			  path:'/video',
			  component:video
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
