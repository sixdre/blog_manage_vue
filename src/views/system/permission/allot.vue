<template>
    <section class="section">
        <div class="section_breadcrumb">
            <strong class="title">权限分配</strong>
        </div>
        <div class="search_toolbar">
            <el-form label-width="80px" style="width:200px">
                <el-form-item label="角色名称">
                    <el-input v-model="role.id" :disabled="true" readonly></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-card>
            <div slot="header" class="clearfix">
                <span>菜单分配（前端显示）</span>
            </div>
            <el-tree :data="menuList" show-checkbox default-expand-all 
                node-key="_id" ref="tree" 
                :props="defaultProps" 
                :check-strictly="true" 
                highlight-current 
                :expand-on-click-node="false" >
            </el-tree>
        </el-card>

        <el-card style="margin-top:40px;">
            <div slot="header" class="clearfix">
                <span>资源分配（后台请求）</span>
            </div>
            <el-row class="resource_wrapper">
                <el-col :span="8" v-for="(item,index) in resourceList" :key="index" ref="resource">
                    <h4 class="title">{{item._id}}</h4>
                    <ul v-if="item.data&&item.data.length">
                        <li v-for="(val,i) in item.data" :key="i">
                            <el-checkbox v-model="resourceIds" :label="val._id">{{val.name}}</el-checkbox>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </el-card>

        <div style="text-align:center;margin-top:20px;">
            <el-button @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            role: {
                id: null,
                name: null,
            },
            resourceList: [],
            resourceIds:[],
            menuList: [],
            defaultProps: {
                children: 'child',
                label: 'name'
            },
        }
    },
    created() {
        this.role.id = this.$route.query.id;
        this.getPermissionList();
        this.getRolePermission();
        this.getMenuList();
    },
    methods: {
        handleAddDialog() {
            this.addFormVisible = true;
        },
        async getMenuList(){
            let res = await this.$Api.getMenuList();
            this.menuList =  res.data.data;
        },
        async getRolePermission(){
            let roleId = this.role.id;
            let res = await this.$Api.getRolePermission(roleId);
            if(res.data.code==1){
                this.resourceIds = res.data.permissionIds;
                this.$nextTick(()=>{
                    this.$refs.tree.setCheckedKeys(res.data.menuIds);
                })
            }else{
                this.$message.error(res.data.msg);
            }
        },
        async getPermissionList() {
            let group = 1;
            let res = await this.$Api.getPermissionList({group});
            this.resourceList = res.data.data;
        },
        async submit() {
            let roleId = this.role.id;
            let menus = this.$refs.tree.getCheckedKeys();
            let resource = this.resourceIds;
            let res = await this.$Api.saveRolePermission(roleId, menus, resource);
            if (res.data.code === 1) {
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'success'
                });
                this.$router.push('/permission/role')
            } else {
                this.$message.error(res.data.msg);
            }
        }
    }
}

</script>

<style scoped lang="less">
.resource_wrapper{
    h4{
        margin-bottom: 15px;
    }
    li{
        margin-bottom: 10px;
        label{
            font-size: 14px;
            vertical-align: top;
        }
    }
}
</style>