import * as types from './mutation-types'
import { deduplicatePrivateLetter } from '@/common/js/util'
const mutations = {
  [types.SET_ISLOGGED] (state, isLogged) {
    state.isLogged = isLogged
  },
  [types.SET_LOGININFO] (state, loginInfo) {
    state.loginInfo = loginInfo
  },
  [types.SET_FANUNREADNUM] (state, fanUnreadNum) {
    state.fanUnreadNum = fanUnreadNum
  },
  [types.SET_BYLIKEUNREADNUM] (state, byLikeUnreadNum) {
    state.byLikeUnreadNum = byLikeUnreadNum
  },
  [types.SET_BYCOMMENTUNREADNUM] (state, byCommentUnreadNum) {
    state.byCommentUnreadNum = byCommentUnreadNum
  },
  [types.SET_ATNUM] (state, atNum) {
    state.atNum = atNum
  },
  [types.SET_FOLLOWEDNEWSNUM] (state, followedNewsNum) {
    state.followedNewsNum = followedNewsNum
  },
  [types.SET_ALLPRIVATELETTER] (state, allPrivateLetter) {
    state.allPrivateLetter = deduplicatePrivateLetter(allPrivateLetter)
  },
  [types.UPDATE_PRIVATELETTER] (state, privateLetter) {
    const index = state.allPrivateLetter.findIndex((item) => {
      return item.fromId === privateLetter.fromId
    })
    let unread
    if (index !== -1) {
      unread = (state.allPrivateLetter)[index].unread
      unread++
      state.allPrivateLetter.splice(index, 1)
    } else {
      unread = 1
    }

    if (privateLetter.isEnterChat) unread = 0

    state.allPrivateLetter.unshift({
      fromId: privateLetter.fromId,
      userAvatar: privateLetter.userAvatar,
      userNickname: privateLetter.userNickname,
      content: privateLetter.content,
      createdAt: privateLetter.createdAt,
      unread: unread
    })
  },
  [types.UPDATE_UNREAD_PRIVATELETTER] (state, privateLetter) {
    const index = state.allPrivateLetter.findIndex((item) => {
      return item.fromId === privateLetter.fromId
    })
    if (index !== -1) {
      (state.allPrivateLetter)[index].unread = 0
    }
  },
  [types.SET_POPULARVIDEO] (state, popularVideo) {
    state.popularVideo = popularVideo
  },
  [types.SET_PLAYLIST] (state, playList) {
    state.playList = playList
  },
  [types.APPEND_PLAYLIST] (state, playList) {
    state.playList = state.playList.concat(playList)
  },
  [types.CLEAN_PLAYLIST] (state) {
    state.playList = []
  },
  [types.SET_PLAYLIST_DETAIL] (state, playListDetail) {
    state.playListDetail = playListDetail
  },
  [types.APPEND_PLAYLIST_DETAIL] (state, playListDetail) {
    state.playListDetail = state.playListDetail.concat(playListDetail)
  },
  [types.CLEAN_PLAYLIST_DETAIL] (state) {
    state.playListDetail = []
  },
  [types.SET_PLAYLIST_MESSAGE] (state, playListMessage) {
    state.playListMessage = playListMessage
  },
  [types.APPEND_PLAYLIST_MESSAGE] (state, playListMessage) {
    state.playListMessage = state.playListMessage.concat(playListMessage)
  },
  [types.CLEAN_PLAYLIST_MESSAGE] (state) {
    state.playListMessage = []
  },
  [types.SET_MESSAGE_TOTAL_NUM] (state,num) {
    state.messageTotalNum = num
  },
  [types.APPEND_MESSAGE_LIST] (state,value) {
	// console.log('初始化数据')
    state.messageList.push(value)
  },
  [types.CLEAR_MESSAGE_LIST] (state,key) {
	state.messageList = []
  },
  
  GET_CATCHE_COMPONENTS (state, data) {
		state.catch_components = data
  }
}

export default mutations
