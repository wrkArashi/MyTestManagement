<template>
	<el-card class="pwd">
		<div slot="header" class="clearfix">
			<span>修改密码</span>
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
			<el-form-item label="账号 :" prop="ID">
				<el-input v-model="ruleForm.ID" disabled=""></el-input>
			</el-form-item>
			<el-form-item label="旧密码 :" prop="OldPwd">
				<el-input type="password" v-model="ruleForm.OldPwd" placeholder="请输入旧密码" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="新密码 :" prop="NewPwd">
				<el-input type="password" v-model="ruleForm.NewPwd" placeholder="请输入新密码" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="确认密码 :" prop="checkPass">
				<el-input type="password" v-model="ruleForm.checkPass" placeholder="请再次输入新密码" autocomplete="off"></el-input>
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
			// 确认密码
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.NewPwd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					ID: sessionStorage.id,
					OldPwd: '',
					NewPwd: '',
					checkPass: '',
				},
				rules: {
					OldPwd: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 3, max: 10, message: '密码格式为3-10位', trigger: 'blur' }
					],
					// 确认密码
					NewPwd: [
						{ validator: validatePass, trigger: 'blur' },
						{ min: 3, max: 10, message: '密码格式为3-10位', trigger: 'blur' }
					],
					checkPass: [
						{ validator: validatePass2, trigger: 'blur' },
						{ min: 3, max: 10, message: '密码格式为3-10位', trigger: 'blur' }
					],
				}
			};
		},
		methods: {
			// 提交
			submitForm(ruleForm) {
				let formData = { ...this.ruleForm };
				const md5 = crypto.createHash('md5');
				md5.update(formData.OldPwd);
				let OldPwd = md5.digest('hex');
				const md51 = crypto.createHash('md5');
				md51.update(formData.NewPwd);
				let NewPwd = md51.digest('hex');
				var data = {
					"FuncCode": "ChgPwd",
					"Data": [
						[{
							"ID": sessionStorage.id,
							"OldPwd": OldPwd,
							"NewPwd": NewPwd,
						}]
					]
				}
				this.$refs.ruleForm.validate(async (valid) => {
					if (valid) {
						await Joggle.put(data)
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message.success('修改密码成功');
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
	.pwd {
		font-size: 16px;
		width: 600px;
	}
</style>