<template>
	<div class="bankMine">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/index/list' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>题库管理</el-breadcrumb-item>
			<el-breadcrumb-item>我的题库</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="structure">
			<!-- 右 -->
			<div class="right">
				<!-- 标题 -->
				<div class="group">
					<span style="font-size: 15px;">我的试题</span>
				</div>
				<!-- 查询 -->
				<div class="enquire">
					<el-form :inline="true" :model="form" class="demo-form-inline">
						<!-- 级联选择器（课程） -->
						<el-form-item label="课程:">
							<el-select v-model="Type" placeholder="请选择类别">
								<el-option v-for="item in optionsFirst" :label="item.Category" :value="item.Category" :key="item.Category"></el-option>
							</el-select>
							<el-select v-model="Course" placeholder="请选择课程">
								<el-option v-for="item in optionsThrid" :key="item.ID" :label="item.Name" :value="item.Name"></el-option>
							</el-select>
						</el-form-item>
						<!-- 下拉框（题型） -->
						<el-form-item label="题型:">
							<el-select v-model="Category" placeholder="请选择">
								<el-option v-for="item in options1" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div class="btn">
						<el-button type="primary" @click="sift()" plain>搜索</el-button>
						<el-button type="warning" @click="again()" plain>重置</el-button>
						<el-button @click="dialogFormVisible=true" plain>＋新建试题</el-button>
					</div>
				</div>
				<!-- 表格 -->
				<el-table :data="tableData.filter(data => !search || data.Stem.toLowerCase().includes(search.toLowerCase()))"
				 :row-class-name="tableRowClassName">
					<el-table-column prop="Stem" label="题目" width="430px" :show-overflow-tooltip="true" sortable=""></el-table-column>
					<el-table-column sortable prop="Course" label="课程" width="" sortable=""></el-table-column>
					<el-table-column prop="Category" label="题型" width="" sortable=""></el-table-column>
					<el-table-column prop="Score" label="分值" width="" sortable=""></el-table-column>
					<el-table-column prop="Knowledge" label="知识点" width="" sortable=""></el-table-column>
					<el-table-column prop="Book" label="教材" width="" sortable=""></el-table-column>
					<el-table-column align="right" width="250">
						<template slot="header" slot-scope="scope">
							<el-input v-model="search" size="mini" placeholder="输入题干中的关键字搜索" />
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="primary" @click='editHandle(scope.$index, scope.row)' plain>编辑</el-button>
							<el-button size="mini" type="warning" @click='issue(scope.$index, scope.row)' plain v-model="editForm.Status">
								<span v-if=" scope.row.Status== 'inactive'">未发布</span>
								<span v-if=" scope.row.Status== 'active'">已发布</span>
							</el-button>
							<el-button size="mini" type="danger" @click='deleteHandle(scope.$index, scope.row)' plain style="margin-left: 10px;">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<div class="block">
					<el-pagination @current-change="handleCurrentChange" :page-size="20" layout="total,prev, pager, next, jumper"
					 :total="total">
					</el-pagination>
				</div>
			</div>
		</div>
		<!-- 添加试题框 -->
		<el-dialog title="添加试题" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :destroy-on-close="true">
			<!-- 选择课程和题型 -->
			<el-form :inline="true" :model="form" class="demo-form-inline" :rules="rules" ref="form">
				<!-- 级联选择器（课程） -->
				<el-form-item label="课程" prop="Type">
					<el-select v-model="formInline.Type" placeholder="请选择类别">
						<el-option v-for="item in optionsFirst" :label="item.Category" :value="item.Category" :key="item.Category"></el-option>
					</el-select>
					<el-select v-model="form.Course" placeholder="请选择课程">
						<el-option v-for="item in optionsSecond" :key="item.ID" :label="item.Name" :value="item.Name"></el-option>
					</el-select>
				</el-form-item>
				<!-- 下拉框（题型） -->
				<el-form-item label="题型" prop="Type">
					<el-select v-model="form.Category" placeholder="请选择">
						<el-option v-for="item in options1" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分值" prop="Score">
					<el-input v-model.number="form.Score" placeholder="例:3" style="width: 70px;"></el-input>
				</el-form-item>
			</el-form>
			<!-- 试题内容 -->
			<!-- 单选时 -->
			<div v-if="form.Category=='单选'">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item prop="Stem">
						<el-input type="textarea" v-model="form.Stem" placeholder="请输入题目"></el-input>
					</el-form-item>
					<div>题目附件(图片)⬇</div>
					<el-form-item>
						<input @change='photo' type="file">
						<img :src="form.Attached" class="img" ref="img" />
					</el-form-item>
					<div>A选项⬇</div>
					<el-form-item prop="">
						<el-input type="textarea" v-model="form.OptionA"></el-input>
					</el-form-item>
					<div>B选项⬇</div>
					<el-form-item prop="">
						<el-input type="textarea" v-model="form.OptionB"></el-input>
					</el-form-item>
					<div>C选项⬇</div>
					<el-form-item prop="">
						<el-input type="textarea" v-model="form.OptionC"></el-input>
					</el-form-item>
					<div>D选项⬇</div>
					<el-form-item prop="">
						<el-input type="textarea" v-model="form.OptionD"></el-input>
					</el-form-item>
					<div>参考答案⬇</div>
					<el-form-item prop="">
						<el-radio-group v-model="form.Anwser">
							<el-radio label="A"></el-radio>
							<el-radio label="B"></el-radio>
							<el-radio label="C"></el-radio>
							<el-radio label="D"></el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</div>
			<!-- 多选 -->
			<div v-if="form.Category=='多选'">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item prop="Stem">
						<el-input type="textarea" v-model="form.Stem" placeholder="请输入题目"></el-input>
					</el-form-item>
					<div>题目附件(图片)⬇</div>
					<el-form-item>
						<input @change='photo' type="file">
						<img :src="form.Attached" class="img" ref="img" />
					</el-form-item>
					<div>A选项⬇</div>
					<el-form-item prop="">
						<el-input type="textarea" v-model="form.OptionA"></el-input>
					</el-form-item>
					<div>B选项⬇</div>
					<el-form-item prop="">
						<el-input type="textarea" v-model="form.OptionB"></el-input>
					</el-form-item>
					<div>C选项⬇</div>
					<el-form-item prop="">
						<el-input type="textarea" v-model="form.OptionC"></el-input>
					</el-form-item>
					<div>D选项⬇</div>
					<el-form-item prop="">
						<el-input type="textarea" v-model="form.OptionD"></el-input>
					</el-form-item>
					<div>参考答案⬇</div>
					<el-form-item prop="">
						<el-input type="textarea" v-model="form.Anwser" placeholder="选项之间用逗号分隔"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<!-- 填空题 -->
			<div v-if="form.Category=='填空'">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item prop="Stem">
						<el-input type="textarea" v-model="form.Stem" placeholder="请输入题目"></el-input>
					</el-form-item>
					<div>题目附件(图片)⬇</div>
					<el-form-item>
						<input @change='photo' type="file">
						<img :src="form.Attached" class="img" ref="img" />
					</el-form-item>
					<div>参考答案⬇</div>
					<el-input type="textarea" v-model="form.Anwser" placeholder="答案之间用'/'隔开"></el-input>
				</el-form>
			</div>
			<!-- 判断题 -->
			<div v-if="form.Category=='判断'">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item prop="Stem">
						<el-input type="textarea" v-model="form.Stem" placeholder="请输入题目"></el-input>
					</el-form-item>
					<div>题目附件(图片)⬇</div>
					<el-form-item>
						<input @change='photo' type="file">
						<img :src="form.Attached" class="img" ref="img" />
					</el-form-item>
					<div>参考答案⬇</div>
					<el-form-item prop="">
						<el-radio-group v-model="form.Anwser">
							<el-radio label="√"></el-radio>
							<el-radio label="×"></el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</div>
			<!-- 简答 -->
			<div v-if="form.Category=='简答'">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item prop="Stem">
						<el-input type="textarea" v-model="form.Stem" placeholder="请输入题目"></el-input>
					</el-form-item>
					<div>题目附件(图片)⬇</div>
					<el-form-item>
						<input @change='photo' type="file">
						<img :src="form.Attached" class="img" ref="img" />
					</el-form-item>
					<div>参考答案⬇</div>
					<el-input type="textarea" v-model="form.Anwser"></el-input>
				</el-form>
			</div>
			<!-- 编程 -->
			<div v-if="form.Category=='编程'">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item prop="Stem">
						<el-input type="textarea" v-model="form.Stem" placeholder="请输入题目"></el-input>
					</el-form-item>
					<div>题目附件(图片)⬇</div>
					<el-form-item>
						<input @change='photo' type="file">
						<img :src="form.Attached" class="img" ref="img" />
					</el-form-item>
					<div>参考答案⬇</div>
					<el-input type="textarea" v-model="form.Anwser"></el-input>
				</el-form>
			</div>
			<!-- 上机 -->
			<div v-if="form.Category=='上机'">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item prop="Stem">
						<el-input type="textarea" v-model="form.Stem" placeholder="请输入题目"></el-input>
					</el-form-item>
					<div>题目附件(图片)⬇</div>
					<el-form-item>
						<input @change='photo' type="file">
						<img :src="form.Attached" class="img" ref="img" />
					</el-form-item>
				</el-form>
			</div>
			<!-- 选填信息 -->
			<el-collapse>
				<el-collapse-item title="选填信息">
					<el-form :inline="true" :model="canForm" class="demo-form-inline" ref="canForm">
						<el-form-item label="适用教材">
							<el-input v-model="canForm.Book"></el-input>
						</el-form-item>
						<el-form-item label="适用章节">
							<el-input v-model="canForm.Chaptor"></el-input>
						</el-form-item>
						<el-form-item label="知识点">
							<el-input v-model="canForm.Knowledge"></el-input>
						</el-form-item>
						<el-form-item label="公开策略">
							<el-select v-model="canForm.IsPublic" placeholder="请选择">
								<el-option v-for="item in public" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</el-collapse-item>
			</el-collapse>
			<!-- 按钮 -->
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel()">取 消</el-button>
				<el-button type="primary" @click="sureSubmit()">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑试题" :visible.sync="editModalShow" :show-close='false' width="600px">
			<el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
				<el-form-item label="题干" prop="Stem">
					<el-input type="textarea" v-model="editForm.Stem" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="附件(图片)">
					<input @change='photo' type="file">
				</el-form-item>
				<div style="margin-left: 80px;">
					<img :src="editForm.Attached" class="img" ref="img" />
				</div>
				<div v-if="editForm.Category=='单选'">
					<el-form-item label="选项A" prop="">
						<el-input type="textarea" v-model="editForm.OptionA" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="选项B" prop="">
						<el-input type="textarea" v-model="editForm.OptionB" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="选项C" prop="">
						<el-input type="textarea" v-model="editForm.OptionC" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="选项D" prop="">
						<el-input type="textarea" v-model="editForm.OptionD" autocomplete="off"></el-input>
					</el-form-item>
				</div>
				<el-form-item label="参考答案" prop="">
					<el-input v-model="editForm.Anwser" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="教材">
					<el-input v-model="editForm.Book" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="章节">
					<el-input v-model="editForm.Chaptor" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="分值" prop="Score">
					<el-input v-model.number="editForm.Score" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="知识点">
					<el-input v-model="editForm.Knowledge" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="公开策略">
					<el-select v-model="editForm.IsPublic" placeholder="请选择">
						<el-option v-for="item in public" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditModal">取 消</el-button>
				<el-button type="primary" @click="edit">完 成</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				null: "",
				null1: "",
				Type: "",
				Course: "",
				Category: "",
				editModalShow: false, //编辑模态框
				// 编辑表单
				editForm: {},
				public: [{
					value: true,
					label: '公开'
				}, {
					value: false,
					label: '私有'
				}],
				search: '', // 搜索框	
				total: 0, // 分页总条数
				pageIndex: "1", //第几页			
				// options: [],
				// 下拉菜单（题型）
				options1: [{
					value: '单选',
					label: '单选'
				}, {
					value: '多选',
					label: '多选'
				}, {
					value: '填空',
					label: '填空'
				}, {
					value: '判断',
					label: '判断'
				}, {
					value: '简答',
					label: '简答'
				}, {
					value: '编程',
					label: '编程'
				}, {
					value: '上机',
					label: '上机'
				}],
				// 级联选择器
				optionsFirst: [],
				optionsSecond: [],
				optionsThrid: [],
				//选择课程和题型
				formInline: { Type: "" },
				isClear: '', //富文本
				dialogFormVisible: false, // 添加试题框是否打开
				// 试题内容
				form: {
					Score: '',
					Stem: '',
					OptionA: '',
					OptionB: '',
					OptionC: '',
					OptionD: '',
					Anwser: "",
					Attached: null,
					Creator: "",
					Course: "",
					Category: "",
				},
				// 选填表单
				canForm: {
					Book: '',
					Chaptor: '',
					Knowledge: '',
					IsPublic: true
				},
				// 表格
				tableData: [],
				rules: {
					Type: { required: true, message: '类别不能为空', trigger: 'blur' },
					Score: { required: true, message: '请填入数字', trigger: 'blur', type: "number" },
					Stem: { required: true, message: '题目不能为空', trigger: 'blur' },
				},
			};
		},
		watch: {
			// 级联
			'formInline.Type': function(newValue, oldValue) {
				this.loadCourse(newValue);
			},
			'Type': function(newValue, oldValue) {
				this.getCourse(newValue);
			}
		},
		created() {
			this.loadList();
			this.loadMyList()
		},
		methods: {
			// 新建取消
			cancel() {
				this.$refs.form.resetFields()
				this.dialogFormVisible = false
			},
			// 斑马纹
			tableRowClassName({ row, rowIndex }) {
				if (rowIndex % 2 === 1) {
					return 'blue-row';
				}
				return '';
			},
			// 删除，进回收站
			async deleteHandle(index, row) {
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				var data = {
					"FuncCode": "SetSta",
					"Data": [
						[{
							"Table": "Questions",
							"ID": row.ID,
							"Value": "drop",
							"Name": row.Stem,
							"UserID": sessionStorage.id,
							"Date": time
						}]
					],
				}
				await Joggle.put(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							if (response == "Success") {
								this.$message.success('已删除');
							} else {
								this.$message.warning('删除失败：该考题已被引用');
							}
							this.loadMyList();
						} else {
							this.$message.warning(response);
						}
					})
					.catch((response) => {
						this.$message.error(error);
					})
			},
			// 点击发布
			async issue(index, row) {
				if (row.Status == "active") {
					var status = "inactive"
				}
				if (row.Status == "inactive") {
					var status = "active"
				}
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				var data = {
					"FuncCode": "SetSta",
					"Data": [
						[{
							"Table": "Questions",
							"ID": row.ID,
							"Value": status,
							"Name": row.Stem,
							"UserID": sessionStorage.id,
							"Date": time
						}]
					],
				}
				await Joggle.put(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							if (response == "Success") {
								this.$message.success('修改状态成功');
							} else {
								this.$message.warning('修改失败：该考题已被引用');
							}
							this.loadMyList();
						} else {
							this.$message.warning(response);
						}
					})
					.catch((response) => {
						this.$message.error(error);
					})
			},
			// 点击编辑
			editHandle(index, row) {
				this.editModalShow = true;
				this.editForm = Object.assign({}, row);
			},
			// 点击编辑模态框的取消
			closeEditModal(editForm) {
				this.editModalShow = false;
				this.$refs.editForm.resetFields()
			},
			// 点击编辑模态框的完成
			edit() {
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.editForm.UpdateDate = time
				var data = {
					"FuncCode": "ChgQu",
					"Data": [
						[this.editForm]
					],
				}
				this.$refs.editForm.validate(async (valid) => {
					if (valid) {
						await Joggle.put(data)
							.then((response) => {
								if (response.indexOf("Fail:") == -1) {
									this.$message.success('修改成功');
									this.editModalShow = false;
									this.form.Attached = ""
									this.loadMyList();
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
			// 点击重置
			async again() {
				this.Category = ""
				this.Course = ''
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							sessionStorage.id,
							null,
							null,
							this.pageIndex
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj.Data
						this.total = jsonObj.Counts
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 点击筛选
			async sift() {
				if (this.Category == "") {
					this.null = null
				} else {
					this.null = this.Category
				}
				if (this.Course == "") {
					this.null1 = null
				} else {
					this.null1 = this.Course
				}
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							sessionStorage.id,
							this.null,
							this.null1,
							this.pageIndex
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj.Data
						this.total = jsonObj.Counts
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 图片
			photo(event) {
				var reader = new FileReader(); //创建读取文件的方法
				var img1 = event.target.files[0];
				reader.readAsDataURL(img1); //将文件已url的形式读入页面
				var that = this;
				reader.onload = function(e) {
					that.form.Attached = reader.result;
					that.editForm.Attached = reader.result;
				}
			},
			// 载入列表
			async loadMyList() {
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							sessionStorage.id,
							null,
							null,
							"1"
						]
					},
				}
				await Joggle.get(data)
					.then((response) => {
						if (response.indexOf("Fail:") == -1) {
							var jsonObj = JSON.parse(response);
							this.tableData = jsonObj.Data
							this.total = jsonObj.Counts
						} else {
							this.$message.warning(response);
						}
					})
					.catch((response) => {
						this.$message.error(error);
					});
			},
			// 载入
			async loadList() {
				// 级联
				this.loadType()
				// 载入个人信息
				var data = {
					"FuncCode": "GetUser",
					"Data": {
						"Params": [sessionStorage.id]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.form.Creator = jsonObj[0].Name
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 级联
			async loadType() {
				var data = {
					"FuncCode": "GetCoz",
					"Data": {
						"Params": [
							null
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.optionsFirst = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 级联
			async loadCourse() {
				this.form.Course = ""
				var data = {
					"FuncCode": "GetCoz",
					"Data": {
						"Params": [
							this.formInline.Type
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.optionsSecond = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			async getCourse() {
				this.Course = ""
				var data = {
					"FuncCode": "GetCoz",
					"Data": {
						"Params": [
							this.Type
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.optionsThrid = jsonObj
					} else {
						this.$message.warning(response);
					}
				})
			},
			// 添加试题的确定
			sureSubmit() {
				var timestamp = new Date().getTime()
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				var data = {
					"FuncCode": "AddQu",
					"Data": [
						[{
							"ID": timestamp,
							"Stem": this.form.Stem,
							"Attached": this.form.Attached,
							"Category": this.form.Category,
							"OptionA": this.form.OptionA,
							"OptionB": this.form.OptionB,
							"OptionC": this.form.OptionC,
							"OptionD": this.form.OptionD,
							"Anwser": this.form.Anwser,
							"Score": this.form.Score,
							"Course": this.form.Course,
							"Book": this.canForm.Book,
							"Chaptor": this.canForm.Chaptor,
							"Knowledge": this.canForm.Knowledge,
							"IsPublic": this.canForm.IsPublic,
							"Browses": 0,
							"Collects": 0,
							"Status": "inactive",
							"CreatorID": sessionStorage.id,
							"Creator": this.form.Creator,
							"CreateDate": time,
							"UpdateDate": time,
						}],
					]
				}
				this.$refs.form.validate(
					async (valid) => {
						if (valid) {
							Joggle.post(data)
								.then((response) => {
									if (response.indexOf("Fail:") == -1) {
										this.$message.success('添加成功');
										this.dialogFormVisible = false
										this.form.Stem = ""
										this.form.Attached = ""
										this.form.Category = ""
										this.form.OptionA = ""
										this.form.OptionB = ""
										this.form.OptionC = ""
										this.form.OptionD = ""
										this.form.Anwser = ""
										this.form.Score = ""
										this.form.Course = ""
										this.canForm.Book = ""
										this.canForm.Chaptor = ""
										this.canForm.Knowledge = ""
										this.loadList()
										this.loadMyList()
									} else {
										// this.$message.warning(response);
									}
								})
								.catch((response) => {
									this.$message.error(error);
								})
						}
					}
				)
			},
			// 分页
			async handleCurrentChange(val) {
				this.pageIndex = val.toString()
				var data = {
					"FuncCode": "GetQuList",
					"Data": {
						"Params": [
							sessionStorage.id,
							null,
							null,
							this.pageIndex
						]
					},
				}
				await Joggle.get(data).then((response) => {
					if (response.indexOf("Fail:") == -1) {
						var jsonObj = JSON.parse(response);
						this.tableData = jsonObj.Data
						this.total = jsonObj.Counts
					} else {
						this.$message.warning(response);
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	.bankMine {
		.el-table .blue-row {
			background: aliceblue;
		}

		.btn {
			height: 62px;
		}

		.block {
			padding-top: 20px;
		}

		.img {
			max-width: 300px;
		}

		.el-collapse-item__content {
			padding-bottom: 0;
		}

		.el-collapse-item__header {
			color: red;
		}

		.structure {
			display: flex;
			padding-top: 20px;

			.right {
				width: 100%;

				.group {
					line-height: 40px;
					border-bottom: 2px solid #19bbeb;
					margin: 0px 10px 20px 0px;
					font-weight: bold;
				}

				.enquire {
					display: flex;

					input {
						-webkit-appearance: none;
						background-color: #FFF;
						background-image: none;
						border-radius: 4px;
						border: 1px solid #DCDFE6;
						-webkit-box-sizing: border-box;
						box-sizing: border-box;
						color: #606266;
						display: inline-block;
						font-size: inherit;
						height: 40px;
						line-height: 40px;
						outline: 0;
						padding: 0 15px;
						-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
						transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
						width: 150px;
					}
				}
			}
		}
	}
</style>
