<template>
  <el-image fit="cover" style="width: 100%; height: 150px;" :src="headerImage"/>
  <el-container>
    <!-- 搜索框及筛选条件 -->
    <el-header>
      <el-row class="query_input_row">
        <el-col :span="18" :offset="3">
          <el-input v-model="query" type="text" placeholder="请输入query" @keyup.enter="retrieve">
            <template #append>
              <el-button type="primary" @click="retrieve">查詢</el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="3" class="query_filter_item_columns">
          <el-radio-group v-model="searchMode" class="query_filter_item" @change="onSearchModeChanged">
            <el-radio-button label="普通查询" value="0"></el-radio-button>
            <el-radio-button label="正则查询" value="1"></el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="translatorType" class="query_filter_item" @change="onTranslatorChanged">
            <el-radio-button label="MTI" value="mti"></el-radio-button>
            <el-radio-button label="PRO" value="pro"></el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="indexType" class="query_filter_item" @change="onIndexTypeChanged">
            <el-radio-button label="单语语料" value="english"></el-radio-button>
            <el-radio-button label="汉译英语料" value="c2e" v-show="translatorType==='mti'"></el-radio-button>
            <el-radio-button label="英译汉语料" value="e2c" v-show="translatorType==='mti'"></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
    </el-header>

    <!-- 列表 -->
    <el-main class="list_container">
      <el-row v-for="(corpus, index) in corporaList" :key="index">
        <el-col :span="englishListWidth(indexType)" :offset="1" class="ellipsis list_item">
          <el-button type="text" @click="showContext(corpus)" v-if="indexType === 'english'">
            <div v-html="corpus.context.currentSentence"></div>
          </el-button>
          <el-button type="text" @click="showContext(corpus)" v-if="indexType === 'c2e' || indexType === 'e2c'">
            <div v-html="corpus.context.currentSentence" v-if="indexType === 'e2c'"></div>
            <div v-html="corpus.context.currentChineseSentence" v-if="indexType === 'c2e'"></div>
          </el-button>
        </el-col>
        <el-col :span="10" :offset="1" v-if="indexType === 'c2e' || indexType === 'e2c'" class="ellipsis list_item">
          <el-button type="text" @click="showContext(corpus)">
            <div v-html="corpus.context.currentSentence" v-if="indexType === 'c2e'"></div>
            <div v-html="corpus.context.currentChineseSentence" v-if="indexType === 'e2c'"></div>
          </el-button>
        </el-col>
      </el-row>
      <el-row style="text-align: center">
        <el-col :span="24">
          <p v-if="searched && corporaList.length === 0" class="hint_message">没搜到符合条件的语料</p>
          <p v-if="!searched" class="hint_message">请搜索语料</p>
        </el-col>
      </el-row>
    </el-main>

    <!-- 详情弹出页 -->
    <el-drawer v-model="showingContext.isShowContext" size="90%">
      <el-row>
        <el-col :span="2" class="detail_label">文件名：</el-col>
        <el-col :span="20" class="detail_value">{{showingContext.filename}}</el-col>
      </el-row>
      <hr>
      <el-row>
        <el-col :span="2" class="detail_label">上句：</el-col>
        <el-col :span="englishDetailWidth(indexType)" class="detail_value">
          <div v-html="showingContext.precedingText" v-if="indexType !== 'c2e'"></div>
          <div v-html="showingContext.precedingChineseSentence" v-if="indexType === 'c2e'"></div>
        </el-col>
        <el-col :span="10" :offset="1" class="detail_value" v-if="indexType !== 'english'">
          <div v-html="showingContext.precedingChineseSentence" v-if="indexType !== 'c2e'"></div>
          <div v-html="showingContext.precedingText" v-if="indexType === 'c2e'"></div>
        </el-col>
      </el-row>
      <hr>
      <el-row>
        <el-col :span="2" class="detail_label">当前句：</el-col>
        <el-col :span="englishDetailWidth(indexType)" class="detail_value">
          <div v-html="showingContext.currentSentence" v-if="indexType !== 'c2e'"></div>
          <div v-html="showingContext.currentChineseSentence" v-if="indexType === 'c2e'"></div>
        </el-col>
        <el-col :span="10" :offset="1" class="detail_value" v-if="indexType !== 'english'">
          <div v-html="showingContext.currentChineseSentence" v-if="indexType !== 'c2e'"></div>
          <div v-html="showingContext.currentSentence" v-if="indexType === 'c2e'"></div>
        </el-col>
      </el-row>
      <hr>
      <el-row>
        <el-col :span="2" class="detail_label">下句：</el-col>
        <el-col :span="englishDetailWidth(indexType)" class="detail_value">
          <div v-html="showingContext.followingText" v-if="indexType !== 'c2e'"></div>
          <div v-html="showingContext.followingChineseSentence" v-if="indexType === 'c2e'"></div>
        </el-col>
        <el-col :span="10" :offset="1" class="detail_value" v-if="indexType !== 'english'">
          <div v-html="showingContext.followingChineseSentence" v-if="indexType !== 'c2e'"></div>
          <div v-html="showingContext.followingText" v-if="indexType === 'c2e'"></div>
        </el-col>
      </el-row>
    </el-drawer>
  </el-container>
