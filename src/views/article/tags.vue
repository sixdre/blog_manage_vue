<template>
    <section class="section">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>分类列表</span>
            </div>
            <div :key="cate._id" v-for="cate in categories" class="item">
                <el-tag  closable :disable-transitions="false" @close="handleRemoveCate(cate._id)">
                    {{cate.name}}
                </el-tag>
            </div>
            <div  class="item">
                <el-input class="input-new-tag" v-if="cateVisible" v-model="cateValue" 
                    ref="saveCateInput" size="small" @keyup.enter.native="createCateConfirm" @blur="createCateConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showCateInput">+ New</el-button>
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>标签列表</span>
            </div>
            <div :key="tag._id" v-for="tag in tags" class="item">
                <el-tag  closable :disable-transitions="false" @close="handleRemoveTag(tag._id)">
                    {{tag.name}}
                </el-tag>
            </div>
            <div  class="item">
                <el-input class="input-new-tag" v-if="tagVisible" v-model="tagValue" 
                    ref="saveTagInput" size="small" @keyup.enter.native="createTagConfirm" @blur="createTagConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ New</el-button>
            </div>
        </el-card>
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            tagVisible: false,
            tagValue: '',
            cateVisible: false,
            cateValue: ''
        };
    },
    computed: {
		...mapGetters([
			'categories',
			'tags',
		]),
    },
    created() {
		if (!this.categories.length||!this.tags.length) {
			this.getCateTag();
		}
	},
    methods: {
        ...mapActions('article', [
			'getCateTag'
        ]),
        handleRemoveCate(id) {
            this.$removeDialog(async ()=>{
				let res = await this.$Api.removeCategory(id);
				if(res.data.code==1){
					this.$message({
						message: res.data.message,
						type: 'success'
					});
					this.getCateTag();
				}else{
					this.$message.error(res.data.message);
				}
            })
        },
        showCateInput() {
            this.cateVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveCateInput.$refs.input.focus();
            });
        },
        async createCateConfirm() {
            let value = this.cateValue;
            if (value) {
                let res = await this.$Api.createCategory(value);
                if(res.data.code==1){
					this.$message({
						message: res.data.message,
						type: 'success'
					});
					this.getCateTag();
				}else{
					this.$message.error(res.data.message);
				}
            }
            this.cateVisible = false;
            this.cateValue = '';
        },

        //标签
        handleRemoveTag(id) {
            this.$removeDialog(async ()=>{
                let res = await this.$Api.removeTag(id);
				if(res.data.code==1){
					this.$message({
						message: res.data.message,
						type: 'success'
					});
					this.getCateTag();
				}else{
					this.$message.error(res.data.message);
				}
            })
        },
        showTagInput() {
            this.tagVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async createTagConfirm() {
            let tagValue = this.tagValue;
            if (tagValue) {
                let res = await this.$Api.createTag(tagValue);
                if(res.data.code==1){
					this.$message({
						message: res.data.message,
						type: 'success'
					});
					this.getCateTag();
				}else{
					this.$message.error(res.data.message);
				}
            }
            this.tagVisible = false;
            this.tagValue = '';
        }
    }
}
</script>

<style lang="less" scoped>
.box-card {
    float: left;
    margin-right: 20px;
    width: 480px;
  }
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
.item {
    float: left;
    margin-bottom: 18px;
    margin-right: 10px;
  }
</style>