<template>
	<div v-if="detailitem">
		<video class="video_box 	" loop webkit-playsinline="true" x5-video-player-type="h5-page"
				x5-playsinline  x-webkit-airplay="allow" 
			   x5-video-player-fullscreen="true" playsinline="true" preload="auto"
			   style="object-fit:fill" autoplay  muted
			   :poster="cover" :src="url" :playOrPause="$parent.playOrPause"
			   :controls="false"
			   object-fit="fill"
			   @click="pauseVideo" @ended="onPlayerEnded($event)" 
		>
		</video>
	</div>
</template>

<script>

export default {
	name:'videoitem',
	props: ['cover','url', 'detailitem'],
	created(){
		// alert(this.favorite)
		// console.log('又被加载...' + JSON.stringify(this.detailitem))
		
		// console.log('加载.............' + this.detailitem)
	},
	data(){
		return {
			// cover:'',
			// url:'',
			// id:'',
			// favorite:null
		}
	},
	methods:{
		onPlayerEnded(event){
			// this.$emit('onPlayerEnded')
			this.$emit('onPlayerEnded',event,null)
		},
		pauseVideo(e){
			console.log('点击。。。。。')
			this.$emit('pauseVideo',e,null)
		}
	}
}
</script>

<style>
	video {
	    /* object-position: 0 0; */
		height:100%;
		width:100%;	
		/* margin-top: 73%; */
	}
</style>
