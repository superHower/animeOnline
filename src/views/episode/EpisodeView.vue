<script setup>

import {List, User, Stopwatch , ArrowRight, VideoPlay ,
  VideoPause, ArrowLeft,
  Opportunity, StarFilled} from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import {getAnimeEpisodesService, sendBarrageService} from '@/api/episode.js'
import {getDetailAnimeService, getLatestComments,sendCommentService,
        likeService, collectService, rankService} from '@/api/anime.js'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores'


const userStore = useUserStore()
const centerDialogVisible = ref(false)
const AnimeId = ref(null);
const EpisodeId = ref(null);
const animeInfo = ref({});
const episodeList = ref([])
const commentList = ref([])
const episodeInfo = ref({})
const ranking = ref(null)
const loading = ref(false)
const commentForm = ref({
  comment:'',
  uid:'',
  aid:''
})
const barrageForm = ref({
  barrage:'',
  uid:'',
  eid:''
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
  episodeList.value = res.data.data
  console.log(episodeList.value)

  loading.value = false
}
const getAnimeInfo = async () => {
  loading.value = true

  const res1 = await getDetailAnimeService(AnimeId.value)
  animeInfo.value = res1.data.data
  console.log(animeInfo.value)

  loading.value = false
}
const getCommentList = async () => {
  loading.value = true

  const res = await getLatestComments(AnimeId.value)
  commentList.value = res.data.data
  console.log(commentList.value)

  loading.value = false
}

const openEpisode = (row) => {
  console.log(row)
  EpisodeId.value = row.id
  episodeInfo.value = row.name
}
const onSendComment = async () =>{
  commentForm.value.aid = AnimeId.value;
  commentForm.value.uid = userStore.user.id;
  await sendCommentService(commentForm.value)
  ElMessage.success('评论成功')
}
const onSendBarrage = async () =>{
  barrageForm.value.eid = EpisodeId.value;
  barrageForm.value.uid = userStore.user.id;
  console.log(barrageForm.value)
  await sendBarrageService(barrageForm.value)
  ElMessage.success('已发送弹幕')
}
const onLike = async () =>{
  await likeService(userStore.user.id, AnimeId.value)
  ElMessage.success('点赞成功')
}
const onCollect = async () =>{
  await collectService(userStore.user.id, AnimeId.value)
  ElMessage.success('收藏成功')
}
const confirmDialog = async () =>{
  console.log(ranking.value*2)
  await rankService(userStore.user.id, AnimeId.value, ranking.value*2)
  centerDialogVisible.value = false
  ElMessage.success('打分成功')
}

</script>

<template>
  <page-container title="动漫剧集">

    <div class="common-layout">
      <el-container>
        <el-aside>
          {{episodeInfo}}········· 即将播放
          <template>
            <div id="player">
              <template>
              </template>
            </div>
          </template>
          <el-footer>
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

            <el-icon><ArrowLeft /></el-icon>
            <el-icon><VideoPause /></el-icon>
            <el-icon><VideoPlay /></el-icon>
            <el-icon><ArrowRight /></el-icon>
            <el-button type="warning" round>查看弹幕</el-button>
          </el-footer>
        </el-aside>
        <el-container>
          <el-header><strong>{{ animeInfo.name }}</strong></el-header>
          <el-main>
            <el-tabs type="border-card" class="demo-tabs">
              <el-tab-pane label="简介">
                <div class="info"><strong>简介: </strong>{{animeInfo.info}}</div>
                <div class="time">
                  上映时间：{{animeInfo.time}}
                </div>
                <div class="count">
                  <span class="like">
                    <el-icon color="skyBlue"  @click="centerDialogVisible = true"><StarFilled /></el-icon>
                    评分：{{animeInfo.ranking}}
                  </span>
                  <span class="like" style="position: relative; left: 25px">
                    <el-icon color="red" @click="onLike"><Opportunity /></el-icon>
                    点赞数：{{animeInfo.likeCnt}}
                  </span>
                  <span class="like" style="position: relative; left: 50px">
                    <el-icon color="darkOrange" @click="onCollect"><StarFilled /></el-icon>
                    收藏数：{{animeInfo.ccnt}}
                  </span>
                </div>
                <el-table :data="episodeList" height="300" style="width: 100%" row-style="background: skyblue" @row-click="openEpisode">
                  <el-table-column prop="number" label="集数" width="100" />
                  <el-table-column prop="name" label="名字" width="180" />
                  <el-table-column prop="duration" label="时长" width="180" />
                  <el-table-column prop="barrages" label="弹幕数" />
                </el-table></el-tab-pane>
              <el-tab-pane label="最新评论">
                <el-form :model="commentForm">
                  <el-form-item>
                    <el-col :span="18">
                      <el-input placeholder="请输入你的评论吧" type="textarea" v-model="commentForm.comment"></el-input>
                    </el-col>
                    <el-col :span="4" :offset="2">
                      <el-button type="warning" round @click="onSendComment"><strong>发布评论</strong></el-button>
                    </el-col>
                  </el-form-item>
                </el-form>
                <el-scrollbar height="400px">
                  <div v-for="c in commentList" :key="c" class="scrollbar-demo-item">
                    <el-descriptions class="margin-top" :column="2" :size="size" border>
                      <el-descriptions-item>
                        <template #label>
                          <div class="cell-item"><el-icon><User /></el-icon>用户</div>
                        </template>
                        {{ c.userName }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template #label>
                          <div class="cell-item"><el-icon><Stopwatch /></el-icon>时间</div>
                        </template>
                        {{ c.time }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template #label>
                          <div class="cell-item"><el-icon><List /></el-icon>评论</div>
                        </template>
                        <div style="font-size: 18px;border: #22d5ce solid 2px; padding: 5px">
                          <strong>{{ c.comment }}</strong>
                        </div>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>


                </el-scrollbar>
              </el-tab-pane>
            </el-tabs>

          </el-main>
        </el-container>
      </el-container>
    </div>
    <el-dialog v-model="centerDialogVisible" title="评分" width="30%" center>
      <div class="demo-rate-block">
        <el-rate v-model="ranking"/>
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
  height: 68vh;
  border: #b88230 solid 3px;
  .dialog-footer button:first-child {
    margin-right: 10px;
    .demo-rate-block{

    }
  }
  .el-aside {
    width: 900px;
    border: pink solid 2px;
    left: 2px;
    background-color: grey;
    font-size: 40px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .el-footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-top: 10px;
      //border: yellowgreen 3px solid;
      background-color: #1D1D1D;
    }
  }
  .el-header {
    border: #b88230 solid 3px;
    color: orangered;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-main {
    border: #b88230 solid 3px;
    height: 62vh;

    .info {
      border: deeppink solid 2px;
      padding: 10px;
    }

    .time {
      border: deeppink solid 2px;
      padding: 10px;
    }
    .count {
      position: relative;
      bottom: 3px;
      border: deeppink solid 2px;
      padding: 10px;
      font-size: 20px;
    }
    .el-table {
      border: 3px solid deepskyblue;
    }
    .scrollbar-demo-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      margin: 10px;
      text-align: center;
      border-radius: 4px;
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      .el-descriptions {
        width: 500px;
      }
    }
  }
}

</style>
