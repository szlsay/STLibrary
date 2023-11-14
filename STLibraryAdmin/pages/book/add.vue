<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-row>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="isbn" label="ISBN" label-align="right">
						<uni-easyinput placeholder="请输入ISBN" v-model="formData.isbn"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="bookName" label="书名" label-align="right">
						<uni-easyinput placeholder="请输入书名" v-model="formData.bookName"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
			</uni-row>
			<uni-forms-item name="images" label="图片" label-align="right">
				<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp,jpeg" return-type="array"
					v-model="formData.images" :image-styles="imageStyles"></uni-file-picker>
			</uni-forms-item>
			<uni-forms-item name="author" label="作者" label-align="right">
				<uni-easyinput placeholder="请输入作者" v-model="formData.author"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="bookDesc" label="内容介绍" label-align="right">
				<uni-easyinput type="textarea" placeholder="请输入内容介绍" v-model="formData.bookDesc"></uni-easyinput>
			</uni-forms-item>
			<uni-row>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="clcCode" label="类型编码" label-align="right">
						<uni-easyinput placeholder="请输入类型编码" v-model="formData.clcCode"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="clcName" label="类型名称" label-align="right">
						<uni-easyinput placeholder="请输入类型名称" v-model="formData.clcName"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col :xs="24" :sm="8">
					<uni-forms-item name="press" label="出版社" label-align="right">
						<uni-easyinput placeholder="请输入出版社" v-model="formData.press"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="8">
					<uni-forms-item name="pressDate" label="出版时间" label-align="right">
						<uni-easyinput placeholder="请输入出版时间" v-model="formData.pressDate"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="8">
					<uni-forms-item name="pressPlace" label="出版地址" label-align="right">
						<uni-easyinput placeholder="请输入出版地址" v-model="formData.pressPlace"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
			</uni-row>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;">
					<button class="uni-button" style="width: 100px;">返回</button>
				</navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '@/js_sdk/validator/st-book.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'st-book';

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.includes(key)) {
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
				"author": "",
				"bookDesc": "",
				"bookName": "",
				"clcCode": "",
				"clcName": "",
				"isbn": "",
				"pictures": [],
				"press": "",
				"pressDate": "",
				"pressPlace": ""
			}
			return {
				imageStyles: {
					width: 140,
					height: 140,
				},
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