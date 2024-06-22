<script setup>

import { List, User, Stopwatch, Opportunity, StarFilled } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import { getAnimeEpisodesService, sendBarrageService, getBarrageService } from '@/api/episode.js'
import {
  getDetailAnimeService, getLatestComments, sendCommentService,
  likeService, collectService, rankService, getUaInfoService
} from '@/api/anime.js'
import { ref } from 'vue'
import { onMounted, onUnmounted, watch } from 'vue'
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
const isInfo = ref(true)

const ranking = ref(null)
const loading = ref(false)

const display = ref(null); // 绑定视频div
const videoWidth = ref(0);
const videoHeight = ref(0);
const tableHeight = ref(0)

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
  getDimensions();
  // 如果需要，可以设置一个 ResizeObserver 来监听尺寸变化
  const resizeObserver = new ResizeObserver(() => {
    getDimensions();
  });
  resizeObserver.observe(display.value);

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

const getDimensions = () => {
  if (display.value) {
    videoWidth.value = display.value.offsetWidth;
    videoHeight.value = display.value.offsetHeight;
    tableHeight.value = videoHeight.value - 110;
  }
};
const handleChangeTab = (val) => {
  isInfo.value = val
}
</script>

<template>
  <page-container title="动漫剧集">
    <div class="common-layout">
        <div class="episode-main-left">
          <div class="display-barrage">{{ animeInfo.name }}</div>
          <div class="display-barrage real">{{barrageList[0].barrage}}</div>
          <div class="display-video" ref="display">
            <VideoPlayer :src="videoSrc" :second="3" :width="videoWidth" :height="videoHeight" />
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
            <div class="tabs-head">
              <el-button @click="handleChangeTab(true)">简介</el-button>
              <el-button @click="handleChangeTab(false)">评论</el-button>
            </div>

            <div class="tab-box" v-show="isInfo" label="简介">
              <div>
                <div class="info"><strong>简介: </strong>{{ animeInfo.info }}</div>
                <div class="time"> 上映时间：{{ animeInfo.time }}</div>
                <div class="count">
                  <span class="like">
                    <el-icon color="skyBlue" @click="centerDialogVisible = true"> <StarFilled /></el-icon> 评分：{{ animeInfo.ranking }}
                  </span>
                  <span class="like" style="position: relative; left: 25px">
                    <el-icon color="red" @click="onLike"><Opportunity /> </el-icon> 点赞数：{{ animeInfo.likeCnt }}
                  </span>
                  <span class="like" style="position: relative; left: 50px">
                    <el-icon color="darkOrange" @click="onCollect"><StarFilled /></el-icon>收藏数：{{ animeInfo.ccnt }}
                  </span>
                </div>
              </div>


              <el-table :data="episodeList" :height="tableHeight" @row-click="openEpisode">
                <el-table-column prop="number" label="集数" width="80" />
                <el-table-column prop="name" label="名字" width="200" />
                <el-table-column prop="duration" label="时长" width="80" />
                <el-table-column prop="barrages" label="弹幕数" />
             
              </el-table>

            </div >
            <div class="tab-box" v-show="!isInfo" label="最新评论">
              <el-form class="comment-form" :model="commentForm">
                <el-form-item>
                  <div class="comment-box">
                    <el-input placeholder="请输入你的评论吧" type="textarea" v-model="commentForm.content"></el-input>
                    <el-button type="primary" round @click="onSendComment">发布评论</el-button>
                  </div>
                </el-form-item>
              </el-form>
              <div class="comment-detail">
                <div v-for="c in commentList" :key="c" class="comment-detail-box">
                  <el-descriptions class="margin-top" :column="2" :size="size" border>
                    <el-descriptions-item>
                      <template #label><div class="cell-item"><el-icon> <User /></el-icon>用户</div> </template>
                      {{ c.userName }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label> <div class="cell-item"><el-icon><Stopwatch /></el-icon>时间</div></template>
                      {{ c.time }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label><div class="cell-item"><el-icon><List /></el-icon>评论</div></template>
                      <div style="font-size: 18px;border: #22d5ce solid 2px; padding: 5px">
                        <strong>{{ c.content }}</strong>
                      </div>
                    </el-descriptions-item>
                  </el-descriptions>
                </div>


              </div>
            </div >





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
  height: calc(100vh - 140px);

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  .dialog-footer button:first-child {
    margin-right: 10px;

  }

  .episode-main-left {
    width: 50%;
    left: 2px;
    background-color: rgb(255, 255, 255);
    font-size: 40px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .display-barrage {
      height: 40px;
      width: 100%;
      margin: 0 auto;
      color: rgb(0, 0, 0);
      font-size: 24px;

    }
    .real {
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      color: orangered;
    }
    .display-video {
      position: relative;
      top: -40px;
      height: 74.5%;
      width: 100%;
      margin: 0 auto;
      background-color: rgb(255, 255, 255);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 8px var(--bpx-box-shadow, #e5e9ef);
    }

    .display-footer {
      position: relative;
      top: -40px;
      height: 40px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      padding-top: 10px;
      background-color: #565656;
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
      .tabs-head {
        height: 30px;
        position: relative;
        top: 5px;
      }
      .tab-box {
        height: calc(100% - 40px);
      }

      .info {
        height: 100px;
        margin-top: 10px;
        overflow-y: scroll;
      
        strong {
          font-weight: bold;
        }
      }
    
      .time {
        margin-top: 10px;
        color: #999;
      }
    
      .count {
        margin-top: 10px;
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
        margin-top: 10px;
        border: skyblue 2px solid;
        border-radius: 10px;
    
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
    
      .comment-form {
        margin-top: 10px;
        height: 50px;
        .comment-box{
          display: flex;
          width: 100%;
          justify-content: space-around;
          flex-direction: column;
          .el-button {
            width: 100px;
            position: relative;
            left: calc(100% - 100px);
            top: 5px;
          }


        }
      }
    
      .comment-detail {
        margin: 45px 0 0px;
        height: calc(100% - 105px);
        overflow-y: auto;
        .comment-detail-box {
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
