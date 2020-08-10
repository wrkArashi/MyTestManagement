<template>
	<div class="bg">
		<el-card class="forget">
			<div slot="header">
				<span>重置密码</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="65px" class="demo-ruleForm">
				<el-form-item label="账 户 :" prop="ID">
					<el-input v-model="ruleForm.ID" placeholder="请输入账号名"></el-input>
				</el-form-item>
				<el-form-item label="邮 箱 :" prop="Email">
					<el-input v-model="ruleForm.Email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label="验 证 :" prop="CheckCode">
					<el-input class="length" v-model="ruleForm.CheckCode" placeholder="填写验证码" style="width: 340px; margin-right: 7px;"></el-input>
					<el-button class="getcode" v-show="show" @click="getCode">点击获取</el-button>
					<span v-show="!show" class="count">剩余 {{count}} s</span>
				</el-form-item>
				<el-form-item label="重置密码 :" prop="pass" label-width="90px">
					<el-input type="password" v-model="ruleForm.pass" placeholder="请输入新密码" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码 :" prop="checkPass" label-width="90px">
					<el-input type="password" v-model="ruleForm.checkPass" placeholder="请再次确认" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-form>
			<div class="link">
				<div>
				</div>
				<router-link to="/login">返回登陆</router-link>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			// 新密码
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
				} else if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				show: true,
				count: '',
				timer: null,
				ruleForm: {
					ID: '',
					Email: '',
					CheckCode: '',
					pass: '',
					checkPass: '',
				},
				rules: {
					ID: [
						{ required: true, message: '请输入账号名', trigger: 'blur' },
						{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
					],
					Email: [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
						{ type: 'email', message: '邮箱不正确', trigger: 'blur' }
					],
					CheckCode: [
						{ required: true, message: '填写验证码', trigger: 'blur' },
						{ min: 0, max: 4, message: '验证码格式不对', trigger: 'blur' }
					],
					pass: [
						{ required: true, validator: validatePass, trigger: 'blur' },
						{ min: 3, max: 10, message: '密码格式为3-10位', trigger: 'blur' }
					],
					checkPass: [
						{ required: true, validator: validatePass2, trigger: 'blur' },
						{ min: 3, max: 10, message: '密码格式为3-10位', trigger: 'blur' }
					],
				}
			}
		},
		methods: {
			submitForm(ruleForm) {
				let formData = { ...this.ruleForm };
				// let pwd = formData.pass;
				// 加密
				const md5 = crypto.createHash('md5');
				md5.update(formData.pass);
				let pwd = md5.digest('hex')
				var data = {
					"FuncCode": "ForgetPwd",
					"Data": {
						"Params": [formData.ID, formData.CheckCode, pwd]
					},
				};
				this.$refs[ruleForm].validate((valid) => {
					if (valid) {
						Joggle.get(data)
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message({
										message: '修改成功，正在返回首页',
										type: 'success',
										duration: 2000,
										onClose: () => {
											// 重定向
											let { redirect } = this.$route.query
											if (redirect) {
												this.$router.push(redirect)
												return;
											}
											// 默认跳转 P246
											this.$router.push('/login')
										}
									})
								} else {
									this.$message.warning(response);
								}
							})
							.catch((response) => {
								this.$message.error(error);
							});
					}
				});
			},
			// 重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 获取验证码
			getCode() {
				let formData = { ...this.ruleForm };
				let name = formData.ID;
				let Email = formData.Email;
				var data = {
					"FuncCode": "CheckCode",
					"Data": {
						"Params": [name, Email]
					},
				};
				if (name.length > 0 && Email.length > 0) {
					Joggle.get(data)
						.then((response) => {
							if (response.indexOf("Fail:") == -1) {
								this.$message.success('已发送');
								const TIME_COUNT = 60;
								if (!this.timer) {
									this.count = TIME_COUNT;
									this.show = false;
									this.timer = setInterval(() => {
										if (this.count > 0 && this.count <= TIME_COUNT) {
											this.count--;
										} else {
											this.show = true;
											clearInterval(this.timer);
											this.timer = null;
										}
									}, 1000)
								}
							} else {
								this.$message.warning('邮箱或账户名不正确');
							}
						})
						.catch((response) => {
							this.$message.error(error);
						})
				} else {
					this.$message.warning('请输入账号和邮箱名');
				}
			}
		}
	}
</script>

<style lang="scss">
	.bg {
		position: fixed;
		height: 100%;
		width: 100%;
		background: url(../../src/assets/banner.jpg) no-repeat center 0 fixed;
		background-size: cover;
	}

	.forget {
		font-size: 16px;
		opacity: 0.8;
		width: 550px;
		margin: 0 auto;
		top: 23%;
		position: relative;
		border-radius: 10px;

		a {
			text-decoration: none;
			color: gray;
			font-size: 14px;
		}

		.link {
			display: flex;
			justify-content: space-between;
		}

		body .length {
			width: 72%;
			padding-right: 10px;
		}

		.count {
			background-color: rgb(236, 245, 255);
			padding: 10px;
			border-radius: 5px;
			border: 1px rgb(179, 216, 255) solid;
			color: rgb(64, 158, 255);
		}
	}
</style>
