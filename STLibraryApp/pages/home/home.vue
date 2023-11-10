<template>
	<view class="page-home">
		<view class="st-box" v-if="menusInput && menusInput.length > 0">
			<view class="title">
				数据导入
			</view>
			<view class="list">
				<view class="item" v-for="(item, index) in menusInput" :key="index" @click="onClickItem(item)">
					<image :src="item.img"></image>
					<text class="text">{{item.text}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		data() {
			return {
				menusInput: [{
					"img": "/static/home/book-add.png",
					"text": "添加书籍",
					"to": "/pages/book/addauto",
				}]
			}
		},
		methods: {
			onClickItem(item) {
				if (item.to) {
					uni.navigateTo({
						url: item.to
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-home {
		background-color: #00CC9933;
		padding: 32rpx;
		height: calc(100vh);
		overflow-y: auto;
	}

	.st-box {
		background-color: white;
		border-radius: 16rpx;
		margin-bottom: 32rpx;
		padding: 40rpx;

		.title {
			font-weight: 800;
			font-size: 36rpx;
		}

		.list {
			display: flex;
			flex-wrap: wrap;
			align-items: center;

			.item {
				padding-top: 32rpx;
				width: 25%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				image {
					width: 100rpx;
					height: 100rpx;
				}

				.text {
					padding-top: 16rpx;
					color: #333;
					font-size: 28rpx;
				}

			}
		}
	}
</style>