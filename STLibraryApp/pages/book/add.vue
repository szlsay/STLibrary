<template>
	<view class="page">
		<uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="isbn" label="ISBN">
				<uni-easyinput placeholder="请输入ISBN" v-model="formData.isbn"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="bookName" label="书名">
				<uni-easyinput placeholder="请输入书名" v-model="formData.bookName"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="images" label="图片">
				<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp,jpeg" return-type="array"
					v-model="formData.images"></uni-file-picker>
			</uni-forms-item>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" @click="submit">提交</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '@/js_sdk/validator/st-book.js';

	const db = uniCloud.database();
	const dbCollectionName = 'st-book';

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.indexOf(key) > -1) {
				result[key] = validator[key]
			}
		}
		return result
	}

	export default {
		data() {
			let formData = {
				"isisbn": null,
				"images": [],
				"bookName": "",
			}
			return {
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.validate().then((res) => {
					return this.submitForm(res)
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},
			submitForm(value) {
				return db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						icon: 'none',
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
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
		display: flex;
	}

	.page {
		padding: 16rpx;
	}

	::v-deep .is-disabled {
		color: black !important;
	}

	.uni-forms-item {
		margin-bottom: 8px;
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