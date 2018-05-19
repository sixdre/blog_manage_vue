<template>
    <el-pagination
        :page-sizes="[10, 20, 50]"
        :page-size="limit"
        :current-page.sync="page" 
        @current-change="pageChange"
        @size-change="pageSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
</template>

<script>
export default {
    props: {
        page:{
            type:Number,
            default:1
        },
        limit:{
            type:Number,
            default:10
        },
        total:{
            type:Number,
            default:0
        },
        getData:Function
    },
    data() {
        return {

        };
    },
    watch: {

    },
    methods: {
        pageChange(val){
            this.$emit('pageChange',val)
            if(this.getData&&typeof this.getData ==='function'){
                this.getData()
            }
        },
        pageSizeChange(val){
            this.$emit('sizeChange',val)
            if(this.getData&&typeof this.getData ==='function'){
                this.getData()
            }
        }
    }
};
</script>

<style lang="less" scoped>

</style>
