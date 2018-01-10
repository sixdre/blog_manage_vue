<template>
	<section class="section">
		<div class="section_breadcrumb">
			<strong class="title">文章发布</strong>
		</div>
		<el-form ref="form" :model="form" :rules="rules" label-width="80px">
			<el-form-item label="标题" prop="title" style="width:500px" required>
				<el-input v-model="form.title" placeholder="请输入标题"></el-input>
			</el-form-item>
			<el-form-item label="简介" prop="abstract" style="width:500px">
				<el-input v-model="form.abstract" placeholder="请输入简介"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="category" style="width:500px" required>
				<el-select v-model="form.category" placeholder="请选择类型" style="width:300px">
					<el-option v-for="item in categories" :key="item._id" :label="item.name" :value="item._id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标签" prop="tags" style="width:500px" required>
				<el-select v-model="form.tags" multiple placeholder="请选择标签" style="width:300px">
					<el-option v-for="item in tags" :key="item._id" :label="item.name" :value="item._id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="封面" class="uploadItem">
				<el-upload class="avatar-uploader" 
					ref="upload"
					action="http://localhost:7893/api/upload/addFile" 
					:show-file-list="false" 
					name="file" 
					accept="image/*" 
					:on-progress="handleUploadProgress" 
					:on-success="handleUploadSuccess" 
					:before-upload="beforeUpload">
					<img v-if="form.img" :src="form.img" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<!-- <el-progress :percentage="percentage"></el-progress> -->
			</el-form-item>
			<div class="content" style="height:400px;">
				<label for="">内容</label>
				<div class="quill_wrapper">
					<quill-editor v-model="form.content"
							ref="myQuillEditor"
							:options="editorOption"
							style="height:300px;">
					</quill-editor>
				</div>
			</div>
		
			<!-- <el-form-item label="内容" prop="content" style="width:1250px;height:350px;" required>
				<quill-editor v-model="form.content"
						ref="myQuillEditor"
						:options="editorOption"
						style="height:300px;">
				</quill-editor>
			
			
			</el-form-item> -->
			<el-form-item>
				<el-button type="primary" @click="onSubmit">发布</el-button>
			</el-form-item>
		</el-form>
	</section>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		quillEditor
	},
	data() {
		return {
			form: {
				title: '111',
				abstract: 'test abstract',
				category: '',
				tags: [],
				content: '1111111',
				img:''
			},
			editorOption: {
				modules: {
					toolbar: [
						['bold', 'italic', 'underline', 'strike'],
						['blockquote', 'code-block'],
						[{ 'header': 1 }, { 'header': 2 }],
						[{ 'list': 'ordered' }, { 'list': 'bullet' }],
						[{ 'indent': '-1' }, { 'indent': '+1' }],
						[{ 'direction': 'rtl' }],
						[{ 'size': ['small', false, 'large', 'huge'] }],
						[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
						[{ 'color': [] }, { 'background': [] }],
						[{ 'align': [] }],
						['clean'],
						['link', 'image', 'video']
					]
				},
				placeholder: '输入文章内容',
			},
			percentage:0,
			rules: {
				title: [{ required: true, message: '请输入文章标题' }],
				category: [{ required: true, message: '请选择文章类型' }],
				tags: [{ type: 'array', required: true, message: '请选择文章标签' }],
				content: [{ required: true, message: '请输入文章内容' }]
			},
		}
	},
	computed: {
		...mapGetters([
			'categories',
			'tags',
		]),
	},
	created() {
		if (!this.categories.length) {
			this.getCategories();
		}
		if (!this.tags.length) {
			this.getTags();
		}
	},
	methods: {
		...mapActions('article', [
			'getCategories',
			'getTags'
		]),
		handleUploadSuccess(res, file) {
			if(res.code==1){
				this.form.img = res.url;
			}else{
				this.$message.error('文件上传失败');
			}
			this.percentage = 0;
			// this.form.img = URL.createObjectURL(file.raw);
		},
		handleUploadProgress(event){
			this.percentage = event.percent
		},
		beforeUpload(file) {
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				this.$message.error('上传图片大小不能超过 2MB!');
			}
			return isLt2M;
		},
		onSubmit() {
			this.$refs['form'].validate(async (valid) => {
				if (valid) {
					let res = await this.$Api.createArticle(this.form);
					if (res.data.code === 1) {
						this.$message({
							showClose: true,
							message: res.data.message,
							type: 'success'
						});
						this.$refs['upload'].clearFiles()
						this.$refs['form'].resetFields()
						this.form.content = ''
						this.form.img = ''
					} else {
						this.$message.error(res.data.message);
					}
				} else {
					return false;
				}
			})
		}
	}
}

</script>

<style scoped lang="less">
.uploadItem{
	.el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
} 

.avatar-uploader .el-upload:hover {
	border-color: #409EFF;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 160px;
	height: 160px;
	line-height: 160px;
	text-align: center;
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
}

.avatar {
	width: 160px;
	height: 160px;
	display: block;

}
.content{
	label{
		width: 80px;
		text-align: right;
		vertical-align: middle;
		float: left;
		font-size: 14px;
		color: #606266;
		line-height: 40px;
		padding: 0 12px 0 0;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		&:before{
			content: '*';
			color: #f56c6c;
			margin-right: 4px;
		}
	}
	.quill_wrapper{
		margin-left: 80px;
	}
}
</style>