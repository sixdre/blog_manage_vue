<template>
    <el-date-picker
        class="my_input"
        size="mini"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change='handleChange'
        v-model="time">
    </el-date-picker>
</template>

<script>
export default {
    props: {
        startTime: {        //开始时间
            required: true
        },
        endTime: {          //结束时间
            required: true
        },
    },
    data() {
        return {
            time:null
        };
    },
    watch: {
        startTime(newVal,oldVal){
            if(!newVal){
                this.time = null;
            }
        },
        endTime(newVal,oldVal){
            if(!newVal){
                this.time = null;
            }
        },
    },
    methods: {
        handleChange(val){
            if(val){
                this.$emit('update:startTime', val[0]);
                this.$emit('update:endTime', val[1]);
            }else{
                this.$emit('update:startTime', null);
                this.$emit('update:endTime', null);
            }
        }
    }
};
</script>

<style lang="less" scoped>

</style>
