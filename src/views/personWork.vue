<!-- 作品信息 -->
<template>
	<div style="background:white;">
		<van-sticky >
			<van-cell class="van-ellipsis"  style="z-index:99999;width:90%"  icon="arrow-left" :title="work.works_name1"  @click="returnPage"/>
		</van-sticky>
		<!-- 作品数据 -->
		<div style="justify-content: space-around;flex-wrap: wrap;display: flex;padding: 0px 1rem;">
			<div>{{work.works_name}}</div>
			<!-- <div> -->
				<van-image lazy-load :src="baseURL +   work.works_photo + '&token=' + token" style="width:100%;height:78.778vw;margin-top:1rem"/>
			<!-- </div> -->
			
		</div>
		<div>
			<van-cell-group style="text-align: initial;">
			  <van-cell title="番号" :value="work.works_number" v-if="work.works_number" />
			  <van-cell title="发布时间" :value="work.works_time" v-if="work.works_time" />
			  <van-cell title="影片时长" :value="work.works_length" v-if="work.works_length" />
			  <van-cell title="导演" :value="work.works_director_name" v-if="work.works_director_name" />
			  <van-cell title="发行商" :value="work.works_company" v-if="work.works_company" />
			  <van-cell title="制作商" :value="work.works_production" v-if="work.works_production" />
			  <van-cell title="系列" :value="work.works_series" v-if="work.works_series" />
			  <van-cell title="类别" :value="work.works_category" v-if="work.works_category" />
			  <!-- <van-cell title="单元格" value="内容" label="描述信息" /> -->
			</van-cell-group>
		</div>
		<!-- 演员数据 -->
		<div v-if="participates.length > 0">
			<van-cell-group style="text-align: initial;">
				<van-cell title="演员" value="" />
			</van-cell-group>
			<div >
				<div v-for="(item,index) in participates" :key = "index">
					<van-image  lazy-load :src="baseURL +   item.works_photo + '&token=' + token" class="participates-photo" />
					<div class="participates-photo" >{{item.person_name}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return {
			work:{},
			participates:[], // 出演人员
			token: 'Bearer ' + localStorage.token,
		}
	},
	methods:{
		returnPage(){
			this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			this.$router.go(-1)
		},
		async initPersonWorkData(){
			const res = await this.$http.post("/person/queryPersonWork", {
			  pageNum: 1,
			  pageSize: 10,
			  workId: this.$route.params.id
			})
			this.work = res.data.data.list[0]
			console.log(res)
		},
		async initPersonWorkParticipate(){
			const res = await this.$http.post("/person/queryPersonWorkParticipate", {
			  workId: this.$route.params.id
			})
			// console.log(res)
			this.participates = res.data.data
		}
	},
	created(){
		// 作品数据
		this.initPersonWorkData()
		// 演员数据
		this.initPersonWorkParticipate()
	}
}
</script>

<style scoped>
.participates-photo{
	width:30%;
	height:30.778vw;
	margin:.5rem .3rem;
	float:left
}
</style>
