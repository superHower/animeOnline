<script setup>

import { List, User, Stopwatch, Opportunity, StarFilled } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import { getAnimeEpisodesService, sendBarrageService, getBarrageService } from '@/api/episode.js'
import {
  getDetailAnimeService, getLatestComments, sendCommentService,
  likeService, collectService, rankService, getUaInfoService
} from '@/api/anime.js'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores'
import {ElMessage} from "element-plus";

import VideoPlayer from '@/components/VideoPlayer.vue'

const videoSrc = ref('')

const userStore = useUserStore()
const centerDialogVisible = ref(false)
const AnimeId = ref(null);
const EpisodeId = ref(null);
const animeInfo = ref({});
const episodeList = ref([])
const commentList = ref([])
const barrageList = ref([{}])

const ranking = ref(null)
const loading = ref(false)



const commentForm = ref({
  content: '',
  uaid: '',
  time: ''
})
const barrageForm = ref({
  barrage: '',
  uid: '',
  eid: '',
  time: ''
})


onMounted(() => {
  const url = new URL(window.location.href);
  AnimeId.value = url.searchParams.get('id');
  console.log(AnimeId.value)


  getEpisodeList()
  getAnimeInfo()
  getCommentList()
})
const getEpisodeList = async () => {
  loading.value = true

  const res = await getAnimeEpisodesService(AnimeId.value)
  episodeList.value = res.data
  console.log(episodeList.value)

  loading.value = false
}
const getAnimeInfo = async () => {
  loading.value = true

  const res1 = await getDetailAnimeService(AnimeId.value)
  animeInfo.value = res1.data
  console.log(animeInfo.value)

  loading.value = false
}
const getCommentList = async () => {
  loading.value = true

  const res = await getLatestComments(AnimeId.value)
  commentList.value = res.data
  console.log(commentList.value)

  loading.value = false
}

const openEpisode = (row) => {
  console.log(row)
  EpisodeId.value = row.id
  videoSrc.value = row.videoUrl
}
const onSendComment = async () => {
  const res = await getUaInfoService(userStore.user.id, AnimeId.value)
  commentForm.value.uaid = res.data[0].id
  const now = new Date().toLocaleString()
  const formattedDate = now.replace(/(\d{4})\/(\d{1,2})\/(\d{1,2})/, (match, year, month, day) => {
    return year + '-' + (month.length === 1 ? '0' + month : month) + '-' + (day.length === 1 ? '0' + day : day);
  });
  commentForm.value.time = formattedDate
  console.log(commentForm.value.time)
  await sendCommentService(commentForm.value)
  ElMessage.success('评论成功')
}
const onSendBarrage = async () => {
  if (EpisodeId.value === null) {
    ElMessage.warning('请先选择一个剧集')
    return
  }
  barrageForm.value.eid = EpisodeId.value;
  barrageForm.value.uid = userStore.user.id;
  const now = new Date().toLocaleString()
  const formattedDate = now.replace(/(\d{4})\/(\d{1,2})\/(\d{1,2})/, (match, year, month, day) => {
    return year + '-' + (month.length === 1 ? '0' + month : month) + '-' + (day.length === 1 ? '0' + day : day);
  });
  barrageForm.value.time = formattedDate
  console.log(barrageForm.value)
  await sendBarrageService(barrageForm.value)
  ElMessage.success('已发送弹幕')
}
const getBarrageList = async () => {
  if (EpisodeId.value === null) {
    ElMessage.warning('请先选择一个剧集')
    return
  }
  const res = await getBarrageService(EpisodeId.value)
  barrageList.value = res.data
  ElMessage.success('获取弹幕成功')
}
const onLike = async () => {
  await likeService(userStore.user.id, AnimeId.value)
  ElMessage.success('点赞成功')
}
const onCollect = async () => {
  await collectService(userStore.user.id, AnimeId.value)
  ElMessage.success('收藏成功')
}
const confirmDialog = async () => {
  console.log(ranking.value * 2)
  await rankService(userStore.user.id, AnimeId.value, ranking.value * 2)
  centerDialogVisible.value = false
  ElMessage.success('打分成功')
}

</script>

