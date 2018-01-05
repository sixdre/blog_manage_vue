<template>
	<section class="section">
		<div class="section_breadcrumb">
			<strong class="title">用户列表</strong>
		</div>
		<div class="search_toolbar">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-button type="primary" size="small" @click="handleAddUserDialog">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
		<div class="table_container">
			<el-table :data="users" style="width: 100%;" @selection-change="selsChange">
				<el-table-column type="selection" width="55" >
				</el-table-column>
				<el-table-column type="index" width="60" label="排序">
				</el-table-column>
				<el-table-column prop="username" label="用户名称">
					<template slot-scope="scope">
						<el-badge v-if="scope.row.roleSuper" is-dot style="margin-top:5px;">
							{{scope.row.username}}
						</el-badge>
						<span v-else>{{scope.row.username}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="roleName" label="角色名称">
				</el-table-column>
				<el-table-column prop="createdAt" label="创建时间">
					<template slot-scope="scope">
						{{scope.row.createdAt | moment}}
					</template>
				</el-table-column>
				<el-table-column prop="updatedAt" label="更新时间">
					<template slot-scope="scope">
						{{scope.row.updatedAt | moment}}
					</template>
				</el-table-column>
				<el-table-column label="操作" >
					<template slot-scope="scope" v-if="!scope.row.roleSuper">
						<el-button size="small" plain v-if="!scope.row.roleId" @click="handleRoleDialog(scope.row)">分配角色</el-button>
                        <el-button size="small" plain v-else @click="handleRoleDialog(scope.row)">修改角色</el-button>
						<el-button size="small" type="danger" plain @click="removeUser(scope.row._id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button size="small" @click="removeUserMulti" :disabled="!selectUsers.length">批量删除</el-button>
			<el-pagination 
				 layout="total, prev, pager, next"
				 background
				 :page-size="pageParams.limit" 
				 @current-change="pageChange" 
				 :total="pageParams.count" style="float:right;">
			</el-pagination>
		</el-col>	

		<!--新增用户界面弹框-->
        <el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="userForm" :rules="rules" label-width="80px" ref="userForm">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="userForm.username" auto-complete="off"></el-input>
                </el-form-item>
				<el-form-item label="密码" prop="password">
                    <el-input v-model="userForm.password" auto-complete="off"></el-input>
                </el-form-item>
				<el-form-item label="角色名称" prop="roleId">
					<el-select v-model="userForm.roleId" placeholder="请选择">
						<el-option
							v-for="role in roles"
							:key="role.name"
							:label="role.name"
							:value="role._id">
						</el-option>
					</el-select>
				</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="createUser">提交</el-button>
            </div>
        </el-dialog>

        <!--分配权限弹框  -->
        <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form :model="form" label-width="80px"  ref="form">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="form.username" readonly :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="角色名称" prop="roleId">
					<el-select v-model="form.roleId" placeholder="请选择">
						<el-option
							v-for="role in roles"
							:key="role.name"
							:label="role.name"
							:value="role._id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		   	<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
export default{
	data(){
		return {
			form:{
				username:'',
				userId:'',
				roleId:''
			},
			userForm:{
				username:'',
				password:'',
				roleId:''
			},
			pageParams:{
				limit:8,
				page:1,
				count:null,
			},
			dialogVisible:false,
			addFormVisible:false,
			users:[],
			roles:[],
			rules: {
				username: [
					{ required: true, message: '请输入用户名称', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				],
				roleId: [
					{ required: true, message: '请选择角色分类' }
				]
			},
			selectUsers:[]
		}
	},
	computed:{
		dialogTitle(){
			if(this.isEdit){
				return '编辑'
			}else{
				return '新增'
			}
		}
	},
	created(){
		this.getUsers();
	},
	methods:{
		handleAddUserDialog(){
			this.getRoles();
			this.addFormVisible = true;
		},
		handleRoleDialog(row){
			this.getRoles();
			this.form.username=row.username;
			this.form.userId=row._id;
			this.form.roleId=row.roleId;
			this.dialogVisible = true;
		},
		pageChange(val){
			this.pageParams.page = val;
			this.getUsers();
		},
		selsChange(val) {
			this.selectUsers = val;
		},
        //获取用户列表
        async getUsers(){
		    let res = await this.$Api.getUsers(this.pageParams);
            if(res.data.code===1){
				this.users = res.data.data;
				this.pageParams.count = res.data.count;
            }else{
                this.$message.error(res.data.msg);
            }
        },
        //获取所有的角色
        async getRoles(){
			if(this.roles.length>0){
				return ;
			}
            let res = await this.$Api.getRoles();
            if(res.data.code===1){
                this.roles = res.data.data;
            }else{
                this.$message.error(res.data.msg);
            }
        },
		async addSubmit(){
			let res = await this.$Api.updateUserRole(this.form.userId,this.form.roleId);
			if(res.data.code===1){
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'success'
				});
				this.getUsers();
				this.dialogVisible = false;
            }else{
                this.$message.error(res.data.msg);
            }
		},
		//删除用户
		removeUser(id){
			this.$confirm('确定删除吗?', '提示', {
				type: 'warning',
			}).then(async () => {
				let res = await this.$Api.removeUser(id);
				if(res.data.code===1){
					this.$message({
						showClose: true,
						message: res.data.msg,
						type: 'success'
					});
					this.getUsers();
				}else{
					this.$message.error(res.data.msg);
				}
			}).catch(() => {

			});
		},
		//批量删除用户
		removeUserMulti(){
			let ids = this.selectUsers.map(item => item.id).toString();
			this.removeUser(ids);
		},
		//创建用户
		createUser(){
			this.$refs['userForm'].validate(async (valid) => {
				if (valid) {
					let res = await this.$Api.createUser(this.userForm);
					if(res.data.code===1){
						this.$message({
							showClose: true,
							message: res.data.msg,
							type: 'success'
						});
						this.getUsers();
						this.addFormVisible = false;
					}else{
						this.$message.error(res.data.msg);
					}
				}else{
					return false;
				}
			})
		}
	}
}

</script>

<style scoped lang="less">

</style>