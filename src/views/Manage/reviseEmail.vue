<template>
	<el-card class="email">
		<div slot="header" class="clearfix">
			<span>修改邮箱</span>
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
			<el-form-item label="账号 :" prop="ID">
				<el-input v-model="ruleForm.ID" disabled=""></el-input>
			</el-form-item>
			<el-form-item label="密码 :" prop="Pwd">
				<el-input type="password" v-model="ruleForm.Pwd" placeholder="请输入密码"></el-input>
			</el-form-item>
			<el-form-item label="新邮箱 :" prop="NewEmail">
				<el-input v-model="ruleForm.NewEmail" placeholder="请输入新邮箱"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				<el-button @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	import crypto from 'crypto';
	export default {
		data() {
			return {
				ruleForm: {
					ID: sessionStorage.id,
					Pwd: '',
					NewEmail: ''
				},
				rules: {
					Pwd: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 3, max: 10, message: '密码格式为3-10位', trigger: 'blur' }
					],
					NewEmail: [
						{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
					],
				}
			};
		},
		methods: {
			// 提交
			submitForm(ruleForm) {
				let formData = { ...this.ruleForm };
				const md5 = crypto.createHash('md5');
				md5.update(formData.Pwd);
				let pwd = md5.digest('hex');
				var data = {
					"FuncCode": "ChgMail",
					"Data": [
						[{
							"ID": sessionStorage.id,
							"Pwd": pwd,
							"NewMail": formData.NewEmail
						}]
					]
				}
				this.$refs.ruleForm.validate(async (valid) => {
					if (valid) {
						await Joggle.put(data)
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message.success('修改邮箱成功');
									this.ruleForm = {};
									this.ruleForm.ID = sessionStorage.id
								} else {
									this.$message.warning(response);
								}
							})
							.catch((response) => {
								this.$message.error(error);
							})
					}
				})
			},
			// 重置
			resetForm(ruleForm) {
				this.$refs[ruleForm].resetFields();
			},
		}
	}
</script>

<style lang="scss">
	.email {
		font-size: 16px;
		width: 600px;
	}
</style>
