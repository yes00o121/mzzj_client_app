<template>
	<div>
		<van-sticky>
			<van-cell  style="z-index:999;width:100%;"  icon="arrow-left" class="van-ellipsis" title="消息"  @click="returnPage">
				<van-icon
				    slot="right-icon"
				    name="wap-home-o"
					size="1.2rem"
				    style="line-height: inherit;"
					@click.stop="$router.push('/')"
				  />
			</van-cell>
		</van-sticky>
		<!-- 菜单列表 -->
		<div>
			<h2 >{{$route.params.name}}</h2>
			<van-grid square style="border:none;">
			  <van-grid-item
			    @click="toPage(value)"
			    v-for="value in list"
			    :key="value.id"
			    :icon="value.img"
			    :text="value.title"
				style="border:none;"
			  />
			</van-grid>
		</div>

	</div>
</template>

<script>

export default{
	watch:{
		$route(to,from) {
			// console.log(to)
			// 跳转高度
			if(to.name == 'externalMenu'){
				// alert(this.currentScroll)
				this.$nextTick(()=>{
					document.documentElement.scrollTop = this.currentScroll
					document.body.scrollTop = this.currentScroll
				})
			}
			
			// id不同刷新
			if(to.name =='externalMenu' && to.params.id != this.person.id){
				this.$msg.loading({
				  message: '加载中...',
				  duration:0,
				  // forbidClick: true,
				  loadingType: 'spinner'
				});
				this.person = {}
				this.$http.post('/externalHandler/getPageTypeData',{
					id:this.$route.params.id
				}).then(res=>{
					console.log(res)
					this.list =res.data
					this.$msg.clear()
				})
			}
		}
	},
	created(){
		this.person.id = this.$route.params.id
		this.$msg.loading({
		  message: '加载中...',
		  duration:0,
		  // forbidClick: true,
		  loadingType: 'spinner'
		});
		this.$http.post('/externalHandler/getPageTypeData',{
			id:this.$route.params.id
		}).then(res=>{
			console.log(res)
			this.list =res.data
			this.$msg.clear()
		})
	},
	data(){
		return {
			list:[],
			person:{}
		}
	},
	components:{

	},
	methods:{
		returnPage(){
			this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			this.$router.go(-1)
		},
		toPage(item){
			console.log(item)
			let url = encodeURIComponent(item.videoUrl)
			this.$router.push(`/externalList/${this.$route.params.id}/${url}`)
			
			// this.$http.post('/externalHandler/getPageTypeDataDetail',{
			// 	id:this.$route.params.id,
			// 	url:item.videoUrl
			// }).then(res=>{
			// 	console.log(res)
			// 	// this.list =res.data
			// 	this.$msg.clear()
			// })
		}
	}
}
</script>

<style scoped>
h2{
	padding:16px;text-align:left
}
</style>
