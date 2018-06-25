<template>
   <ul id="treeDemo" class="ztree"></ul>
</template>

<script>
import './jquery.ztree.core'
import './jquery.ztree.excheck'
import './jquery.ztree.exedit'
export default {
    props: {
        datalist: {
            type: Array,
            default() {
                return []
            }
        },
        nodeKey: {
            type: String,
            default: '_id'
        },
        props: {
            default() {
                return {
                    children: 'child',
                    label: 'name',
                };
            }
        },
    },
    data() {
        return {
            zTree: {},
            setting: {
                view: {
                    selectedMulti: false,
                    showIcon: false,
                    showLine: false,
                },
                edit:{
                    enable: true,
                },
                check: {
                    enable: true,
                    chkboxType:  { "Y": "p", "N": "p" }   //设置父子级关联关系
                },
                data: {
                    key: {
                        children: this.props.children,
                        name: this.props.label
                    },
                    simpleData: {
                        idKey: this.nodeKey,
                        pIdKey: "pid",
                        enable: true
                    }
                },
                callback: {
                    // beforeEditName: this.beforeEditName,
                    onRename: this.onRename
                }
            }
        }
    },
    watch: {
        datalist(newVal){
            this.initTree();
        }
    },
    methods: {
        initTree() {
            $.fn.zTree.init($("#treeDemo"), this.setting, this.datalist);
            this.zTree = $.fn.zTree.getZTreeObj("treeDemo");
        },
        //获取选中的节点
        getCheckedKeys() {
            let key = this.nodeKey;
            let sysPermissonList = this.zTree.getCheckedNodes(true).map(item => item[key]);
            return sysPermissonList;
        },
        //通过 keys 设置目前勾选的节点
        setCheckedKeys(keys) {
            let key = this.nodeKey;
            for (let i = 0; i < keys.length; i++) {
                var node = this.zTree.getNodeByParam(key, keys[i], null);
                node.checked = true;
                this.zTree.checkNode(node, true, true);
                this.zTree.updateNode(node);
            }
        },
        beforeEditName(treeId, treeNode) {
            console.log(treeNode)
			// className = (className === "dark" ? "":"dark");
			// showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			// var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			// zTree.selectNode(treeNode);
			setTimeout(function() {
				if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
					// setTimeout(function() {
					// 	zTree.editName(treeNode);
					// }, 0);
				}
			}, 0);
			return false;
        },
        onRename(e, treeId, treeNode, isCancel){
            alert('qsssss')
            console.log('111')
        }
    }
}

</script>

<style>
@import './ztree.css';
</style>