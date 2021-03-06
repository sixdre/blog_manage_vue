<template>
	<section class="section">
        <el-card>
            <div slot="header" class="clearfix">
                <span>菜单列表</span>
                <el-button style="float: right; padding: 3px 0" @click="handleAddDialog" type="text">创建菜单</el-button>
            </div>
            <el-tree :data="menuList"
            show-checkbox
                default-expand-all 
                node-key="_id"
                ref="tree"
                :props="defaultProps"
                :check-strictly="true"
                highlight-current
                :expand-on-click-node="false"
                :render-content="renderContent"
                >
            </el-tree>
        </el-card> 


        <!--新增界面弹框-->
		<el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="form" :rules="rules" label-width="80px"  ref="form">
				<el-form-item label="菜单名称" prop="name" required>
					<el-input v-model="form.name" ></el-input>
				</el-form-item>
				<el-form-item label="菜单地址" prop="path" required>
					<el-input v-model="form.path" ></el-input>
				</el-form-item>
                <el-form-item label="菜单图标" prop="icon">
					<el-input v-model="form.icon" ></el-input>
				</el-form-item>
                <el-form-item label="所属父级" prop="pid" >
                    <el-select v-model="form.pid" placeholder="请选择">
                        <el-option
                        v-for="item in parents"
                        :key="item.name"
                        :label="item.name"
                        :value="item._id">
                        </el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="form.sort" controls-position="right" :min="1" :max="100"></el-input-number>
				</el-form-item>
                
                <el-form-item label="是否隐藏" prop="hidden">
					<el-radio-group v-model="form.hidden">
                        <el-radio :label="false">否</el-radio>
                        <el-radio :label="true">是</el-radio>
                    </el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" v-if="isEdit" @click.native="updateMenu">更新</el-button>
                <el-button type="primary" v-else @click.native="createMenu">提交</el-button>
			</div>
		</el-dialog> 


	</section>
</template>

<script>
import zTree from '@/components/ztree'
export default{
    components: {
        zTree
    },
	data(){
		return {
            form:{
                name:'',
                path:'',
                pid:'0',
                sort:1,
                icon:'',
                hidden:0
            },
            menuId:'',
            menuList:[],
            parents:[],
            addFormVisible:false,
            isEdit:false,
            defaultProps: {
                children: 'child',
                label: 'name'
            },
            rules: {
				name: [
					{ required: true, message: '请输入菜单名称'}
				],
				path: [
					{ required: true, message: '请输入菜单地址'}
				],
			}
		}
	},
	created(){
        this.getMenus();
	},
	methods:{
        //获取前端菜单列表
        async getMenus(){
            let res = await this.$Api.getMenuList()
            this.menuList = res.data.data;
            this.parents = res.data.parents;
        },
        handleAddDialog(){
            this.isEdit = false;
			this.addFormVisible = true;
			this.form={
				name:'',
                path:'',
                pid:'0',
                sort:1,
                icon:'',
                hidden:false
			}
        },
        handleEditDialog(data){
            this.isEdit = true;
            this.addFormVisible = true;
            this.menuId = data._id;
            this.form.pid=data.pid; 
            this.form.name=data.name;
            this.form.path=data.path;
            this.form.icon=data.icon;
            this.form.sort=data.sort; 
            this.form.hidden=data.hidden;
        },
        //创建菜单
        createMenu(){
            this.$refs['form'].validate(async (valid) => {
				if (valid) {
					let res = await this.$Api.createMenu(this.form)
                    if(res.data.code==1){
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.addFormVisible=false;
                        this.getMenus();
                    }else{
                        this.$message.error(res.data.msg);
                    }
				} else {
					return false;
				}
			})
        },
        //更新菜单
        updateMenu(){
            this.$refs['form'].validate(async (valid) => {
				if (valid) {
					let res = await this.$Api.updateMenu(this.menuId,this.form)
                    if(res.data.code==1){
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.addFormVisible=false;
                        this.getMenus();
                    }else{
                        this.$message.error(res.data.msg);
                    }
				} else {
					return false;
				}
			})
        },
        //删除菜单
        async removeMenu(id){
            let res = await this.$Api.removeMenu(id);
            if(res.data.code==1){
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'success'
                });
                this.getMenus();
            }else{
                this.$message.error(res.data.msg);
            }
        },
        renderContent(h, { node, data, store }) {
            return h('span',{attrs:{style:"display: flex;font-size: 14px;justify-content: space-between;width:100%;"}},[
                h('span',node.label),
                h('span',[
                    h('el-button',{attrs:{type:"text",style:'font-size:12px;padding:0 20px;'},on:{
                        click:($event)=>{
                            this.handleAddDialog();
                            this.form.pid = data._id;
                        }
                    }},'添加'),
                    h('el-button',{attrs:{type:"text",style:'font-size:12px;padding:0 20px;'},on:{
                        click:($event)=>{
                            this.handleEditDialog(data)
                        }
                    }},'编辑'),
                    h('el-button',{attrs:{type:"text",style:'font-size:12px;padding:0 20px;'},on:{
                        click:($event)=>{
                            this.$confirm('确定删除吗?', '提示', {
                                type: 'warning'
                            }).then(() => {
                               this.removeMenu(data._id);
                            }).catch(() => {

                            });
                        }
                    }},'删除'),
                 ])
            ])
        }
	}
}

</script>

<style scoped lang="less">

</style>