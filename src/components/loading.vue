<template>
<div>
<van-overlay
  :show="isShow"
  :custom-style="{
	background: 'white',
	display: 'flex',
	justifyContent: 'center',
	paddingTop: '300px',
	zIndex:'99999'
  }"
>
  <van-loading size="24px" color="black">
	<span style="color:black">{{ title || '加载中···' }}</span>
  </van-loading>
</van-overlay>
</div>
</template>

<script>
</script>

<style>
</style>