</template>

<script>
  import corporaServer from '@/server/corpora'

  export default {
    components: {

    },
    data() {
      return {
        query: '',
        corporaList: [],
        showingContext: {
          isShowContext: false,
          filename: ''
        },
        searchMode: 0,
        translatorType: 'mti',
        indexType: 'english',
        searched: false,
        headerImage: require('@/assets/img/header-photo.jpg')
      }
    },
    methods: {
      retrieve() {
        let data = {
          query: this.query,
          searchMode: this.searchMode,
          translatorType: this.translatorType,
          indexType: this.indexType
        }
        corporaServer.retrieve(data)
            .then(res => {
              this.corporaList.length = 0
              res.data.data.forEach(corpus => {
                this.corporaList.push(corpus)
              })
            }).catch(() => {
              this.$message({
                type:'error',
                message:'获取文章列表失败'
              });
        })
        this.searched = true
      },
      onSearchModeChanged() {
        if (this.searchMode === '0') {
          this.query = ''
          this.searched = false
          this.corporaList.length = 0
        } else {
          this.retrieve()
        }
      },
      onTranslatorChanged() {
        this.indexType = 'english'
        this.corporaList.length = 0
        this.retrieve()
      },
      onIndexTypeChanged() {
        this.corporaList.length = 0
        this.retrieve()
      },
      englishListWidth(type) {
        if (type === 'english') {
          return 22
        }
        return 10
      },
      englishDetailWidth(type) {
        if (type === 'english') {
          return 20
        }
        return 10
      },
      showContext(corpus) {
        this.showingContext.filename = corpus.filename
        this.showingContext.precedingText = corpus.context.precedingText
        this.showingContext.precedingChineseSentence = corpus.context.precedingChineseSentence
        this.showingContext.currentSentence = corpus.context.currentSentence
        this.showingContext.currentChineseSentence = corpus.context.currentChineseSentence
        this.showingContext.followingText = corpus.context.followingText
        this.showingContext.followingChineseSentence = corpus.context.followingChineseSentence
        this.showingContext.detailContent = corpus.context.detailContent
        this.showingContext.isShowContext = true
      }
    }
  }
</script>

<style scoped>
.query_input_row {
  margin-bottom: 10px; /* 设置的间距值 */
}
.query_filter_item_columns {
  text-align: left;
  margin-bottom: 10px; /* 设置的间距值 */
}
.query_filter_item {
  margin-right: 10px;
}
.list_container {
  margin-top: 20px;
}
.ellipsis {
  overflow: hidden;          /* 确保内容超出元素时会被截断 */
  white-space: nowrap;       /* 保证内容在一行内显示，不换行 */
  text-overflow: ellipsis;   /* 使用省略号显示被截断的文本 */
  width: 100%;               /* 设置宽度为100%，确保应用于整个容器 */
}
.list_item {
  border: 1px solid #000;
}
.hint_message {
  color: grey;
}
.detail_label {
  text-align: right;
  line-height: 30px;
}
.detail_value {
  text-align: left;
  line-height: 30px;
}
</style>
