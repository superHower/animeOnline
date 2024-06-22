import request from "@/utils/request.js";

// 增加
export const addAnimeService = (data) => request.post('/anime/insert', data)
// 编辑
export const editAnimeService = (data) => request.patch('/anime/update', data)
// 查询
export const getAnimeListService = () => request.get('/anime/list')
export const getDetailAnimeService = (id) => request.get('/anime/info', { params: { id }})
// 搜索
export const searchAnimeNameService = (name) => request.get('/anime/infoByName', { params: { name }})
export const searchAnimeConditionService = (nation, time) => request.get('/anime/infoByCondition', { params: { nation, time }})
// 特殊条件查询
export const getLatestComments = (id) => request.get('/anime/latestComment', { params: { id }})
export const getFavoriteAnimeService = (id) => request.get('/anime/favoriteAnime', { params: { id }})
export const getCollectionAnimeService = (id) => request.get('/anime/collectionAnime', { params: { id }})

// 增加评论
export const sendCommentService =(data) => request.post('/ua/comment', data)

// 增加ua
export const AddUaService = (data) => request.post('/ua/insert', data)
// 获取ua信息
export const getUaInfoService = (uid, aid) => request.get('/ua/info', { params: { uid, aid }})


// 点赞
export const likeService = (uid, aid, key) =>
    request.patch(`/ua/updateLike?uid=${uid}&aid=${aid}&key=${key}`)
// 收藏
export const collectService = (uid, aid, key) =>
    request.patch(`/ua/updateCollect?uid=${uid}&aid=${aid}&key=${key}`)
// 评分
export const rankService = (uid, aid, ranking) =>
    request.patch(`/ua/updateRanking?uid=${uid}&aid=${aid}&ranking=${ranking}`)


