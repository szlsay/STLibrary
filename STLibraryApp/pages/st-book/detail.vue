<template>
  <view class="container">
    <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options" :collection="collectionList" field="isisbn,images,author,bookDesc,bookName,clcCode,clcName,isbn,pictures,press,pressDate,pressPlace" :where="queryWhere" :getone="true" :manual="true">
      <view v-if="error">{{error.message}}</view>
      <view v-else-if="loading">
        <uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
      </view>
      <view v-else-if="data">
        <view>
          <text>是否通过isbn方式</text>
          <text>{{data.isisbn == true ? '✅' : '❌'}}</text>
        </view>
        <view>
          <text>图片</text>
          <template v-for="(file, j) in data.images">
            <uni-file-picker v-if="file.fileType == 'image'" :value="file" :file-mediatype="file.fileType" return-type="object" readonly></uni-file-picker>
            <uni-link v-else :href="file.url" :text="file.url"></uni-link>
          </template>
        </view>
        <view>
          <text>作者</text>
          <text>{{data.author}}</text>
        </view>
        <view>
          <text>内容介绍</text>
          <text>{{data.bookDesc}}</text>
        </view>
        <view>
          <text>书名</text>
          <text>{{data.bookName}}</text>
        </view>
        <view>
          <text>类型编码</text>
          <text>{{data.clcCode}}</text>
        </view>
        <view>
          <text>类型名称</text>
          <text>{{data.clcName}}</text>
        </view>
        <view>
          <text>ISBN</text>
          <text>{{data.isbn}}</text>
        </view>
        <view>
          <text>图片</text>
          <text>{{data.pictures}}</text>
        </view>
        <view>
          <text>出版社</text>
          <text>{{data.press}}</text>
        </view>
        <view>
          <text>出版时间</text>
          <text>{{data.pressDate}}</text>
        </view>
        <view>
          <text>出版地址</text>
          <text>{{data.pressPlace}}</text>
        </view>
      </view>
    </unicloud-db>
    <view class="btns">
      <button type="primary" @click="handleUpdate">修改</button>
      <button type="warn" class="btn-delete" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script>
  // 由schema2code生成，包含校验规则和enum静态数据
  import { enumConverter } from '@/js_sdk/validator/st-book.js'
  const db = uniCloud.database()

  export default {
    data() {
      return {
        queryWhere: '',
        collectionList: "st-book",
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        },
        options: {
          // 将scheme enum 属性静态数据中的value转成text
          ...enumConverter
        }
      }
    },
    onLoad(e) {
      this._id = e.id
    },
    onReady() {
      if (this._id) {
        this.queryWhere = '_id=="' + this._id + '"'
      }
    },
    methods: {
      handleUpdate() {
        // 打开修改页面
        uni.navigateTo({
          url: './edit?id=' + this._id,
          events: {
            // 监听修改页面成功修改数据后, 刷新当前页面数据
            refreshData: () => {
              this.$refs.udb.loadData({
                clear: true
              })
            }
          }
        })
      },
      handleDelete() {
        this.$refs.udb.remove(this._id, {
          success: (res) => {
            // 删除数据成功后跳转到list页面
            uni.navigateTo({
              url: './list'
            })
          }
        })
      }
    }
  }
</script>

<style>
  .container {
    padding: 10px;
  }

  .btns {
    margin-top: 10px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
  }

  .btns button {
    flex: 1;
  }

  .btn-delete {
    margin-left: 10px;
  }
</style>
