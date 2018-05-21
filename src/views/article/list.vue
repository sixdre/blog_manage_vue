<template>
	<section class="section_content">
		<h1 class="section_title">文章列表</h1>
		<div class="section_filter">
			<el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
				<el-form-item label="标题" prop="title">
					<el-input class="my_input" style="width:380px" v-model="searchForm.title" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item label="作者" prop="author">
					<el-input class="my_input" style="width:200px" v-model="searchForm.author" placeholder="作者"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="category">
					<el-select class="my_input" v-model="searchForm.categoryId" clearable placeholder="">
						<el-option v-for="(item,index) in categories" :label="item.name" :value="item._id" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="flag">
					<el-select class="my_input" v-model="searchForm.flag" clearable placeholder="状态">
						<el-option label="有效" :value="2"></el-option>
						<el-option label="草稿" :value="1"></el-option>
						<el-option label="已删除" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发布时间">
					<range-time :startTime.sync="searchForm.startTime" :endTime.sync="searchForm.endTime"></range-time>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" size="small" @click="onSearch">查询</el-button>
					<el-button type="primary" icon="el-icon-refresh" size="small" @click="resetSearchForm">重置</el-button>
					<el-button type="danger" plain size="small" @click="onRemoveMulti" :disabled="!selectRows.length">批量删除</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table_container">
			<el-table class="my_table" :data="tableDatas"  style="width: 100%;" height="460" @selection-change="selsChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="author_name" label="作者">
				</el-table-column>
				<el-table-column prop="title" label="标题" width="220" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="category_name" label="分类">
				</el-table-column>
				<el-table-column prop="tag_names" label="标签">
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<el-tag type="success" disable-transitions v-if="scope.row.status===2">有效</el-tag>
						<el-tag type="info" disable-transitions v-if="scope.row.status===1">草稿</el-tag>
						<el-tag type="warning" disable-transitions v-if="scope.row.status===0">已删除</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="pv_num" label="浏览量">
				</el-table-column>
				<el-table-column prop="create_time" label="发布时间" sortable width="180">
					<template slot-scope="scope">
						{{scope.row.create_time | moment}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<div class="text-center">
							<router-link class="icon_eye" :to="{path: '/article/publish',query:{id:scope.row._id}}"></router-link>
							<span class="icon_del pointer" @click="handleRemove(scope.row._id)"></span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>

			<!--工具条-->
		<el-col :span="24" class="toolbar">
			
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
import { mapGetters, mapActions } from 'vuex';
export default{
	data(){
		return {
			searchForm:{
				flag:2
			},
			listApi:'getArticleList',
			removeApi: 'removeArticle',		//删除api
		}
	},
	computed: {
		...mapGetters([
			'categories'
		]),
	},
	created(){
		this.renderTable()
		if (!this.categories.length) {
			this.getCateTag();
		}
	},
	methods:{
		...mapActions('article', [
			'getCateTag'
		]),
		async renderTable(){
			let res = await this.getTableDatas();
			if (res.data.code === 1) {
				this.pageParams.count = res.data.total;
				this.tableDatas = res.data.data;
			} else {
				this.$message.error(res.data.message);
			}
		},
		resetSearchForm(){
			this.$refs['searchForm'].resetFields();
			this.searchForm.startTime = undefined;
			this.searchForm.endTime = undefined;
			this.pageParams={
				limit:5,
				page:1,
				count:null,
			}
			this.renderTable();
		},
	}
}

</script>

<style scoped lang="less">

</style>