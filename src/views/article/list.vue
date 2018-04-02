<template>
	<section class="section">
		<div class="section_breadcrumb">
			<strong class="title">列表</strong>
		</div>
		<div class="search_toolbar">
			<el-form :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="标题">
					<el-input v-model="searchForm.title" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="searchForm.flag" clearable placeholder="状态">
						<el-option label="全部" value="3"></el-option>
						<el-option label="有效" value="2"></el-option>
						<el-option label="草稿" value="1"></el-option>
						<el-option label="已删除" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" size="small" @click="onSearch">查询</el-button>
					<el-button type="primary" icon="el-icon-refresh" size="small" @click="onRefresh"></el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table_container">
			<el-table :data="articles"  style="width: 100%;" @selection-change="selsChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="author.username" label="作者"  width="120">
				</el-table-column>
				<el-table-column prop="title" label="标题" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="category.name" label="分类"  width="120">
				</el-table-column>
				<el-table-column label="状态" width="120">
					<template slot-scope="scope">
						<el-tag type="success" disable-transitions v-if="scope.row.status===2">有效</el-tag>
						<el-tag type="info" disable-transitions v-if="scope.row.status===1">草稿</el-tag>
						<el-tag type="warning" disable-transitions v-if="scope.row.status===0">已删除</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="nums.pv" label="浏览量" sortable width="120">
				</el-table-column>
				
				<el-table-column prop="create_time" label="发布时间" sortable  width="200">
					<template slot-scope="scope">
						{{scope.row.create_time | moment}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<router-link :to="{path: '/article/publish',query:{id:scope.row._id}}">查看</router-link>
						<el-button type="danger" size="small" @click="handleDel(scope.row._id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

			<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button size="small" @click="removeMulti" :disabled="!checkRows.length">批量删除</el-button>
			<el-pagination 
				 layout="total, prev, pager, next"
				 background
				 @current-change="pageChange" 
				 :current-page.sync="pageParams.page"
				 :page-size="pageParams.limit" 
				 :total="pageParams.count" style="float:right;">
			</el-pagination>
		</el-col>	



	</section>
</template>

<script>

export default{
	data(){
		return {
			searchForm:{
				title:'',
				flag:''
			},
			pageParams:{
				limit:5,
				page:1,
				count:null,
			},
			articles:[],
			checkRows:[]
		}
	},
	created(){
		this.getArticleList()
	},
	methods:{
		async getArticleList(){
			let params = {
				title:this.searchForm.title,
				page:this.pageParams.page,
				limit:this.pageParams.limit,
				flag:this.searchForm.flag
			}
			let res = await this.$Api.getArticleList(params);
			this.pageParams.count = res.data.total;
			this.articles = res.data.data;
		},
		selsChange(val) {
			this.checkRows = val;
		},
		pageChange(val){
			this.pageParams.page = val;
			this.getArticleList();
		},
		//查询
		onSearch(){
			this.pageParams.page=1;
			this.getArticleList();
		},
		onRefresh(){
			this.searchForm={
				title:'',
				flag:'3'
			}
			this.pageParams={
				limit:5,
				page:1,
				count:null,
			}
			this.getArticleList();
		},
		removeMulti(){
			let ids = this.checkRows.map(item => item._id).toString();
			this.handleDel(ids)
		},
		//删除当前记录
		handleDel(id) {
			this.$removeDialog(async ()=>{
				let res = await this.$Api.removeArticle(id);
				if(res.data.code==1){
					this.$message({
						message: res.data.message,
						type: 'success'
					});
					this.getArticleList();
				}else{
					this.$message.error(res.data.message);
				}
			})
		},
	}
}

</script>

<style scoped lang="less">

</style>