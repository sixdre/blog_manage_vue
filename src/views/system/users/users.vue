<template>
	<section class="section_content">
		<h1 class="section_title">用户列表</h1>
		<div class="search_toolbar">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-button type="primary" size="small" @click="handleAddUserDialog">新增</el-button>
					<el-button type="primary" size="small" @click="onRemoveMulti" :disabled="!selectRows.length">批量删除</el-button>
                </el-form-item>
            </el-form>
        </div>
		<div class="table_container">
			<el-table :data="tableDatas" style="width: 100%;" height="460" @selection-change="selsChange">
				<el-table-column type="selection" width="55" >
				</el-table-column>
				<el-table-column type="index" width="60" label="排序">
				</el-table-column>
				<el-table-column prop="username" label="用户名称">
					<template slot-scope="scope">
						<el-badge v-if="scope.row.isAdmin" is-dot style="margin-top:5px;">
							{{scope.row.username}}
						</el-badge>
						<span v-else>{{scope.row.username}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="role_name" label="角色名称">
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
						<el-button size="small" type="danger" plain @click="handleRemove(scope.row._id)">删除</el-button>
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


		<!--新增用户界面弹框-->
        <el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="userForm" :rules="rules" label-width="80px" ref="userForm">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="userForm.username" auto-complete="off"></el-input>
                </el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="userForm.email" auto-complete="off"></el-input>
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
				<el-button type="primary" @click.native="updateUserRole">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
export default{
	data(){
		return {
			form:{
				roleId:''
			},
			userForm:{

			},
			dialogVisible:false,
			addFormVisible:false,
			tableDatas:[],
			roles:[],
			rules: {
				username: [
					{ required: true, message: '请输入用户名称', trigger: 'blur' }
				],
				email:[{
					required: true, message: '请输入邮箱', trigger: 'blur' 
				}],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				],
			},
			listApi:'getUsers',
			removeApi: 'removeUser',		//删除api
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
		this.renderTable();
	},
	methods:{
		async renderTable(){
			let res = await this.getTableDatas();
			if (res.data.code === 1) {
				this.pageParams.count = res.data.total;
				this.tableDatas = res.data.data;
			} else {
				this.$message.error(res.data.message);
			}
		},
		handleAddUserDialog(){
			this.getRoles();
			this.addFormVisible = true;
		},
		handleRoleDialog(row){
			this.getRoles();
			this.form.username=row.username;
			this.form.userId=row._id;
			this.form.roleId=row.role_id;
			this.dialogVisible = true;
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
		async updateUserRole(){
			let res = await this.$Api.updateUserRole(this.form.userId,this.form.roleId);
			if(res.data.code===1){
                this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'success'
				});
				this.renderTable();
				this.dialogVisible = false;
            }else{
                this.$message.error(res.data.message);
            }
		},
		//创建用户
		createUser(){
			this.$refs['userForm'].validate(async (valid) => {
				if (valid) {
					let res = await this.$Api.createUser(this.userForm);
					if(res.data.code===1){
						this.$message({
							showClose: true,
							message: res.data.message,
							type: 'success'
						});
						this.renderTable();
						this.addFormVisible = false;
					}else{
						this.$message.error(res.data.message);
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