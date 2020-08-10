<template>
	<el-card class="user">
		<div slot="header">
			<span>修改个人信息</span>
		</div>
		<el-form :model="form" :rules="rules" ref="form" label-width="80px" class="demo-ruleForm">
			<el-form-item label="ID :" prop="ID">
				<el-input v-model="form.ID" disabled></el-input>
			</el-form-item>
			<el-form-item label="姓名 :" prop="Name">
				<el-input v-model="form.Name"></el-input>
			</el-form-item>
			<el-form-item label="性别 :" prop="Sex">
				<el-radio-group v-model="form.Sex">
					<el-radio label="男"></el-radio>
					<el-radio label="女"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="电话 :" prop="Mobile">
				<el-input v-model="form.Mobile"></el-input>
			</el-form-item>
			<el-form-item label="出生日期 :" prop="Birthday">
				<el-date-picker v-model="form.Birthday" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="通讯地址 :" prop="Address">
				<el-input v-model="form.Address"></el-input>
			</el-form-item>
			<el-form-item label="描述 :" prop="Depict">
				<el-input v-model="form.Depict"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">完成修改</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';

	export default {
		data() {
			//验证手机号
			var checkPhone = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('手机号不能为空'));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的手机号'));
					}
				}
			}
			return {
				form: {
					ID: "",
					Name: "",
					Birthday: "",
					Sex: "",
					Mobile: "",
					Depict: "",
					Address: '',
					Category: "",
					ChartLevel: "",
					ChartMap: ''
				},
				disabled: true,
				rules: {
					Name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
					],
					Mobile: [
						{ required: true, validator: checkPhone, trigger: 'blur' }
					],
				}
			}
		},
		created() {
			this.loadList();
		},
		methods: {
			// 载入
			async loadList() {
				var data = {
					"FuncCode": "GetUser",
					"Data": {
						"Params": [sessionStorage.id]
					},
				}
				await Joggle.get(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							var jsonObj = JSON.parse(response);
							this.form = jsonObj[0]
						} else {
							this.$message.warning(response);
						}
					})
					.catch((response) => {
						this.$message.error(error);
					});
			},
			// 提交
			async onSubmit() {
				var data = {
					"FuncCode": "ChgUser",
					"Data": [
						[this.form]
					],
				}
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						await Joggle.put(data)
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message.success('修改个人信息成功');
									this.loadList();
								} else {
									this.$message.warning(response);
								}
							})
							.catch((response) => {
								this.$message.error(error);
							})
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	.user {
		font-size: 16px;
		width: 600px;
	}
</style>
