<template>
	<view class="container">
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options"
			:collection="collectionList" field="author,bookDesc,bookName,isbn,pictures,press,pressDate" :where="queryWhere"
			:getone="true" :manual="true">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading">
				<uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
			</view>
			<view v-else-if="data">
				<image v-for="(url, index) in data.pictures" :key="index" :src="url" mode="aspectFill"
					@tap.native.stop="onClickPreview(url)"></image>
				<view class="book-name">{{data.bookName}}</view>
				<view class="book-author">{{data.author}}</view>
				<view class="book-desc">{{data.bookDesc}}</view>
				<view class="book-box">
					<text class="title">ISBN：</text>
					<text class="content">{{data.isbn}}</text>
				</view>
				<view class="book-box">
					<text class="title">出版社：</text>
					<text class="content">{{data.press}}</text>
				</view>
				<view class="book-box">
					<text class="title">出版时间：</text>
					<text class="content">{{data.pressDate}}</text>
				</view>
				<button type="warn" class="btn-delete" @click="handleDelete">删除</button>
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
			handleDelete() {
				this.$refs.udb.remove(this._id, {
					success: (res) => {
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
	
	.btn-delete{
		margin-top: 40rpx;
		width: 50%;
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