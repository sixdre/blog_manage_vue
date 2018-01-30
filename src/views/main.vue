<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>路径</th>
          <th>值</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in dataList" :key="index">
          <td>
            <el-input :autofocus="true"  v-model="item.path"  v-if="editIndex===index"></el-input>
            <span v-else>{{item.path}}</span>
          </td>
          <td>
             <el-input   v-model="item.value"  v-if="editIndex===index"></el-input>
             <span v-else>{{item.value}}</span>
          </td>
          <td>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(item,index)"></el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini"></el-button>
            <el-button size="mini" round v-if="editIndex===index" @click="handleEditSave(item)">保存</el-button>
            <el-button size="mini" round v-if="editIndex===index" @click="handleEditCancel">取消</el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList:[{
        path:'/www',
        value:'目录一'
      },{
        path:'/root',
        value:'主目录'
      }],
      editIndex:'', //用于保存当前修改值得索引
      editValue:''   //用于临时存储当前修改值
    }
  },
  methods:{
    handleEdit(item,index){
      this.editIndex = index;
      this.editValue = JSON.parse(JSON.stringify(item));
      console.log(this.dataList)
    },
    //保存修改
    handleEditSave(item){
      alert(JSON.stringify(item))
      this.editIndex = '';
    },
    //修改取消操作
    handleEditCancel(){
       this.dataList[this.editIndex] = this.editValue;
       this.editIndex = '';
       this.editValue = '';
      
    }
  }
}
</script>
