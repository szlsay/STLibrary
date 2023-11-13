<template>
	<view class="page">
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList"
			field="isisbn,images,bookName,pictures">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<uni-list>
					<uni-list-item v-for="(item, index) in data" :key="index" showArrow :clickable="true"
						@click="handleItemClick(item)">
						<template v-slot:body>
							<view>
								<view class="book-box" v-if="item.isisbn">
									<image v-for="(url, index) in item.pictures" :key="index" :src="url" mode="aspectFill"
										@tap.native.stop="onClickPreview(url)"></image>
									<text>{{item.bookName}}</text>
								</view>
								<view class="book-box" v-else>
									<image v-for="(img, index) in item.images" :key="index" :src="img.url" mode="aspectFill"
										@tap.native.stop="onClickPreview(img.url)"></image>
									<text>{{item.bookName}}</text>
								</view>
							</view>
						</template>
					</uni-list-item>
				</uni-list>
			</view>
			<uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
		</unicloud-db>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				collectionList: "st-book",
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
		},
		onPullDownRefresh() {
			this.$refs.udb.loadData({
				clear: true
			}, () => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			this.$refs.udb.loadMore()
		},
		methods: {
			onClickPreview(url) {
				event.preventDefault()
				uni.previewImage({
					urls: [url],
					current: 0
				});
			},
			handleItemClick(item) {
				if (item.isisbn) {
					uni.navigateTo({
						url: './detail?id=' + item._id
					})
				} else {
					uni.navigateTo({
						url: './detailbook?id=' + item._id
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		width: 136rpx;
		height: 136rpx;
		border-radius: 8rpx;
		background-color: #00CC99;
		margin-right: 20rpx;
	}

	.book-box {
		width: 100%;
		display: flex;
	}

	.page {
		padding: 16rpx;
	}
</style>