<template>
	<section class="section_content">
        <div class="file_manager">
            <div class="container-fluid">
                <div class="block-header">
                    <el-row>
                        <el-col :sm="12" :md="8" :lg="5">                        
                            <h2>File Images</h2>
                        </el-col>            
                    </el-row>
                </div>
                <el-row class="row clearfix" :gutter="30">
                    <el-col :sm="24" :md="8" :lg="6" v-for="(item,index) in dataList" :key="index">
                        <div class="card">
                            <div class="file">
                                <div class="hover">
                                    <el-button type="danger" icon="el-icon-delete" circle></el-button>
                                </div>
                                <a href="javascript:void(0);">
                                    <div class="video">
                                        <video style="max-width:100%;height:auto;" :src="item.filepath" controls="controls">
                                        </video>
                                    </div>
                                    <!-- <div class="icon">
                                        <i :class="transformIconClass(item.filetype)"></i>
                                    </div> -->
                                    <div class="file-name">
                                        <p class="m-b-5 text-muted">{{item.filename}}</p>
                                        <small>Size: {{bytesToSize(item.filesize)}}
                                             <span class="date text-muted">{{item.create_time | moment}}</span>
                                        </small>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </el-col>                
                </el-row>
                
            </div>
        </div>
	</section>
</template>

<script>
export default {
	data() {
		return {
            dataList:[],
			fileList:[],
            percentage:0,
            pageParams: {
                limit: 8,
                page: 1,
                count: 0,
            },
            filetype:3,
            fileIconClass:{
                'audio':'fa fa-music text-info',
                'video':'fa fa-video-camera text-success',
            }
		}
	},
	created(){
		this.getData()
	},
	methods: { 
        async getData(){
            let params = {
                page:this.pageParams,
                limit:this.pageParams,
                filetype:this.filetype
            };
            let res = await this.$Api.getFileList(params);
            if(res.data.code==1){
               this.dataList = res.data.data;
            }else{
                this.$message.error(res.data.message);
            }
        },
        transformIconClass(filetype){
            let s = filetype.split('/');
            let type = s[0];
            let cls = this.fileIconClass[type];
            return cls?cls:'fa fa-music text-info'
        }
	}
}
</script>

<style lang="less" scoped>
.card {
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -ms-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background: #fff;
    border-radius: .1875rem;
    border-color: #fff;
    margin-bottom: 30px;
    position: relative;
    width: 100%;
}
.file_manager{
    .file {
        border-radius: .55rem;
        position: relative;
        overflow: hidden;
        .image,.icon,.video {
            max-height: 180px;
            overflow: hidden;
            background-size: cover;
            background-position: top;
        }
       .icon {
            padding: 15px 10px;
            display: table;
            width: 100%;
            text-align: center;
            i {
                color: #777;
                display: table-cell;
                font-size: 30px;
                vertical-align: middle;
                line-height: 100px;
            }
        }
        .hover {
            -webkit-transition: all 0.3s ease-in-out;
            -moz-transition: all 0.3s ease-in-out;
            -ms-transition: all 0.3s ease-in-out;
            -o-transition: all 0.3s ease-in-out;
            transition: all 0.3s ease-in-out;
            position: absolute;
            right: 10px;
            top: 10px;
            display: none;
        }
        &:hover{
            .hover {
                 display: block;
                -webkit-transition: all 0.3s ease-in-out;
                -moz-transition: all 0.3s ease-in-out;
                -ms-transition: all 0.3s ease-in-out;
                -o-transition: all 0.3s ease-in-out;
                transition: all 0.3s ease-in-out;
            }
        }
        .file-name {
            padding: 10px;
            border-top: 1px solid #f7f7f7;
            small{
                display: block;
                .date {
                    float: right;
                }
            }
        }
    }
} 

</style>