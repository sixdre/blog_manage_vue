<template>
	<section class="section" id="main_section">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="card-item">
                        <i class="anticon anticon-team icon" style="color: rgb(112, 236, 154);"></i>
                        <div class="card-right">
                            <p class="title">访问人次</p>
                            <span style="font-size: 25px;">3,501</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="card-item">
                        <i class="anticon anticon-team icon" style="color: rgb(112, 236, 154);"></i>
                        <div class="card-right">
                            <p class="title">文章数量</p>
                            <span style="font-size: 25px;">{{indexData.articleCount}}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="card-item">
                        <i class="anticon anticon-team icon" style="color: rgb(112, 236, 154);"></i>
                        <div class="card-right">
                            <p class="title">用户数量</p>
                            <span style="font-size: 25px;">{{indexData.userCount}}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="card-item">
                        <i class="anticon anticon-team icon" style="color: rgb(112, 236, 154);"></i>
                        <div class="card-right">
                            <p class="title">评论数量</p>
                            <span style="font-size: 25px;">{{indexData.commentCount}}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        
        <div style="width:800px;height:500px" ref="chart1"></div>

        <div style="width:800px;height:500px" ref="chart2"></div>
	</section>
</template>

<script>

import echarts from 'echarts';
var barOption = {
    title: {
        text: '文章标签统计',
        x: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
            label: {
                show: true
            }
        },
        formatter: "{b} : {c}"
    },
    toolbox: {
        show: false,
        feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    xAxis: [
        {
            type: 'category',
            data: []
        }
    ],
    yAxis: [
        {
            type: 'value',
        }
    ],
    series: [
        {
            name: '文章数',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: '#ffb057'
                }
            },
            data: [],
        }
    ]
};
var pieOption = {
    title : {
        text: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
    },
    series : [
        {
            name: '统计',
            type: 'pie',
            radius : '55%',
            data:[
               
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

function initChart(dom){
    return echarts.init(dom)
}


export default {
	data() {
		return {
			indexData:{}
		}
	},
	created(){

    },
    mounted(){
        this.$nextTick(()=>{
             this.getData()
        })
    },
	methods: { 
        setCategoryData(data){
            let op = JSON.parse(JSON.stringify(pieOption));
            op.title.text = '文章类型统计';
			op.series[0].data = data.map(item=>{
                return {
                    name:item.name,
                    value:item.count
                }
            });
			return op;
        },
        setTagData(data){
            let op = JSON.parse(JSON.stringify(barOption));
            op.title.text = '文章标签统计';
            op.xAxis[0].data = data.map(item=>item.name);
			op.series[0].data = data.map(item=>item.count);
			return op;
		},
        async getData(){
            let res = await this.$Api.graph();
            if (res.data.code === 1) {
                this.indexData = res.data.data;
                let categoryData = res.data.data.cateGroup;
                let tagData = res.data.data.tagGroup;
                initChart(this.$refs.chart1).setOption(this.setCategoryData(categoryData));
                initChart(this.$refs.chart2).setOption(this.setTagData(tagData));
            }else{
                this.$message.error(res.data.message);
            }
        }
	}
}
</script>

<style lang="less" scoped>
#main_section{
    .card-item {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: start;
        justify-content: flex-start;
        -ms-flex-align: center;
        align-items: center;
        height: 55px;
        .card-right {
            margin-left: 20px;
        }
    }
}
</style>