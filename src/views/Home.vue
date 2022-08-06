<template>
	<div>
		<!-- 头部 -->
		<nav-bar></nav-bar>
		<!-- 菜单列表 -->
		<div v-show="tabActive == 0">
			<h2 >内部系统</h2>
			<van-grid square style="border:none;">
			  <van-grid-item
			    @click="toPage(value)"
			    v-for="value in menuList"
			    :key="value.id"
			    :icon="value.img"
			    :text="value.name"
				style="border:none;"
			  />
			</van-grid>
			<h2 >外部系统</h2>
			<van-grid square style="border:none;">
			  <van-grid-item
			    @click="toExternalPage(value)"
			    v-for="value in externalMenuList"
			    :key="value.id"
			    :icon="value.img"
			    :text="value.name"
				style="border:none;"
			  />
			</van-grid>
		</div>
		<!-- 底部菜单 -->
		<div>
			<keep-alive >
			<userinfo v-show="tabActive == 3" ref="user"></userinfo>
			</keep-alive >
			<dynamic v-show="tabActive == 2" ref="dynamic"></dynamic>
			<keep-alive >
				<hot v-show="tabActive == 1" ref="hot"></hot>
			</keep-alive >
			<van-tabbar
			  v-model="tabActive"
			  active-color="#07c160"
			  inactive-color="#000"
			>
			  <van-tabbar-item icon="home-o" @click="home">首页</van-tabbar-item>
			  <van-tabbar-item icon="fire-o" @click="hit">热门</van-tabbar-item>
			  
			  <van-tabbar-item icon="underway-o"  :info="dynamicNum" @click="dynamic">动态</van-tabbar-item>
			  <van-tabbar-item icon="user-o" @click="my">我的</van-tabbar-item>
			</van-tabbar>
		</div>
	</div>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
import dynamic from "./dynamic"
import userinfo from './userinfo'
import hot from './hot'
export default{
	created(){
		this.$http.get('/externalHandler/getAll').then(res=>{
			console.log(res)
			this.externalMenuList = res.data
		})
	},
	data(){
		return {
			dynamicNum:null,
			tabActive:0,
			menuList:[{
				name:'漫画',
				id:2,
				img:'static/manga.png',
				url:'/mangaHome'
			},/*,{
				name:'麻豆TV',
				id:1,
				img:'static/madou.png'
			},*/{
				name:'AV图书馆',
				id:3,
				img:'static/nvyou.png',
				url:'/personHome'
			},{
				name:'抖阴',
				id:4,
				img:'static/douyin.png',
				url:'/video'
			},{
				name:'磁力检索',
				id:5,
				img:'static/cili.png',
				url:'/magnet'
			},{
				name:'美女写真',
				id:5,
				img:'static/xiuren.png',
				url:'/xiezhen'
			}/*,{
				name:'小说',
				id:6,
				img:'static/xiaoshuo.png'
			},{
				name:'草榴',
				id:7,
				img:'static/caoliu.png'
			}*/],
			externalMenuList:[]
		}
	},
	components:{
		NavBar,
		dynamic,
		userinfo,
		hot
	},
	methods:{
		toExternalPage(item){
			if(item.webtype == '视频'){
				this.$router.push(`/externalMenu/${item.id}/${item.name}`)
			}else if(item.webtype == '论坛'){
				this.$router.push(`/externalPagelList/${item.id}/${item.name}`)
			}else{
				this.$msg.fail('未开放');
			}

			// console.log(item)
			// this.$http.post('/externalHandler/getPageTypeData',{
			// 	id:item.id
			// }).then(res=>{
			// 	console.log(res)
			// })
		},
		toPage(item){
			this.$router.push(item.url)
		},
		home(){
			this.beforetabActive = this.tabActive
		},
		hit(){
				  this.beforetabActive = this.tabActive 
				  // this.$msg('功能开发中')
		},
		dynamic(){
				  this.beforetabActive = this.tabActive 
				  // this.$msg('功能开发中')
		},
		my(){
				  this.beforetabActive = this.tabActive
				  // this.$msg('功能开发中')
		},
	}
}
</script>

<style scoped>
h2{
	padding:16px;text-align:left
}
</style>
