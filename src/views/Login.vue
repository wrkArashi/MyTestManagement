<template>
	<div class="bg">
		<el-card class="login">
			<div slot="header">
				<span>欢迎登录</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="65px" class="demo-ruleForm">
				<el-form-item label="账 户 :" prop="ID">
					<el-input v-model="ruleForm.ID" placeholder="请输入账号名"></el-input>
				</el-form-item>
				<el-form-item label="密 码 :" prop="Password">
					<el-input v-model="ruleForm.Password" type="password" placeholder="请输入密码"></el-input>
				</el-form-item>
				<!-- 验证码 -->
				<div class="flex">
					<el-form-item label="验 证 :" prop="code">
						<el-input v-model="ruleForm.code" placeholder="请输入验证码"></el-input>
					</el-form-item>
					<div class="code" @click="refreshCode">
						<s-identify :identifyCode="identifyCode"></s-identify>
					</div>
				</div>
				<el-form-item>
					<el-button type="primary" @click="loginHandle()">登录</el-button>
				</el-form-item>
			</el-form>
			<div class="link">
				<div></div>
				<router-link to="/ForgetPassword">忘记密码</router-link>
			</div>
		</el-card>
	</div>
</template>
<script>
	import SIdentify from '@/utils/Identify';
	import crypto from 'crypto';
	import { Joggle } from '@/api/index.js';
	export default {
		name: 'App',
		components: {
			SIdentify
		},
		data() {
			var checkCode = (rule, value, callback) => {
				if (value != this.identifyCode) {
					callback(new Error('验证码错误'));
				} else {
					callback();
				}
			};
			return {
				identifyCodes: "1234567890",
				identifyCode: "",
				ruleForm: {
					ID: '',
					Password: '',
					code: '',
				},
				rules: {
					ID: [{
						required: true,
						message: '请输入账号名',
						trigger: 'blur'
					}],
					Password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '密码格式为3-10位',
							trigger: 'blur'
						}
					],
					code: { validator: checkCode, trigger: 'blur' }
				}
			};
		},
		mounted() {
			this.identifyCode = "";
			this.makeCode(this.identifyCodes, 4);
		},
		methods: {
			randomNum(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			},
			refreshCode() {
				this.identifyCode = "";
				this.makeCode(this.identifyCodes, 4);
			},
			makeCode(o, l) {
				for (let i = 0; i < l; i++) {
					this.identifyCode += this.identifyCodes[
						this.randomNum(0, this.identifyCodes.length)
					];
				}
			},
			loginHandle() {
				let formData = { ...this.ruleForm };
				let name = formData.ID;
				// 加密
				const md5 = crypto.createHash('md5');
				md5.update(formData.Password);
				let pwd = md5.digest('hex');
				var data = {
					"FuncCode": "Login",
					"Data": {
						"Params": [name, pwd]
					},
				}
				// validate校验表单
				this.$refs.ruleForm.validate((valid) => {
					if (valid) {
						Joggle.get(data).then((response) => {
							if (response.indexOf("Fail:") == -1) {
								// 储存token
								sessionStorage.token = response
								sessionStorage.id = name
								// 登录成功，显示成功信息
								this.$message({
									message: '登陆成功',
									type: 'success',
									duration: 1000,
									onClose: () => {
										// 重定向
										let { redirect } = this.$route.query
										if (redirect) {
											this.$router.push(redirect)
											return;
										}
										// 默认跳转 P246
										this.$router.push('/index/list')
										// 跳转后载入数据
									}
								})
							} else {
								this.$message.warning(response);
							}
						})
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	.login {
		font-size: 16px;
		opacity: 0.8;
		width: 550px;
		margin: 0 auto;
		top: 23%;
		position: relative;
		border-radius: 10px;

		.flex {
			display: flex;
			justify-content: space-between;

			.el-form-item {
				width: 100%;
			}

			.code {
				margin-left: 10px;
			}
		}

		a {
			text-decoration: none;
			color: gray;
			font-size: 14px;
		}

		.link {
			display: flex;
			justify-content: space-between;
		}
	}

	.bg {
		position: fixed;
		height: 100%;
		width: 100%;
		background: url(../../src/assets/banner.jpg) no-repeat center 0 fixed;
		background-size: cover;
	}
</style>
