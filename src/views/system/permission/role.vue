<template>
    <section class="section_content">
        <h1 class="section_title">角色管理</h1>
        <div class="search_toolbar">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-button type="primary" size="small" @click="handleAddDialog">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table :data="roles" style="width: 100%;">
                <el-table-column type="index" width="60" label="排序">
                </el-table-column>
                <el-table-column prop="name" label="角色名称">
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
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <router-link tag="el-button" style="padding:9px 15px;font-size:12px" v-if="!scope.row.menuIds" :to="{path: '/permission/allot',query:{id:scope.row._id}}">分配权限</router-link>
                        <router-link tag="el-button" style="padding:9px 15px;font-size:12px" v-else :to="{path: '/permission/allot',query:{id:scope.row._id}}">修改权限</router-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--新增界面弹框-->
        <el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="form" label-width="80px" ref="form">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
export default {
    data() {
        return {
            form: {
                name: null
            },
            role: {
                id: null,
                name: null,
            },
            dialogVisible: false,
            addFormVisible: false,
            isEdit: false,   //是否为更新编辑
            roles: []
        }
    },
    computed: {
        dialogTitle() {
            if (this.isEdit) {
                return '编辑'
            } else {
                return '新增'
            }
        }
    },
    created() {
        this.getRoles();
    },
    methods: {
        handleAddDialog() {
            this.addFormVisible = true;
        },
        //获取所有的角色
        async getRoles() {
            let res = await this.$Api.getRoles();
            if (res.data.code === 1) {
                this.roles = res.data.data;
            } else {
                this.$message.error(res.data.msg);
            }
        },
        //新增角色
        async addSubmit() {
            let roleName = this.form.name;
            let res = await this.$Api.createRole(roleName);
            if (res.data.code === 1) {
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'success'
                });
                this.addFormVisible = false,
                    this.getRoles();
            } else {
                this.$message.error(res.data.msg);
            }
        }
    }
}

</script>

<style scoped lang="less">

</style>