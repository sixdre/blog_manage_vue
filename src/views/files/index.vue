<template>
	<section class="section_content">
        <div class="container-fluid">
            <div class="block-header">
                <div class="row">
                    <div class="col-lg-5 col-md-8 col-sm-12">                        
                        <h2>Dashboard</h2>
                    </div>            
                </div>
            </div>
            <div class="row clearfix">
                <div class="col-lg-3 col-md-5 col-sm-12">
                    <div class="card">
                        <div class="body">
                            <h4>{{bytesToSize(dataInfo.totalSize)}} <i class="fa fa-server float-right"></i></h4>
                            <p class="mb-0">Storage <small class="text-muted float-right">of {{bytesToSize(dataInfo.allSize)}}</small></p>                            
                            <el-progress :percentage="dataInfo.totalPercent" :show-text="false"></el-progress>
                        </div>
                    </div>
                    <div class="card modal-open m-b-5">
                        <div class="body">
                            <h6>{{bytesToSize(dataInfo.docSize)}}</h6>
                            <p class="mb-0">文档 <small class="text-muted float-right">of {{bytesToSize(dataInfo.docTotal)}}</small></p>
                        </div>
                        <el-progress :percentage="dataInfo.docPercent" :show-text="false" color="#0E9BE2"></el-progress>
                    </div>
                    <div class="card modal-open m-b-5">
                        <div class="body">
                            <h6>{{bytesToSize(dataInfo.mediaSize)}}</h6>
                            <p class="mb-0">音/视频 <small class="text-muted float-right">of {{bytesToSize(dataInfo.mediaTotal)}}</small></p>
                        </div>
                        <el-progress :percentage="dataInfo.mediaPercent" :show-text="false" color="#AB7DF6"></el-progress>
                    </div>
                    <div class="card modal-open">
                        <div class="body">
                            <h6>{{bytesToSize(dataInfo.imageSize)}}</h6>
                            <p class="mb-0">图片 <small class="text-muted float-right">of {{bytesToSize(dataInfo.imageTotal)}}</small></p>
                        </div>
                        <el-progress :percentage="dataInfo.imagePercent" :show-text="false" color="#7CAC25"></el-progress>
                    </div>
                </div>
                <div class="col-lg-9 col-md-7 col-sm-12">

                </div>    
            </div>
            
        </div>
	</section>
</template>

<script>
export default {
	data() {
		return {
            dataInfo:{
                
            }
		}
	},
	created(){
		this.getData()
	},
	methods: { 
        async getData(){
            let res = await this.$Api.getFileIndex();
            if(res.data.code==1){
                let retData = res.data.data;
                let {docSize,mediaSize,imageSize,allSize} = retData;
                this.dataInfo = {
                   ...retData,
                   totalSize:docSize+mediaSize+imageSize,
                   totalPercent:(docSize+mediaSize+imageSize)/allSize*100,
                   docPercent:docSize/retData.docTotal*100,
                   mediaPercent:mediaSize/retData.mediaTotal*100,
                   imagePercent:imageSize/retData.imageTotal*100,

                }
            }else{
                this.$message.error(res.data.message);
            }
        },
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
.card .body {
    color: #444;
    font-weight: 400;
    padding: 20px;
}
.progress-transparent.custom-color-blue {
    background-color: rgba(14,155,226,0.2);
}
.progress.progress-xs {
    height: 5px;
}
.progress {
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    background-color: #f1f1f1;
}
</style>