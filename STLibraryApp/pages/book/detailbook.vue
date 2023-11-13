<template>
	<view class="container">
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options"
			:collection="collectionList" field="images,bookName,isbn" :where="queryWhere" :getone="true" :manual="true">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading">
				<uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
			</view>
			<view v-else-if="data">
				<image v-for="(img, index) in data.images" :key="index" :src="img.url" mode="aspectFill"
					@tap.native.stop="onClickPreview(img.url)"></image>
				<view class="book-name">{{data.bookName}}</view>
				<view class="book-box">
					<text class="title">ISBN：</text>
					<text class="content">{{data.isbn}}</text>
				</view>
				<view class="btns">
					<button type="primary" @click="handleUpdate">修改</button>
					<button type="warn" class="btn-delete" @click="handleDelete">删除</button>
				</view>
			</view>
		</unicloud-db>
	</view>
</template>

<script>
	import {
		enumConverter
	} from '@/js_sdk/validator/st-book.js'
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
			onClickPreview(url) {
				event.preventDefault()
				uni.previewImage({
					urls: [url],
					current: 0
				});
			},
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

<style lang="scss" scoped>
  .btns {
    margin-top: 40px;
    display: flex;
    flex-direction: row;
  }

  .btns button {
    flex: 1;
  }

  .btn-delete {
    margin-left: 10px;
  }

	.container {
		padding: 32rpx;
	}

	image {
		width: 100%;
		border-radius: 16rpx;
	}

	.book-name {
		font-size: 36rpx;
		color: #333;
		font-weight: 700;
	}

	.book-author {
		margin-top: 16rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: 400;
	}

	.book-desc {
		margin-top: 16rpx;
		font-size: 30rpx;
		color: #666;
		font-weight: 400;
		line-height: 1.6;
	}

	.book-box {
		display: flex;
		margin-top: 16rpx;

		.title {
			font-size: 32rpx;
			color: #333;
			font-weight: 700;
		}

		.content {
			font-size: 32rpx;
			color: #666;
			font-weight: 500;
		}
	}
</style>