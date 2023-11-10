<template>
	<view class="page">
		<view class="page-input">
			<view class="input-code">
				<uni-easyinput placeholder="请输入13位的ISBN~" maxlength="13" v-model="isbn" trim="both"></uni-easyinput>
				<button type="primary" @click="search" style="width: 20%;">查询</button>
			</view>

		</view>
		<view class="page-result" v-if="result">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isbn: '9787557010539',
				result: null,
			}
		},
		methods: {
			search() {
				if (this.isbn && this.isbn.length === 13) {
					
				} else {
					uni.showToast({
						title: '请输入13位的ISBN~',
						icon: 'none'
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .uni-modal__textarea {
		font-size: 36rpx;
	}

	.page {
		padding: 40rpx;
	}

	.input-code {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;

		uni-button {
			height: 72rpx;
			margin-left: 16rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #00cc99;
		}
	}
</style>