<template>
	<section class="section_content">
		<h1 class="section_title">文件列表</h1>
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
			<el-table class="my_table" :data="tableDatas"  style="width: 100%;" height="460">
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
		<el-col :span="24" class="page_toolbar">
			<el-pagination 
				 layout="total, sizes,prev, pager, next,jumper"
				 background
				 @size-change="pageSizeChange"
				 @current-change="pageChange" 
				 :current-page.sync="pageParams.page"
				 :page-size="pageParams.limit" 
				 :total="pageParams.count" style="float:right;">
			</el-pagination>
		</el-col>	
	

	</section>
</template>

<script>
export default {
	data() {
		return {
			fileList:[],
			listApi:'getFileList',
			removeApi: 'removeArticle',		//删除api
			percentage:0
		}
	},
	created(){
		this.renderTable()
	},
	methods: { 
		async renderTable(){
			let res = await this.getTableDatas();
			if (res.data.code === 1) {
				this.pageParams.count = res.data.total;
				this.tableDatas = res.data.data;
			} else {
				this.$message.error(res.data.message);
			}
		},
		handleFileSize(size){
			let kb = size/1024;
			if(kb<1024){
				return kb.toFixed(2)+'KB';
			}else{
				return (kb/1024).toFixed(2)+'MB'
			}
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
			let res = await this.$Api.addFile(formData,(p)=>{
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
				this.renderTable();
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