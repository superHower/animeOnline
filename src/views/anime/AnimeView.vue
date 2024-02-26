<script setup>
import {Edit, Opportunity, Search, StarFilled} from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import { getAnimeListService, getFavoriteAnimeService, getCollectionAnimeService,
  searchAnimeNameService, searchAnimeConditionService  } from '@/api/anime.js'
import {onMounted, ref} from 'vue'
import {useRouter} from "vue-router";
import { useUserStore } from '@/stores'
import AnimeDrawer from "@/components/AnimeDrawer.vue";

const userStore = useUserStore()
const router = useRouter()
const animeList = ref([])
const timeList = [
  '2020年之后',
  '2010年-2019年',
  '2000年-2009年',
  '2000年之前'
]
const nationList = ref([])
const iList = ref([
    "mzt",
    "guimie",
    '@/assets/image/douluo.png',
    '@/assets/image/Ameng.png',
    '@/assets/image/daojian.png',
    '@/assets/image/xiyy.png',
    '@/assets/image/cat.png'

])

const loading = ref(false)
const animeEditRef = ref()
const formSearch = ref({
  name:''
})

const params = ref({
  nation:'',
  time:''
})
const checkboxGroup1 = ref()
const checkboxGroup2 = ref()


onMounted(() => {
  getAnimeList()
})
const getAnimeList = async () => {
  loading.value = true
  const res = await getAnimeListService()
  animeList.value = res.data.data
  console.log(animeList.value)

  animeList.value.forEach((anime) => {
    anime.image = iList.value[anime.id-1]
    if (!nationList.value.includes(anime.nation)) {
      nationList.value.push(anime.nation);
    }
  });
  console.log("地区：" + nationList.value)
  console.log(animeList.value)
  loading.value = false
}

const onFavorite = async () => {
  loading.value = true
  console.log("我的喜欢")
  const res = await getFavoriteAnimeService(userStore.user.id)
  animeList.value = res.data.data
  console.log(animeList.value)

  loading.value = false
}
const onCollection = async  () => {
  loading.value = true
  const res = await getCollectionAnimeService(userStore.user.id)
  animeList.value = res.data.data
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
  console.log(res.data.data)
  animeList.value = res.data.data
  console.log(animeList.value)
}

const onSearchByCondition = async () => {
  params.value.nation = checkboxGroup1.value;
  params.value.time = checkboxGroup2.value;
  const res = await searchAnimeConditionService(params.value.nation, params.value.time)
  animeList.value = res.data.data
  console.log(animeList.value)
}


</script>

<template>
  <page-container title="动漫列表" >
    <template #extra>
          <span class="addAnime">
          <el-button plain type="danger"  @click="onFavorite()">❤ 我的喜欢</el-button>
          <el-button plain type="warning" :icon="Edit" @click="onCollection()">我的收藏</el-button>
          <el-button plain type="primary" :icon="Edit" @click="getAnimeList()">全部动漫</el-button>
          <el-button plain type="success" :icon="Edit" @click="onAddAnime()">增加动漫</el-button>
        </span>
    </template>
<!--    搜索表单  -->
    <el-form :model="formSearch" label-width="120px">
      <el-form-item>
        <span>
          <el-input v-model="formSearch.name" :prefix-icon="Search" placeholder="输入动漫名字" style="width: 500px"/>
          </span>
        <el-button type="primary" @click="onSearchByName" style="margin-left: 30px">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

<!--    条件查询表单  -->
    <el-form :model="params" label-width="120px" class="confForm">
      <el-form-item>
        地区：<el-radio-group v-model="checkboxGroup1" size="large">
        <el-radio-button v-for="n in nationList" :key="n" :label="n">{{ n }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        上映时间：<el-radio-group v-model="checkboxGroup2" size="large">
        <el-radio-button v-for="t in timeList" :key="t" :label="t">{{ t }}</el-radio-button>
      </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearchByCondition" style="margin-left: 30px">条件搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
<!--    轮播图  -->
    <el-carousel :interval="4000" type="card" height="300px" style="margin: 5px">
      <el-carousel-item ><img src="@/assets/image/将军.jpg" class="image" alt=""/></el-carousel-item>
      <el-carousel-item ><img src="@/assets/image/绫华.png" class="image" alt=""/></el-carousel-item>
      <el-carousel-item ><img src="@/assets/image/夜兰.png" class="image" alt=""/></el-carousel-item>
      <el-carousel-item ><img src="@/assets/image/妮露.png" class="image" alt=""/></el-carousel-item>
    </el-carousel>
<!-- 动漫卡片 -->
    <el-row>
      <el-col v-for="(anime, index) in animeList" :key="index" :span="5" :offset="1">
        <el-card :body-style="{ padding: '0px' }">
          <img src="@/assets/image/daojian.png" class="image" @click="openAnime(anime.id)" />

          <div style="padding: 14px">
            <span>{{anime.name}}</span>
            <div class="bottom">
              <div class="info">
                {{ anime.info.length>40 ? anime.info.substring(0, 40)+'...' : anime.info  }}
              </div>
              <el-button text class="button">Operating</el-button>
            </div>
            <div style="border: springgreen 2px solid;  border-radius: 5px;">
              <span class="like"><el-icon color="skyBlue"><StarFilled /></el-icon>评分：{{anime.ranking}}</span>
              <span class="like" style="position: relative; left: 25px"><el-icon color="red"><Opportunity /></el-icon>点赞数：{{anime.likeCnt}}</span>
              <br>
              <span class="like" style="position: relative;"><el-icon color="darkOrange"><StarFilled /></el-icon>收藏数：{{anime.ccnt}}</span>
              <span class="like" style="position: relative; left: 50px"><el-icon color="darkOrange"><StarFilled /></el-icon>总集数：{{anime.count}}</span>

            </div>
            <div class="time" style="margin: 10px">
              上映时间：{{anime.time}}
            </div>
            <el-button plain type="warning" :icon="Edit" @click="onEditAnime(anime.id)">编辑动漫</el-button>
            <el-button plain type="danger" :icon="Edit" @click="onDeleteArticle(anime.id)">删除动漫</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

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

.confForm{
  border: solid 3px green;
}

// 轮播图
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
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

// 动漫描述卡片
.info {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer; /* 更改鼠标图标为指针 */
}
.like {
  //border:

  padding: 3px;
}

</style>
