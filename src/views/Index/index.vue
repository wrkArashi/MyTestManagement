<template>
	<div>
		<!-- <model-obj src="assets/qip.mtl"></model-obj> -->
		<!-- <el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
		</el-breadcrumb>
		<a target='_black' href='http://view.officeapps.live.com/op/view.aspx?src=http://27.223.90.126:7777/Core/DownloadFile?Filename=20200228160310-IMP%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3-20200221-v1.0(2).xlsx'>
			连接
		</a> -->
		<!-- 手动上传 -->
		<!-- 		<el-form :model="form">
			<el-form-item>
				<el-upload ref="uploadPdf" action="http://192.168.2.199:7777/Core/UploadFile" :limit=3 :auto-upload="false"
				 accept=".pdf" :before-upload="beforeUploadFile" :on-change="fileChange" :on-exceed="exceedFile" :on-success="handleSuccess"
				 :on-error="handleError" :file-list="fileList" :headers="importHeaders" :on-remove="handleRemove">
					<el-button size="small" plain>选择文件</el-button>
					<div slot="tip" class="el-upload__tip">只能上传xlsx(Excel2007)文件，且不超过10M</div>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
				<el-button size="small">取消</el-button>
			</el-form-item>
		</el-form> -->
		<!-- 基础上传 -->
		<!-- 		<el-button @click="handleEdit"></el-button>
		<el-upload class="upload-demo" action="http://192.168.2.199:7777/Core/UploadFile" :on-success="handleSuccess"
		 :before-upload="beforeUploadFile" multiple :limit="3" :on-exceed="exceedFile" :file-list="fileList" accept=".xlsx"
		 :headers="importHeaders">
			<el-button size="small" type="primary">点击上传</el-button>
			<div slot="tip" class="el-upload__tip">只能上.xlsx文件,且不超过10M</div>
		</el-upload> -->
		<!-- 		<a target='_black' href='http://view.officeapps.live.com/op/view.aspx?src='>
			http://27.223.90.126:7777/Core/DownloadFile?Filename= -->
	</div>
</template>
<script>
	import { ModelObj } from 'vue-3d-model'
	var mytoken = sessionStorage.token
	import { Joggle } from '@/api/index.js';

	export default {
		components: { ModelObj }, //3d
		data() {
			return {

				dialogVisible: false,
				typeInfo: {
					group: '',
					name: ''
				},
				typeOptions: [], // 分类层级选项
				props: {
					label: 'name', // 显示的选项
					value: 'id', // 选择的value值
					children: 'childs', // 子级属性名
					checkStrictly: true // 可以选择任意一级
				}, // 指定层级属性
				importHeaders: { token: mytoken },
				form: {
					file: ''
				},
				fileList: []
			};
		},
		methods: {
			handleEdit() {
				// if (!/\.(pdf|PDF)$/.test(row.wjYsmc)) {
				// 不是pdf格式
				// window.open(
				// 	"https://view.officeapps.live.com/op/view.aspx?src=" + this.yuming + "/zhengCe?id=" + row.id,
				// 	"_blank"
				// );

				// var headers = {
				// 	'Token': sessionStorage.token,
				// };
				// this.pdfurl = pdf.createLoadingTask({
				// 	url: 'http://27.223.90.126:7777/Core/DownloadFile?Filename=' + item.Filename,
				// 	httpHeaders: headers
				// });
				// window.open(
				// 	"https://view.officeapps.live.com/op/view.aspx?src=https://27.223.90.126:7777/Core/DownloadFile?Filename=20200228160310-IMP开发文档-20200221-v1.0(2).xlsx",
				// 	"_blank",

				// );	
				window.open(
					"https://view.officeapps.live.com/op/view.aspx?src=http://27.223.90.126:7777/Core/DownloadFile?Filename=20200228160310-IMP%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3-20200221-v1.0(2).xlsx",
					"_blank",

				);
				// window.open
				// ('page.html','newwindow','height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')

				// https://view.officeapps.live.com/op/view.aspx?src=文件url
				// http: //27.223.90.126:7777/Core/DownloadFile?Filename=
				// return false;
				// } else {
				// 	// pdf 格式
				// 	let url = this.yuming + "/anli?id=" + row.id
				// 	this.viewVisible = true
				// 	this.pdfsrc = url
				// }
			},
			// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
			beforeUploadFile(file) {
				let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
				let size = file.size / 1024 / 1024
				if (extension !== 'xlsx') {
					this.$message.warning('只能上传(.xlsx)文件')
					return false
				}
				if (size > 10) {
					this.$message.warning('文件大小不得超过10M')
					return false
				}
			},
			// 文件超出个数限制时的钩子
			exceedFile(files, fileList) {
				this.$notify.warning({
					title: '警告',
					message: `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`
				});
			},
			// 文件上传成功时的钩子
			handleSuccess(res, file, fileList) {
				this.$notify.success({
					title: '成功',
					message: `文件上传成功`
				});
			},

		}


	}
</script>
<style scoped>


</style>
