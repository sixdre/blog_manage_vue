<template>
	<section class="section_content">
		<h1 class="section_title">权限列表</h1>
		<div class="search_toolbar">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAddDialog">新增</el-button>
					<!-- <el-button type="primary" size="small" >批量删除</el-button> -->
				</el-form-item>
			</el-form>
		</div>

        <div class="table_container">
			<el-table class="my_table" :data="permissionList"  style="width: 100%;">
				<el-table-column type="index" width="60" label="排序">
				</el-table-column>
				<el-table-column prop="name" label="权限名">
				</el-table-column>
				<el-table-column prop="resource" label="权限">
				</el-table-column>
				<el-table-column prop="tag" label="所属分类">
					<template slot-scope="scope">
						{{scope.row.tag}}
					</template>
				</el-table-column>
				<el-table-column prop="type" label="请求类型">
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						 <el-button size="mini" @click="handleEditDialog(scope.row)">编辑</el-button> 
						<!-- <el-button size="mini" type="danger" >删除</el-button> -->
					</template>
				</el-table-column>
			</el-table>
		</div>


		<!--工具条-->
		<el-col :span="24" class="page_toolbar">
			<el-pagination 
				 layout="total, prev, pager, next"
				 background
				 :page-size="pageParams.limit" 
				 @current-change="pageChange" 
				 :total="pageParams.count" style="float:right;">
			</el-pagination>
		</el-col>	

		<!--新增界面弹框-->
		 <el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="form" :rules="rules" label-width="100px"  ref="form">
				<el-form-item label="权限名" prop="name" required>
					<el-input v-model="form.name" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="权限代码" prop="code" required>
					<el-input v-model="form.code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限路由" prop="resource" required>
					<el-input v-model="form.resource" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="是否为页面" prop="isPage" required>
                    <el-radio v-model="form.isPage" :label="true">是</el-radio>
                    <el-radio v-model="form.isPage" :label="false">否</el-radio>
				</el-form-item>
                <el-form-item label="页面地址" v-if="form.isPage" prop="menuUrl" required>
                    <el-input v-model="form.menuUrl" auto-complete="off"></el-input>
				</el-form-item>



				<el-form-item label="请求形式" prop="type" required>
					<el-radio-group v-model="form.type">
						<el-radio v-for="item in httpTypes" :key="item" :label="item"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="权限分类" prop="tag" required>
					<el-select v-model="form.tag" placeholder="请选择分类">
						<el-option
						v-for="item in menuList"
						:key="item.name"
						:label="item.name"
						:value="item.name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" v-if="isEdit" @click.native="addSubmit('update')">更新</el-button>
				<el-button type="primary" v-else @click.native="addSubmit('add')">提交</el-button>
				
			</div>
		</el-dialog> 

	</section>
</template>

<script>
export default {
	data(){
		return {
			form:{
				name:'',
				resource:'',
				type:'',
                tag:'',
                code:'',
                isPage:false
			},
			pageParams:{
				limit:5,
				page:1,
				count:null,
			},
			httpTypes:['get','post','delete','put'],
            addFormVisible:false,
			permissionList:[],
			menuList:[],
			isEdit:false,
			rules: {
				name: [
					{ required: true, message: '请输入权限名称', trigger: 'blur' }
				],
				resource: [
					{ required: true, message: '请输入请求地址', trigger: 'blur' }
				],
				type: [
					{ required: true, message: '请选择请求类型', trigger: 'change'}
				],
				tag: [
					{ required: true, message: '请选择所属分类', trigger: 'change'}
				]
			}
		}
	},
	created(){
		this.getMenus();
		this.getPermissionList()
	},
	methods:{
        handleAddDialog(){
			this.isEdit = false;
			this.addFormVisible = true;
			this.form={
				name:'',
				resource:'',
				type:'',
                tag:'',
                code:'',
                isPage:false
			}
		},
		handleEditDialog(row){
			this.isEdit = true;
			this.form._id = row._id;
			this.form.name = row.name;
			this.form.resource = row.resource;
			this.form.type = row.type;
			this.form.tag = row.tag;
			this.addFormVisible = true;
		},
		async getPermissionList(){
			try{
                let res = await this.$Api.getPermissionList(this.pageParams);
				this.permissionList = res.data.data;
				this.pageParams.count = res.data.count;
            }catch(err){

            }
		},
		pageChange(val){
			this.pageParams.page = val;
			this.getPermissionList();
		},
		async getMenus(){
            try{
                let res = await this.$Api.getMenuList()
                this.menuList = res.data.data;
            }catch(err){

            }
        },
		addSubmit(type){
			this.$refs['form'].validate(async (valid) => {
				if (valid) {
					let res;
					if(type=='add'){		
						res = await this.$Api.createPermission(this.form);
					}else {
						res = await this.$Api.updatePermission(this.form._id,this.form);
					}
					if(res.data.code===1){
						this.$message({
							showClose: true,
							message: res.data.msg,
							type: 'success'
						});
						this.addFormVisible=false;
						this.getPermissionList();
					}else{
						this.$message.error(res.data.msg);
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

</style>