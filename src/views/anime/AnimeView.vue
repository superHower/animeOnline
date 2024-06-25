<script setup>
import { Edit, Opportunity, Search, StarFilled,CirclePlusFilled, List } from '@element-plus/icons-vue'
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
const defaultParams = {
  nation: '',
  time: ''
}
const params = ref({...defaultParams})

onMounted(() => {
  getAnimeList()
})

const getAnimeList = async () => {
  loading.value = true
  const res = await getAnimeListService()
  animeList.value = res.data

  animeList.value.forEach((anime) => {
    if (!nationList.value.includes(anime.nation)) {
      nationList.value.push(anime.nation)
    }
  })

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
  const res = await searchAnimeNameService(input)
  animeList.value = res.data
}

const onSearchByCondition = async () => {
  await searchAnimeConditionService(params.value.nation, params.value.time).then(res => {
    animeList.value = res.data
  })
}
const onReset = async() => {
  params.value = {...defaultParams}
  await searchAnimeConditionService(params.value.nation, params.value.time).then(res => {
    animeList.value = res.data
  })

}

</script>

<template>
  <page-container title="动漫首页">
    <template #prefix>
      <!--    搜索表单  -->
      <el-form :model="formSearch" style="margin-top: 20px">
        <el-form-item>
          <span>
            <el-input v-model="formSearch.name" clearable  placeholder="请输入动漫名字" class="search-input">
              <template #append>
                <el-button :icon="Search" @click="onSearchByName" />
              </template>
            </el-input>
          </span>
        </el-form-item>
      </el-form>
    </template>

    <template #extra>
      <div class="addAnime">
        <el-button plain type="danger" class="btn-top" @click="onFavorite()">❤ <span>我的喜欢</span></el-button>
        <el-button plain type="warning" class="btn-top" :icon="StarFilled" @click="onCollection()"><span>我的收藏</span></el-button>
        <el-button plain type="primary" class="btn-top" :icon="List" @click="getAnimeList()"><span>全部动漫</span></el-button>
        <el-button plain type="success" class="btn-top vip-btn" :icon="CirclePlusFilled" @click="onAddAnime()"><span>增加动漫</span></el-button>
      </div>
    </template>

    <!--    条件查询表单  -->
    <el-form :model="params" class="confForm">
      <el-form-item>
        <div class="conf-label">地区：</div>
        <el-radio-group class="big-width" v-model="params.nation">
          <el-radio-button v-for="n in nationList" :key="n" :label="n">{{ n }}</el-radio-button>
        </el-radio-group>
        <el-select class="small-width" style="width: 195px" v-model="params.nation" placeholder="请选择">
          <el-option v-for="n in nationList" :key="n" :label="n" :value="n"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="conf-label">上映时间：</div>
        <el-radio-group class="big-width" v-model="params.time ">
          <el-radio-button v-for="t in timeList" :key="t" :label="t">{{ t }}</el-radio-button>
        </el-radio-group>
        <el-select class="small-width" style="width: 195px" v-model="params.time" placeholder="请选择">
          <el-option v-for="n in timeList" :key="n" :label="n" :value="n"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearchByCondition" style="margin-left: 10px">条件搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--    轮播图  -->
    <el-carousel :interval="4000" type="card" height="250px">
      <el-carousel-item><img src="@/assets/image/w-1.png" class="image" alt="" /></el-carousel-item>
      <el-carousel-item><img src="@/assets/image/w-2.png" class="image" alt="" /></el-carousel-item>
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
              <span class="time vip-btn">时间：{{ anime.time.substring(0, 10) }}</span>
              <span class="time">{{ anime.nation }}</span>
            </div>
            <div class="card-middle">
              <div class="info">
                {{ anime.info.length > 40 ? anime.info.substring(0, 40) + '...' : anime.info }}
              </div>
              <div class="card-option">
                <el-button plain type="warning" size="small" class="vip-btn" :icon="Edit" @click="onEditAnime(anime.id)">编辑动漫</el-button>
                <el-button plain type="danger" size="small" class="vip-btn" :icon="Edit" style="margin-left: 0" @click="onDeleteArticle(anime.id)">删除动漫</el-button>
              </div>
            </div>
            <div class="card-bottom">
              <el-row>
                <el-col :span="12"> <el-icon class="vip-btn" color="skyBlue"><StarFilled /> </el-icon><span class="vip-icon">总评分：{{ anime.ranking }}</span>  </el-col>
                <el-col :span="12"> <el-icon class="vip-btn" color="red"> <Opportunity /> </el-icon><span class="vip-icon">点赞数：{{ anime.likeCnt }}</span>  </el-col>
              </el-row>

              <el-row>
                <el-col :span="12"> <el-icon class="vip-btn" color="darkOrange"> <StarFilled /> </el-icon><span class="vip-icon">收藏数：{{ anime.cCnt }}</span></el-col>
                <el-col :span="12"> <el-icon class="vip-btn" color="darkOrange">  <StarFilled /> </el-icon><span class="vip-icon">总集数：{{ anime.count }}</span></el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <anime-drawer ref="animeEditRef" @update-list="getAnimeList"></anime-drawer>
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
   display: flex;
  .el-form-item {
    margin: 10px 0;

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

.el-form-item__content {
  justify-content: flex-start;
}

.el-carousel {
  position: relative;
  margin: 5px;
  width: 100%;

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
.search-input {
  width: 100%;
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

@media (max-width: 1200px) {
  .confForm {
    flex-direction: column;
  }
  .conf-label {
    margin-left: 20px !important;
  }

}
@media (max-width: 1480px) {
  .conf-label {
    margin-left: 20px !important;
  }

}
@media (max-width: 1000px) {
  .el-button span {
    display: none;
  }
  .btn-top {
    border-radius: 50%;
  }

}
@media (max-width: 648px) {
  .search-input {
    width: 168px;
    margin-left: 20px;
  }
  .btn-top {
    width: 33px;
  }
  .vip-btn {
    display: none;
  }
  .vip-icon {
    font-size: 12px;
  }

  .small-width {
    display: block;
  }
  .big-width {
    display: none;
  }
}
@media (min-width: 648px) {
  .small-width {
    display: none;
  }
  .big-width {
    display: block;
  }
}
</style>
