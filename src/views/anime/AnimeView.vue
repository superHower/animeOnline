<script setup>
import { Edit, Opportunity, Search, StarFilled } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import {
  getAnimeListService,
  getFavoriteAnimeService,
  getCollectionAnimeService,
  searchAnimeNameService,
  searchAnimeConditionService
} from '@/api/anime.js'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import AnimeDrawer from '@/components/AnimeDrawer.vue'

const userStore = useUserStore()
const router = useRouter()

const animeList = ref([])
const timeList = ['2020年之后', '2010年-2019年', '2000年-2009年', '2000年之前']
const nationList = ref([])
const defaultImage = "https://www-static.qbox.me/_next/static/media/bg1.6953c5d29b0c59aa80e41e27023e44c5.png"

const loading = ref(false)
const animeEditRef = ref()
const formSearch = ref({
  name: ''
})

const params = ref({
  nation: '',
  time: ''
})
const checkboxGroup1 = ref()
const checkboxGroup2 = ref()

onMounted(() => {
  getAnimeList()
})
const getAnimeList = async () => {
  loading.value = true
  const res = await getAnimeListService()
  animeList.value = res.data
  console.log(animeList.value)

  animeList.value.forEach((anime) => {
    if (!nationList.value.includes(anime.nation)) {
      nationList.value.push(anime.nation)
    }
  })
  console.log('地区：' + nationList.value)
  console.log(animeList.value)
  loading.value = false
}

const onFavorite = async () => {
  loading.value = true
  console.log('我的喜欢')
  const res = await getFavoriteAnimeService(userStore.user.id)
  animeList.value = res.data
  console.log(animeList.value)

  loading.value = false
}
const onCollection = async () => {
  loading.value = true
  const res = await getCollectionAnimeService(userStore.user.id)
  animeList.value = res.data
  console.log(animeList.value)
  loading.value = false
}

const onAddAnime = () => {
  animeEditRef.value.open()
}
const onEditAnime = (row) => {
  animeEditRef.value.open(row)
}
const openAnime = (id) => {
  router.push(`/episode/view?id=${id}`)
}
const onSearchByName = async () => {
  const input = formSearch.value.name
  console.log(input)
  const res = await searchAnimeNameService(input)
  console.log(res.data)
  animeList.value = res.data
  console.log(animeList.value)
}

const onSearchByCondition = async () => {
  params.value.nation = checkboxGroup1.value
  params.value.time = checkboxGroup2.value
  const res = await searchAnimeConditionService(params.value.nation, params.value.time)
  animeList.value = res.data
  console.log(animeList.value)
}
</script>

