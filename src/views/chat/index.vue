<template>
    <section class="section">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="用户名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onRegister">注册</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
var socket = io.connect('127.0.0.1:7893');
export default {
    data() {
        return {
            form:{
                name:''
            }
        };
    },
    computed: {

    },
    created() {
        socket.on('connectNum', function (num) {
            console.log("连接数：" + num);
        });
	},
    methods: {
        onRegister(){
            var from = this.form.name;
            socket.emit('setName', from);
            //sessionStorage.setItem('name', from);
        }
    }
}
</script>

<style lang="less" scoped>

</style>