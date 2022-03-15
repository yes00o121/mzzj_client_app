const state = {
  isLogged: false,
  // isLogged: true,
  loginInfo: {},
  fanUnreadNum: 0,
  byLikeUnreadNum: 0,
  byCommentUnreadNum: 0,
  atNum: 0,
  followedNewsNum: 0,
  allPrivateLetter: [],
  popularVideo: [],
  playList: [],
  playListDetail: [],
  catch_components: [],
  messageTotalNum:0 ,// 消息总数
  messageList:[], // 消息map对象
  websocketSendData: {}// websocket推送数据,全局监听这个
}
export default state