<template>
  <page-container title="动漫首页">
    <template #prefix>
      <!--    搜索表单  -->
      <el-form :model="formSearch" style="margin-top: 20px">
        <el-form-item>
          <span>
            <el-input v-model="formSearch.name" :prefix-icon="Search" placeholder="输入动漫名字" style="width: 200px" />
          </span>
          <el-button type="primary" @click="onSearchByName" style="margin-left: 30px">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #extra>
      <div class="addAnime">
        <el-button plain type="danger" @click="onFavorite()">❤ 我的喜欢</el-button>
        <el-button plain type="warning" :icon="Edit" @click="onCollection()">我的收藏</el-button>
        <el-button plain type="primary" :icon="Edit" @click="getAnimeList()">全部动漫</el-button>
        <el-button plain type="success" :icon="Edit" @click="onAddAnime()">增加动漫</el-button>
      </div>
    </template>

    <!--    条件查询表单  -->
    <el-form :model="params" class="confForm">
      <el-form-item>
        <div class="conf-label">地区：</div>
        <el-radio-group v-model="checkboxGroup1">
          <el-radio-button v-for="n in nationList" :key="n" :label="n">{{ n }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="conf-label">上映时间：</div>
        <el-radio-group v-model="checkboxGroup2">
          <el-radio-button v-for="t in timeList" :key="t" :label="t">{{ t }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="conf-label">操作：</div>
        <el-button type="primary" @click="onSearchByCondition">条件搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--    轮播图  -->
    <el-carousel :interval="4000" type="card" height="150px">
      <el-carousel-item><img src="@/assets/image/w-1.png" class="image" alt="" /></el-carousel-item>
      <el-carousel-item><img src="@/assets/image/w-2.png" class="image" alt="" /></el-carousel-item>
      <el-carousel-item><img src="@/assets/image/w-3.png" class="image" alt="" /></el-carousel-item>
      <el-carousel-item><img src="@/assets/image/w-3.png" class="image" alt="" /></el-carousel-item>
    </el-carousel>
    <!-- 动漫卡片 -->
    <div class="grid-container">
      <div v-for="(anime, index) in animeList" :key="index" class="grid-item">
        <el-card :body-style="{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }" class="anime-card">
          <div>
            <img :src="anime.imgUrl || defaultImage" class="image" @click="openAnime(anime.id)" />
          </div>
          <div style="padding: 14px">
            <div class="card-top">
              <span>{{ anime.name }}</span>
              <span class="time">上映时间：{{ anime.time.substring(0, 10) }}</span>
            </div>
            <div class="card-middle">
              <div class="info">
                {{ anime.info.length > 40 ? anime.info.substring(0, 40) + '...' : anime.info }}
              </div>
              <div class="card-option">
                <el-button plain type="warning" size="small" :icon="Edit"
                  @click="onEditAnime(anime.id)">编辑动漫</el-button>
                <el-button plain type="danger" size="small" :icon="Edit" style="margin-left: 0"
                  @click="onDeleteArticle(anime.id)">删除动漫</el-button>
              </div>
            </div>
            <div class="card-bottom">
              <el-row>
                <el-col :span="12"> <el-icon color="skyBlue"><StarFilled /> </el-icon>评分：{{ anime.ranking }}  </el-col>
                <el-col :span="12"> <el-icon color="red"> <Opportunity /> </el-icon>点赞数：{{ anime.likeCnt }}  </el-col>
              </el-row>

              <el-row>
                <el-col :span="12"> <el-icon color="darkOrange"> <StarFilled /> </el-icon>收藏数：{{ anime.ccnt }}</el-col>
                <el-col :span="12"> <el-icon color="darkOrange">  <StarFilled /> </el-icon>总集数：{{ anime.count }}</el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <anime-drawer ref="animeEditRef"></anime-drawer>
  </page-container>
</template>

<style scoped lang="scss">
.demo-button-style {
  margin-top: 24px;
}

.addAnime {
  padding: 5px;
}

.confForm {
  .el-form-item {
    margin-bottom: 8px;
    padding-bottom: 3px;

    .conf-label {
      font-weight: bold;
      margin-left: 120px;
      width: 80px;
    }
  }
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  /* 更改鼠标图标为指针 */
}



.el-carousel {
  position: relative;
  left: 10%;
  margin: 5px;
  width: 80%;

  // 轮播图
  .el-carousel__item h3 {
    color: #475669;
    opacity: 0.85;
    line-height: 200px;
    margin: 0;
    text-align: center;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .time {
    font-size: 11px;
    top: 4px;
    border-radius: 17px;
    padding: 0 8px;
    background-color: #fae5fa;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 定义4列，每列的宽度平均分配 */
  gap: 10px; /* 网格项之间的间隔 */

  .grid-item {
    .anime-card {
      height: 100%;
      .card-middle {
        margin-top: 13px;
        line-height: 12px;
      
        display: flex;
        justify-content: space-between;
        align-items: center;
      
        // 动漫描述卡片
        .info {
          font-size: 12px;
          color: #999;
        }
      
        .card-option {
          display: flex;
          flex-direction: column;
          width: 80px;
        }
      }
      
      .card-bottom {
        margin-top: 8px;
        width: 100%;
        line-height: 12px;
      }
    }

 
  }
}
@media screen and (max-width: 1405px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (max-width: 1140px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media screen and (max-width: 885px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
