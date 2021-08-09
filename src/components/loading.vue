<template>
<div>
<van-overlay
  :show="isShow"
  :custom-style="{
	background: 'black',
	display: 'flex',
	justifyContent: 'center',
	paddingTop: '300px'
  }"
>
  <van-loading size="24px" color="#4994df">
	<span style="color:#4994df">{{ title || '加载中···' }}</span>
  </van-loading>
</van-overlay>
</div>
</template>

<script>
</script>

<style>
</style>
