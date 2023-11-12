<template>
	<view class="page">
		<view class="page-input">
			<view class="input-code">
				<uni-easyinput placeholder="请输入13位的ISBN~" maxlength="13" v-model="isbn" trim="both"></uni-easyinput>
				<button type="primary" @click="search" style="width: 20%;">查询</button>
			</view>

		</view>
		<view class="page-result" v-if="formData">
			<uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
				<uni-forms-item name="isbn" label="ISBN">
					<uni-easyinput placeholder="请输入ISBN" v-model="formData.isbn" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="bookName" label="书名">
					<uni-easyinput placeholder="请输入书名" v-model="formData.bookName" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="author" label="作者">
					<uni-easyinput placeholder="请输入作者" v-model="formData.author" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="bookDesc" label="内容介绍">
					<uni-easyinput placeholder="请输入内容介绍" v-model="formData.bookDesc" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="clcCode" label="类型编码">
					<uni-easyinput placeholder="请输入类型编码" v-model="formData.clcCode" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="clcName" label="类型名称">
					<uni-easyinput placeholder="请输入类型名称" v-model="formData.clcName" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="language" label="语言">
					<uni-easyinput placeholder="请输入语言" v-model="formData.language" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="pages" label="页数">
					<uni-easyinput placeholder="请输入页数" v-model="formData.pages" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="pictures" label="图片">
					<uni-easyinput placeholder="请输入图片" v-model="formData.pictures" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="press" label="出版社">
					<uni-easyinput placeholder="请输入出版社" v-model="formData.press" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="pressDate" label="出版时间">
					<uni-easyinput placeholder="请输入出版时间" v-model="formData.pressDate" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="pressPlace" label="出版地址">
					<uni-easyinput placeholder="请输入出版地址" v-model="formData.pressPlace" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="price" label="价格">
					<uni-easyinput placeholder="请输入价格" type="number" v-model="formData.price" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="words" label="字数">
					<uni-easyinput placeholder="请输入字数" v-model="formData.words" disabled></uni-easyinput>
				</uni-forms-item>
				<view class="uni-button-group">
					<button type="primary" class="uni-button" @click="submit">提交</button>
				</view>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import {
		validator
	} from '../../js_sdk/validator/st-book.js';

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
				"author": "",
				"bookDesc": "",
				"bookName": "",
				"clcCode": "",
				"clcName": "",
				"isbn": "",
				"language": "",
				"pages": "",
				"pictures": "",
				"press": "",
				"pressDate": "",
				"pressPlace": "",
				"price": null,
				"words": ""
			}
			return {
				isbn: null,
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
				// 使用 clientDB 提交数据
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
			},
			search() {
				if (this.isbn && this.isbn.length === 13) {
					uni.showLoading({
						mask: true
					})
					uni.request({
						url: `http://47.99.80.202:6066/openApi/getInfoByIsbn?isbn=${this.isbn}&appKey=ae1718d4587744b0b79f940fbef69e77`,
						success: (res) => {
							uni.hideLoading()
							const {
								data
							} = res
							if (data && data.data) {
								this.formData = data.data
							} else {
								uni.showModal({
									content: '未获取到书本信息',
									showCancel: false
								})
							}
						},
						fail: (err) => {
							uni.hideLoading()
							uni.showModal({
								content: err.message || '请求服务失败',
								showCancel: false
							})
						}
					});
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

	.uni-container {
		padding: 15px;
	}

	.uni-input-border,
	.uni-textarea-border {
		width: 100%;
		font-size: 14px;
		color: #666;
		border: 1px #e5e5e5 solid;
		border-radius: 5px;
		box-sizing: border-box;
	}

	.uni-input-border {
		padding: 0 10px;
		height: 35px;

	}

	.uni-textarea-border {
		padding: 10px;
		height: 80px;
	}

	.uni-button-group {
		margin-top: 50px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
	}

	.uni-button {
		width: 184px;
	}
</style>