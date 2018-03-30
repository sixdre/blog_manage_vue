<template>
	<section class="section">
		<div class="section_breadcrumb">
			<strong class="title">文章发布</strong>
		</div>
		
		<el-form ref="form" :model="form" :rules="rules" label-width="80px">
			<el-form-item label="标题" prop="title" style="width:500px" required>
				<el-input v-model="form.title" placeholder="请输入标题"></el-input>
			</el-form-item>
			<el-form-item label="分类" prop="categoryName" required style="width:500px">
				<el-select @change="changeCategory" v-model="form.categoryName" allow-create filterable placeholder="请选择文章的分类" style="width:300px">
					<el-option v-for="item in categories" :key="item._id" :label="item.name" :value="item.name">
					</el-option>
				</el-select>
			</el-form-item>
			<div class="content" style="margin-bottom:20px;">
				<label for="">内容</label>
				<x-editor :content.sync="form.content" ref="mdEditor"></x-editor>
			</div>
			<el-form-item label="简介" prop="abstract" style="width:600px">
				<el-input type="textarea" :rows="3"  v-model="form.abstract" placeholder="选取文章的摘要"></el-input>
			</el-form-item>
			<el-form-item label="标签" prop="tags" style="width:500px">
				<el-select @change="changeTag" v-model="form.tagNames" allow-create filterable default-first-option multiple placeholder="选择标签(最多不超过3个)" style="width:300px">
					<el-option v-for="item in tags" :key="item._id" :label="item.name" :value="item.name">
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
			
			<el-form-item label="允许评论" prop="allow_comment" style="width:500px">
				<el-tooltip :content="commentTip" placement="top">
					<el-switch
						v-model="form.allow_comment"
						active-color="#13ce66">
					</el-switch>
				</el-tooltip>
			</el-form-item>
			<el-form-item label="是否私有" prop="is_private" style="width:500px">
				<el-tooltip :content="privateTip" placement="top">
					<el-switch
						v-model="form.is_private"
						active-color="#13ce66">
					</el-switch>
				</el-tooltip>
			</el-form-item>

			<el-form-item>
				<div  v-if="isUpdate" >
					<el-button type="default" @click="onCancel">取消</el-button>
					<el-button type="primary" @click="onUpdate">更新</el-button> 
				</div>
				<el-button v-else type="primary" @click="onSubmit">发布</el-button>
			</el-form-item>
		</el-form>
	</section>
</template>

<script>
import xEditor from '@/components/editor'
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		xEditor
	},
	data() {
		return {
			articleId:'',
			form: {
				is_private:false,
				allow_comment:true,
				tagNames: [],
				categoryName:'',
				content: '',
			},
			percentage:0,
			rules: {
				title: [{ required: true, message: '请输入文章标题' }],
				categoryName: [{ required: true, message: '请选择文章分类' }],
				content: [{ required: true, message: '请输入文章内容' }]
			},
		}
	},
	computed: {
		...mapGetters([
			'categories',
			'tags',
		]),
		isUpdate(){
			return this.articleId&&this.articleId.length===24;
		},
		privateTip(){
			if(this.form.is_private){
				return '只本人可见'
			}else{
				return '公开'
			}
		},
		commentTip(){
			if(this.form.allow_comment){
				return '允许'
			}else{
				return '不允许'
			}
		}
	},
	created() {
		let id = this.$route.query.id;
		if(id){
			this.$Api.getArticleInfo(id).then(res=>{
				if(res.data.code===1){
					this.articleId = res.data.data._id;
					this.form.title = res.data.data.title;
					this.form.categoryName = res.data.data.category.name;
					this.form.tagNames = res.data.data.tagNames;
					this.form.img = res.data.data.img;
					this.form.abstract = res.data.data.abstract;
					this.form.content = res.data.data.content;
					this.form.is_private = res.data.data.is_private;
					this.form.allow_comment = res.data.data.allow_comment;
				}
			})
		}
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
		changeTag(val){
			if(val.length){
				if(val.length<4){
					var lastTag = val[val.length-1];
					if(lastTag.length>10){
						this.$message.error('请输入不得超过10个字符');
						val.pop()
					}
				}else{
					this.$message.error('最多只能选择3个标签');
					val.pop()
				}
			}
		},
		changeCategory(val){
			if(val.length>10){
				this.$message.error('请输入不得超过10个字符');
				this.form.category = '';
			}
		},
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
		onCancel(){
			this.$router.push('/article/list');
		},
		onSubmit() {
			if(!this.form.content.length){
				this.$message.error('请输入文章内容');
				return
			}
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
						this.$refs['form'].resetFields();
						this.$refs['mdEditor'].clear()
					} else {
						this.$message.error(res.data.message);
					}
				} else {
					return false;
				}
			})
		},
		onUpdate(){
			this.$refs['form'].validate(async (valid) => {
				if (valid) {
					let res = await this.$Api.updateArticle(this.articleId,this.form);
					if (res.data.code === 1) {
						this.$message({
							showClose: true,
							message: res.data.message,
							type: 'success'
						});
						setTimeout(()=>{
							this.$router.push('/article/list');
						},500)
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