<template>
	<section class="section">
		<div class="section_breadcrumb">
			<strong class="title">文件列表</strong>
		</div>
		<div class="search_toolbar">
			<el-form :inline="true"  class="demo-form-inline">
				<el-form-item >
					<el-input v-model="searchForm.filename" placeholder="输入文件名称进行搜索"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" size="small" @click="onSearch">查询</el-button>
				</el-form-item>

				<el-form-item>
					<el-upload style="width:300px;" 
							action="http://localhost:7893/api/upload/addFile"
							multiple 
							:on-progress="handleProgress"
							ref="upload" 
							:auto-upload="false" :file-list="fileList">
						<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
						<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
						<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
					</el-upload>
					<el-progress :percentage="percentage" :show-text="false"></el-progress>
				</el-form-item>
			</el-form>
		</div>
		<div class="table_container">
			<el-table :data="fileData"  style="width: 100%;" height="460">
				<el-table-column type="index" width="60" label="排序">
				</el-table-column>
				<el-table-column prop="filename" width="200" show-overflow-tooltip label="文件名称">
				</el-table-column>
				<el-table-column prop="filetype" width="150" label="文件类型">
				</el-table-column>
				<el-table-column label="文件大小" width="150">
					<template slot-scope="scope">
						{{handleFileSize(scope.row.filesize)}}
					</template>
				</el-table-column>
				<el-table-column label="文件路径">
					<template slot-scope="scope">
						{{scope.row.filepath}}
					</template>
				</el-table-column>
				<el-table-column prop="create_time" label="上传时间" >
					<template slot-scope="scope">
						{{scope.row.create_time | moment}}
					</template>
				</el-table-column>
				<el-table-column width="150">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-view"></el-button>
						<el-button type="primary" size="mini" icon="el-icon-download" @click="download(scope.row)"></el-button>
						<!-- <i class="el-icon-view"></i>
						<i class="el-icon-download"></i> -->
						
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!--工具条-->
		<div class="toolbar clear">
			<el-pagination layout="total, sizes,prev, pager, next,jumper"
			 background @current-change="pageChange" 
			  @size-change="pageSizeChange"
			 :current-page.sync="pageParams.page" 
			 :page-sizes="[10, 20, 50, 100]"
			 :page-size="pageParams.limit" :total="pageParams.count" style="float:right;">
			</el-pagination>
		</div>

	</section>
</template>

<script>
export default {
	data() {
		return {
			searchForm:{},
			pageParams:{
				limit:5,
				page:1,
				count:null,
			},
			fileData:[],
			fileList:[],
			percentage:0
		}
	},
	created(){
		this.getData()
	},
	methods: { 
		handleFileSize(size){
			let kb = size/1024;
			if(kb<1024){
				return kb.toFixed(2)+'KB';
			}else{
				return (kb/1024).toFixed(2)+'MB'
			}
		},
		onSearch(){
			this.getData()
		},
		pageChange(val){
			this.pageParams.page = val;
			this.getData();
		},
		pageSizeChange(val){
			this.pageParams.limit = val;
			this.getData();
		},
		async getData(){
			let params = {
				page:this.pageParams.page,
				limit:this.pageParams.limit,
				filename:this.searchForm.filename
			}
			let res = await this.$Api.getFileList(params);
			this.fileData = res.data.data;
			this.pageParams.count = res.data.count;
		},
		async submitUpload() {
			var formData = new FormData();
			var uploadFiles = this.$refs.upload.uploadFiles;
			if(!uploadFiles.length){
				this.$message.warning('请选择文件');
				return ;
			}
			uploadFiles.forEach((file)=>{
				formData.append('file',file.raw);
			});
			let res = await this.$Api.upload(formData,(p)=>{
				let loaded = p.loaded,
				total = p.total;
				this.$nextTick(() =>{
					this.percentage = (loaded/total) * 100;
				})
			});
			if(res.data.code==1){
				this.$message.success(res.data.message);
				this.$refs.upload.clearFiles();
				this.percentage = 0;
				this.pageParams.page = 1;
				this.getData();
			}else{
				this.$message.error(res.data.message);
			}
			// this.$refs.upload.submit();
		},
		download(item){
			window.location.href = item.filepath;
		},
		handleProgress(event){
			this.percentage = event.percent
		}
	}
}
</script>

<style lang="less" scoped>

</style>