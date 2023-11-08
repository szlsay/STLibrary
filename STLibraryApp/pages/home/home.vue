<template>
	<view>
		123
		{{text}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: null
			}
		},
		onShow() {
			this.getData()
		},
		methods: {
			getData() {
				uni.request({
					url: 'http://47.99.80.202:6066/openApi/getInfoByIsbn?isbn=9787115461476&appKey=ae1718d4587744b0b79f940fbef69e77',
					success: (res) => {
						const {data} = res
						if (data) {
							this.text = data.data
						}
					}
				});
			}
		}
	}
</script>

<style>

</style>