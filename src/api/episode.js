import request from "@/utils/request.js";

export const getAnimeEpisodesService = (id) => request.get('/episode/list', { params: { id }})

export const sendBarrageService = (data) => request.post('/ue/insert', data)

export const getBarrageService = (eid) => request.get('/ue/list', { params: { eid }})