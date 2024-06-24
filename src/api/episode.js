import request from "@/utils/request.js";

export const getAnimeEpisodesService = (id) => request.get('/episode/list', { params: { id }})
export const addEpisodesService = (data) => request.post('/episode/insert', data)
export const editEpisodesVideo = (data) => request.patch('/episode/updateVideo', data)
export const editEpisodesName = (data) => request.patch('/episode/updateName', data)

export const sendBarrageService = (data) => request.post('/ue/insert', data)

export const getBarrageService = (eid) => request.get('/ue/list', { params: { eid }})