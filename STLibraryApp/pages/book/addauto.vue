<template>
	<view class="page">
		<view class="page-input">
			<view class="input-code">
				<uni-easyinput placeholder="请输入13位的ISBN~" maxlength="13" v-model="isbn" trim="both"></uni-easyinput>
				<button type="primary" @click="search" style="width: 20%;">查询</button>
			</view>
		</view>
		<view class="page-result" v-if="formData">
			<uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast" :label-width='40'>
				<uni-forms-item name="isbn" label="ISBN">
					<uni-easyinput placeholder="请输入ISBN" v-model="formData.isbn" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="bookName" label="书名">
					<uni-easyinput placeholder="请输入书名" v-model="formData.bookName" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="author" label="作者">
					<uni-easyinput placeholder="请输入作者" v-model="formData.author" disabled></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="bookDesc" label="介绍">
					<uni-easyinput type="textarea" placeholder="请输入内容介绍" v-model="formData.bookDesc" disabled></uni-easyinput>
				</uni-forms-item>
				<!-- 				<view class="book-box">
					<uni-forms-item name="clcCode" label="类型" style="width: 300rpx;">
						<uni-easyinput placeholder="请输入类型编码" v-model="formData.clcCode" disabled></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="clcName" style="flex: 1; margin-left: -60rpx;">
						<uni-easyinput placeholder="请输入类型名称" v-model="formData.clcName" disabled></uni-easyinput>
					</uni-forms-item>
				</view> -->
				<view class="book-box">
					<uni-forms-item name="press" label="出版社" style="width: 300rpx;">
						<uni-easyinput placeholder="请输入出版社" v-model="formData.press" disabled></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="pressDate" style="flex: 1; margin-left: -60rpx;">
						<uni-easyinput placeholder="请输入出版时间" v-model="formData.pressDate" disabled></uni-easyinput>
					</uni-forms-item>
				</view>
				<!-- 				<uni-forms-item name="pressPlace" label="出版地址">
					<uni-easyinput placeholder="请输入出版地址" v-model="formData.pressPlace" disabled></uni-easyinput>
				</uni-forms-item> -->
				<uni-forms-item name="pictures" label="图片">
					<image v-for="(url, index) in formData.pictures" :key="index" :src="url" mode="aspectFill"
						@tap.native.stop="onClickPreview(url)"></image>
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
				"isisbn": true,
				"author": "",
				"bookDesc": "",
				"bookName": "",
				"clcCode": "",
				"clcName": "",
				"isbn": "",
				"pictures": [],
				"press": "",
				"pressDate": "",
				"pressPlace": "",
			}
			return {
				isbn: '',
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
			// this.getDetail()
		},
		methods: {
			getDetail() {
				uniCloud.database().collection(dbCollectionName).where({
					isbn: this.isbn
				}).get({
					getOne: true
				}).then(res => {
					const {
						result
					} = res
					console.log(result)
					this.formData = result.data
				})
			},
			onClickPreview(url) {
				event.preventDefault()
				uni.previewImage({
					urls: [url],
					current: 0
				});
			},
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
				value.isisbn = true
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
						url: `https://api.jike.xyz/situ/book/isbn/${this.isbn}?apikey=12524.6833bc5d3ba860a9242c196b4feaae26.8da93d6d3ac6f6bc9f2ab633b26cc791`,
						success: (res) => {
							uni.hideLoading()
							const {
								data
							} = res
							if (data && data.data) {
								let tempData = data.data
								tempData.bookDesc = tempData.description
								tempData.bookName = tempData.name
								tempData.isbn = tempData.code

								if (tempData.photoUrl) {
									let photoUrl = tempData.photoUrl
									if (tempData.photoUrl.indexOf('douban') != -1) {
										photoUrl = `https://images.weserv.nl/?url=${tempData.photoUrl}`
									}
									tempData.pictures = [photoUrl]
								}
								tempData.press = tempData.publishing
								tempData.pressDate = tempData.published
								this.formData = tempData
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

					// uni.request({
					// 	url: `http://47.99.80.202:6066/openApi/getInfoByIsbn?isbn=${this.isbn}&appKey=ae1718d4587744b0b79f940fbef69e77`,
					// 	success: (res) => {
					// 		uni.hideLoading()
					// 		const {
					// 			data
					// 		} = res
					// 		if (data && data.data) {
					// 			let tempData = data.data
					// 			if (tempData.pictures) {
					// 				const result = JSON.parse(tempData.pictures);
					// 				if (result && Array.isArray(result) && result.length > 0) {
					// 					tempData.pictures = result.map(item => {
					// 						if (item.indexOf('douban') != -1) {
					// 							item = `https://images.weserv.nl/?url=${item}`
					// 						}
					// 						return item
					// 					})
					// 				}
					// 			}
					// 			this.formData = tempData
					// 		} else {
					// 			uni.showModal({
					// 				content: '未获取到书本信息',
					// 				showCancel: false
					// 			})
					// 		}
					// 	},
					// 	fail: (err) => {
					// 		uni.hideLoading()
					// 		uni.showModal({
					// 			content: err.message || '请求服务失败',
					// 			showCancel: false
					// 		})
					// 	}
					// });
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