<template>
	<van-overlay :show="show" @click="show = false">
	  <div class="wrapper" @click.stop>
	    <div class="block" />
	  </div>
	</van-overlay>
</template>

<script>
export default{
	data(){
		return {
			show:false
		}
	}
}
</script>

<style>
	.wrapper {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  height: 100%;
	}
	
	.block {
	  width: 120px;
	  height: 120px;
	  background-color: #fff;
	}
</style>
