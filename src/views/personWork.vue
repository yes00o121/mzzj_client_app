<!-- 作品信息 -->
<template>
	<div style="background:white;">
		<van-sticky >
			<van-cell class="van-ellipsis"  style="z-index:99999;width:100%"  icon="arrow-left" :title="work.works_name1"  @click="returnPage"/>
		</van-sticky>
		<!-- 作品数据 -->
		<div style="justify-content: space-around;flex-wrap: wrap;display: flex;padding: 0px 1rem;">
			<div>{{work.works_name}}</div>
			<!-- <div> -->
				<van-image :src="baseURL + work.conver + '?token=' + token" style="width:100%;height:78.778vw;margin-top:1rem"/>
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
			</van-cell-group>
		</div>
		<!-- 演员数据 -->
		<div v-if="participates.length > 0" >
			<van-cell-group style="text-align: initial;">
				<van-cell title="演员" value="" />
			</van-cell-group>
			<div style="flex-wrap: wrap;display: flex;">
				<div v-for="(item,index) in participates" :key = "index" style="width:30%;padding: .3rem;">
					<div>
						<van-image v-if="item.personNationality"  lazy-load :src="baseURL +   item.personNationality + '?token=' + token" class="participates-photo" >
							<template v-slot:error>
								<img  src="@/assets/nowprinting.gif" class="participates-photo">
							</template>
						</van-image>
						<img v-if="!item.personNationality" src="@/assets/nowprinting.gif" class="participates-photo">
						<div class="text">{{item.person_name}}</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="workImages.length > 0">
			<van-cell-group style="text-align: initial;">
				<van-cell title="预览图" value="" />
			</van-cell-group>
			<div style="flex-wrap: wrap;display: flex;">
				<div v-for="(item,index) in workImages" :key = "index" style="width:45%;padding: .3rem;">
					<div>
						<van-image  lazy-load :src="baseURL +   item.content + '?token=' + token" class="participates-photo" @click="imagePreview(item)" />
					</div>
				</div>
			</div>
		</div>
		<div v-if="magnetList.length > 0">
			<van-cell-group style="text-align: initial;">
				<van-cell title="磁力" value="" />
			</van-cell-group>
			<van-cell :title="item.torrentName" v-for="(item,index) in magnetList" :key="index">
			  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
			  <van-button type="default" size="mini" v-clipboard:copy="item.magnet" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</van-button>
			</van-cell>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import { ImagePreview } from 'vant';
export default{
	data(){
		return {
			work:{},
			participates:[], // 出演人员
			workImages:[],// 预览图片
			imagePreviews:[], // 预览图片查看数组
			magnetList:[],// 磁力数组
			token: 'Bearer ' + localStorage.token,
		}
	},
	watch:{
		$route(to,from) {
			if(from.path.startsWith('/personWork')){
				return;
			}
			scroll(0,0)
			// 作品数据
			this.initPersonWorkData()
			// 演员数据
			this.initPersonWorkParticipate()
			// 预览图数据
			this.initPersonWorkImage();
		    // this.collectionInit()
		}
	},
	methods:{
		// 复制成功
		onCopy(){
			this.$msg.success('复制成功')
		},
		// 复制失败
		onError(){
			this.$msg.fail('复制失败')
		},
		// 图片预览
		imagePreview(item){
			// console.log(item)
			ImagePreview({
				images: this.imagePreviews,
				startPosition:item.works_content_number -1 
			})
		},
		returnPage(){
			this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			this.$router.go(-1)
		},
		async initPersonWorkData(){
			this.$msg.loading({
			  message: '加载中...',
			  forbidClick: true,
			  loadingType: 'spinner'
			});
			const res = await this.$http.post("/person/queryPersonWork", {
			  pageNum: 1,
			  pageSize: 10,
			  workId: this.$route.params.id
			})
			
			res.data.data.list[0].conver = '/video/person/' + encodeURI(res.data.data.list[0].person_nationality) + '/' + encodeURI(res.data.data.list[0].person_name) + '/' + res.data.data.list[0].works_number + '/bigCover.jpg'
			this.work = res.data.data.list[0]
			this.$msg.clear()
			// 磁力数据
			this.initMagnet();
		},
		async initPersonWorkParticipate(){
			const res = await this.$http.post("/person/queryPersonWorkParticipate", {
			  workId: this.$route.params.id
			})

			this.participates = res.data.data
			for(let i =0;i<this.participates.length;i++){
				let  personNationality = this.participates[i].person_nationality
				if(personNationality){
					this.participates[i].personNationality = '/video/person/' + personNationality + '/' +this.participates[i].person_name +'/head.jpg'
				}
			}
			
		},
		async initPersonWorkImage(){
			const res = await this.$http.post("/person/queryPersonWorkDetail", {
			  workId: this.$route.params.id
			})
			this.workImages = res.data.data
			for(let i =0;i<this.workImages.length;i++){
				this.imagePreviews.push(this.baseURL + this.workImages[i].content + '?token=' + this.token)
			}
		},
		async initMagnet(){
			const res = await this.$http.get("/magnet/queryMagnet?name=" + this.work.works_number)
			this.magnetList = res.data
		}
	},
	created(){
		// 作品数据
		this.initPersonWorkData()
		// 演员数据
		this.initPersonWorkParticipate()
		// 预览图数据
		this.initPersonWorkImage();
		
		
	}
}
</script>

<style scoped>
.participates-photo{
	width:100%;
	height:30.778vw;
	margin:.0rem .3rem;
	/* float:left */
}
.text{
	margin-top: 5px;
	color: #646566;
	font-size: 14px;
	text-align: center;
}
</style>
