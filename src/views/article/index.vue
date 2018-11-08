<template>
	<section class="section_content">
        <div class="container-fluid">
            <div class="block-header">
                <div class="row">
                    <div class="col-lg-5 col-md-8 col-sm-12">                        
                        <h2>Inbox</h2>
                    </div>            
                </div>
            </div>

            <div class="row clearfix mail-inbox">
                <div class="col-lg-3 col-md-4">
                    <div class="card">
                        <div class="mobile-left">
                            <a class="btn btn-primary toggle-email-nav collapsed" data-toggle="collapse" href="#email-nav" role="button" aria-expanded="false" aria-controls="email-nav">
                                <span class="btn-label">
                                    <i class="la la-bars"></i>
                                </span>
                                Menu
                            </a>
                        </div>
                        <div class="mail-left collapse" id="email-nav">
                            <div class="mail-compose m-b-20">
                                <a href="app-compose.html" class="btn btn-danger btn-block">Compose</a>
                            </div>
                            <div class="mail-side">
                                <ul class="nav">
                                    <li @click="changeTab('','categoryId')" :class="{active:searchForm.categoryId==''}">
                                        <a href="javascript:void(0);">
                                            <i class="icon-envelope"></i>全部
                                            <span class="badge badge-primary float-right">{{pageParams.count}}</span>
                                        </a>
                                    </li>
                                    <!-- <li @click="changeTab('good','type')" :class="{active:searchForm.type=='good'}">
                                        <a href="javascript:void(0);">
                                            <i class="icon-envelope"></i>精华
                                            <span class="badge badge-primary float-right">{{pageParams.count}}</span>
                                        </a>
                                    </li> -->
                                    <li @click="changeTab(item._id,'categoryId')" :class="{active:searchForm.categoryId==item._id}" v-for="item in categoryList" :key="item._id">
                                        <a href="javascript:void(0);">
                                            <i class="icon-envelope"></i>{{item.name}}
                                            <span class="badge badge-primary float-right" v-if="item.count>0">{{item.count}}</span>
                                        </a>
                                    </li>
                                    <!-- <li><a class="active" href="javascript:void(0);"><i class="icon-cursor"></i>Sent</a></li>
                                    <li><a href="javascript:void(0);"><i class="icon-envelope-open"></i>Draft<span class="badge badge-info float-right">3</span></a></li>
                                    <li><a href="javascript:void(0);"><i class="icon-action-redo"></i>Outbox</a></li>
                                    <li><a href="javascript:void(0);"><i class="icon-star"></i>Starred<span class="badge badge-warning float-right">6</span></a></li>
                                    <li><a href="javascript:void(0);"><i class="icon-trash"></i>Trash<span class="badge badge-danger float-right">9</span></a></li> -->
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9 col-md-8">
                    <div class="card">
                        <div class="mail-right">
                            <div class="header d-flex align-center">
                                <h2>Inbox</h2>
                                <form class="ml-auto">
                                    <div class="input-group">
                                        <input type="text" class="form-control" placeholder="搜索文章标题或者作者">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="search-mail"><i class="icon-magnifier"></i></span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="mail-action clearfix">
                                <div class="pull-left">
                                    <div class="btn-group">
                                        <a href="javascript:void(0);" class="btn btn-outline-secondary btn-sm hidden-sm" >刷新</a>
                                    </div>
                                    <el-dropdown>
                                        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button">操作</button>
                                        <el-dropdown-menu slot="dropdown">
                                            <div class="el-dropdown-menu__item" @click="onRemoveMulti">删除</div>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </div>
                            <div class="mail-list">
                                <div class="text-center m-b-20" v-if="!dataList.length">暂无数据</div>
                                <ul class="list-unstyled">
                                    <li class="clearfix" v-for="(item,index) in dataList" :key="index">
                                        <div class="mail-detail-left">
                                            <el-checkbox name="select" :label="item._id" v-model="selectRows" size="medium">{{item.sscsacasc}}</el-checkbox>
                                            <!-- <a href="javascript:void(0);" class="mail-star active"><i class="fa fa-star"></i></a> -->
                                            <img :src="item.author.avatar" class="rounded" :alt="item.author.username">
                                        </div>
                                        <div class="mail-detail-right">
                                            <h6 class="sub m-b-10"><a href="javascript:void(0);" class="mail-detail-expand">{{item.title}}</a></h6>
                                            <p class="dep">
                                                <span class="m-r-10 text-success">[{{item.category_name}}]</span>
                                                {{item.abstract}}
                                            </p>
                                            <span class="time">{{item.create_time | moment}}</span>
                                        </div>
                                        <div class="hover-action">
                                            <a class="btn btn-warning mr-2" href="javascript:void(0);"><i class="fa fa-archive"></i></a>
                                            <button type="button" @click="handleRemove(item._id)" data-type="confirm" class="btn btn-danger js-sweetalert" title="Delete"><i class="fa fa-trash-o"></i></button>
                                        </div>
                                    </li>
                                 
                                </ul>
                            </div>
                            
                        </div>
                    </div>
                    <div :span="24" class="page_toolbar">
                        <el-pagination 
                            layout="total, sizes,prev, pager, next,jumper"
                            background
                            @size-change="pageSizeChange"
                            @current-change="pageChange" 
                            :current-page.sync="pageParams.page"
                            :page-size="pageParams.limit" 
                            :total="pageParams.count" style="float:right;">
                        </el-pagination>
                    </div>	
                </div>
            </div>            
        </div>

	</section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default{
	data(){
		return {
            dataList:[],
            selectRows:[],
			searchForm:{
                title:'',
                type:'',
                author:'',
                categoryId:'',
                status:3,
                startTime:'',
                endTime:''
            },
            categoryList:[]
		}
	},
	created(){
        this.getCategories()
		this.getData()
	},
	methods:{
        async getData(){
            let params = {
                ...this.searchForm,
                page : this.pageParams.page,
                limit : this.pageParams.limit
            }
            let res = await this.$Api['getArticleList'](params);
            if (res.data.code === 1) {
                this.pageParams.count = res.data.total;
				this.dataList = res.data.data;
            } else {
                this.$message.error(res.data.message);
            }
        },
        async getCategories(){
            let res = await this.$Api.getCategoryList({type:'group'});
            if (res.data.code === 1) {
                this.categoryList = res.data.data;
            } else {
                this.$message.error(res.data.message);
            }
        },
        changeTab(val,name){
            this.searchForm.type = '';
            this.searchForm[name] = val;
            this.pageParams.page=1;
            this.getData()
        },
        async removeData(ids) {
            let res = await this.$Api['removeArticle'](ids);
            if (res.data.code === 1) {
                this.$message.success(res.data.message);
                this.getData();
            } else {
                this.$message.error(res.data.message);
            }
        },
        //删除
        handleRemove(id) {
            this.$removeDialog(() => {
                this.removeData(id)
            })
        },
        //批量删除
        onRemoveMulti() {
            if (!this.selectRows.length) {
                return this.$message.warning('请选择所要删除的数据');
            }
            let params = this.selectRows.toString();
            this.handleRemove(params);
        },
        pageChange(val) {
            this.pageParams.page = val;
            this.getData();
        },
        pageSizeChange(val) {
            this.pageParams.limit = val;
            this.getData();
        },
	}
}

</script>

<style scoped lang="less">
@import './style.less';
</style>