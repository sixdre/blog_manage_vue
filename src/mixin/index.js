import {hasPermission} from '@/utils';
const common = {
    data() {
		return {
			searchForm:{
				
			},
			tableDatas:[],
			pageParams: {
				limit:8,
				page:1,
				count:null,
            },
			rowIdKey: '_id',		//表格行数据idkey
            selectRows: [],	    //table 选中数据
            
			removeApi: '',		//删除api
            createApi: '',		//新增api
            updateApi:'',       //修改api
			listApi: '',		//列表api
			infoApi:'',         //详情api
            
            
			dialogStatus: 1,	//1 新增 2编辑 3查看
			
		}
	},
    computed: {
		dialogTitle(){
			if(this.dialogStatus==1){
				return '新增'
			}else if(this.dialogStatus==2){
				return '编辑'
			}else if(this.dialogStatus==3){
				return '查看'
			}else{
				return '新增'
			}
		}
    },
    created() {
        
    },
	methods: {
		hasPermission(data) {
			hasPermission(data)
		},
		//获取数据列表
        getTableDatas(params) {
			let api = this.listApi;
			if(!api){
				return Promise.reject('api 不得为空');
			}
			if(!params){
				params = this.searchForm;
			}
            params.page = this.pageParams.page;
            params.limit = this.pageParams.limit;
            return this.$Api[api](params);
		},
		//删除
        async removeData(ids) {
            if (!this.removeApi) {
                return;
            }
			let api = this.removeApi;
			let res = await this.$Api[api](ids);
			if (res.data.code === 1) {
				this.$message.success(res.data.message);
				this.renderTable();
			} else {
				this.$message.error(res.data.message);
			}
		},
		selsChange(val) {
			this.selectRows = val;
		},
		//查询
		onSearch(){
			this.pageParams.page = 1;
			this.renderTable();
		},
		//新增
		handleAdd() {
			let idkey = this.rowIdKey;
			delete this.form[idkey];
			this.dialogStatus = 1;
			this.dialogVisible = true;
		},
		//删除
		handleRemove(id){
			this.$removeDialog(()=>{
				this.removeData(id)
			})
		},
		//批量删除
		onRemoveMulti() {
			let idkey = this.rowIdKey;
			let ids = this.selectRows.map(item=>item[idkey]);
			if(!ids.length){
				return this.$message.warning('请选择所要删除的数据');
			}
			let params = ids.toString();
			this.handleRemove(params);
		},
        pageChange(val) {
			this.pageParams.page = val;
			this.renderTable();
		},
		pageSizeChange(val){
			this.pageParams.limit = val;
			this.renderTable();
		},

	}
}

export default common;