<template>
  <page-container title="动漫剧集">
    <div class="common-layout">
        <div class="episode-main-left">
          <div class="display-barrage">{{barrageList[0].barrage}}</div>
          <div class="display-video">
              <VideoPlayer :src="videoSrc" :second="3" :width="800" :height="450" />
          </div>
      
          <div class="display-footer">
            <div>
              <el-form :model="barrageForm">
                <el-form-item>
                  <el-col :span="18">
                    <el-input placeholder="请输入你的弹幕吧" v-model="barrageForm.barrage"></el-input>
                  </el-col>
                  <el-col :span="4" :offset="2">
                    <el-button type="primary" round @click="onSendBarrage"><strong>发弹幕</strong></el-button>
                  </el-col>
                </el-form-item>
              </el-form>
            </div>
            <el-button type="warning" round @click="getBarrageList">查看弹幕</el-button>
          </div>

        </div>
        <div class="episode-main-right">
          <div class="episode-info-top"><strong>{{ animeInfo.name }}</strong></div>
          <div class="episode-info-main">
            <el-tabs type="border-card" style="height: 100%;">
              <el-tab-pane label="简介">
                <div class="info"><strong>简介: </strong>{{ animeInfo.info }}</div>
                <div class="time">
                  上映时间：{{ animeInfo.time }}
                </div>
                <div class="count">
                  <span class="like">
                    <el-icon color="skyBlue" @click="centerDialogVisible = true">
                      <StarFilled />
                    </el-icon>
                    评分：{{ animeInfo.ranking }}
                  </span>
                  <span class="like" style="position: relative; left: 25px">
                    <el-icon color="red" @click="onLike">
                      <Opportunity />
                    </el-icon>
                    点赞数：{{ animeInfo.likeCnt }}
                  </span>
                  <span class="like" style="position: relative; left: 50px">
                    <el-icon color="darkOrange" @click="onCollect">
                      <StarFilled />
                    </el-icon>
                    收藏数：{{ animeInfo.ccnt }}
                  </span>
                </div>
                <el-table :data="episodeList" style="width: 90%;height: 380px" row-style="background: skyblue"
                  @row-click="openEpisode">
                  <el-table-column prop="number" label="集数" width="100" />
                  <el-table-column prop="name" label="名字" width="180" />
                  <el-table-column prop="duration" label="时长" width="180" />
                  <el-table-column prop="barrages" label="弹幕数" />
               
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="最新评论">
                <el-form :model="commentForm">
                  <el-form-item>
                    <el-col :span="18">
                      <el-input placeholder="请输入你的评论吧" type="textarea" v-model="commentForm.content"></el-input>
                    </el-col>
                    <el-col :span="4" :offset="2">
                      <el-button type="warning" round @click="onSendComment"><strong>发布评论</strong></el-button>
                    </el-col>
                  </el-form-item>
                </el-form>
                <el-scrollbar height="500px">
                  <div v-for="c in commentList" :key="c" class="scrollbar-demo-item">
                    <el-descriptions class="margin-top" :column="2" :size="size" border>
                      <el-descriptions-item>

                        <template #label>
                          <div class="cell-item"><el-icon>
                              <User />
                            </el-icon>用户</div>
                        </template>
                        {{ c.userName }}
                      </el-descriptions-item>
                      <el-descriptions-item>

                        <template #label>
                          <div class="cell-item"><el-icon>
                              <Stopwatch />
                            </el-icon>时间</div>
                        </template>
                        {{ c.time }}
                      </el-descriptions-item>
                      <el-descriptions-item>

                        <template #label>
                          <div class="cell-item"><el-icon>
                              <List />
                            </el-icon>评论</div>
                        </template>
                        <div style="font-size: 18px;border: #22d5ce solid 2px; padding: 5px">
                          <strong>{{ c.content }}</strong>
                        </div>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>


                </el-scrollbar>
              </el-tab-pane>
            </el-tabs>

          </div>
        </div>
      
    </div>
    <el-dialog v-model="centerDialogVisible" title="评分" width="30%" center>
      <div class="demo-rate-block">
        <el-rate v-model="ranking" />
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDialog">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </page-container>
</template>

<style scoped lang="scss">
.common-layout {
  height: 78vh;
  width: 100vw;
  display: flex;
  flex-direction: row;

  .dialog-footer button:first-child {
    margin-right: 10px;

  }

  .episode-main-left {
    width: 70%;
    border: pink solid 2px;
    left: 2px;
    background-color: grey;
    font-size: 40px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .display-barrage {
      height: 5%;
      border: #b88230 solid 1px;
      color: orangered;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #1D1D1D;
    }
    .display-video {
      height: 94%;
      min-width: 800px;
      border: #b88230 solid 1px;
      background-color: black;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .display-footer {
      height: 6%;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      padding-top: 10px;
      background-color: #1D1D1D;
    }
  }

  .episode-main-right {
    width: 30%;


    .episode-info-top {
      height: 5%;
      border: #b88230 solid 1px;
      color: orangered;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .episode-info-main {
      height: 95%;
      .info {
        margin: 0 6px 10px 5px;
        height: 15vh;
        overflow-y: scroll;
      
        strong {
          font-weight: bold;
        }
      }
    
      .time {
        color: #999;
      }
    
      .count {
        margin-top: 20px;
        .like {
          display: inline-block;
          margin-right: 20px;
          position: relative;
          left: 0;
          el-icon {
            margin-right: 5px;
          }
        }
      }
    
      .el-table {
        margin: 20px 6px 0 0;
        border: skyblue 2px solid;
        height: 70vh; // 将高度设置为100%
    
        .el-table-column {
          &.is-bordered {
            border: 1px solid #ccc;
          }
        }
    
        .el-table__body-wrapper {
          .el-table__row {
            &:hover {
              background-color: #f5f5f5;
            }
          }
        }
      }
    
      .el-form {
        margin-top: 20px;
        height: 100%; // 将高度设置为100%
    
        .el-form-item {
          .el-input {
            width: 100%;
          }
    
          .el-button {
            margin-left: 10px;
          }
        }
      }
    
      .el-scrollbar {
        margin-top: 20px;
        height: 100%; // 将高度设置为100%
    
        .scrollbar-demo-item {
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ccc;
    
          .cell-item {
            el-icon {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }





}
</style>
