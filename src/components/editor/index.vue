<template>
    <textarea name="content" id="markDown_editor" ref="markDown_editor"/>
</template>

<script>
import "mditor/dist/js/mditor.js"
import "mditor/dist/css/mditor.css"
export default {
    props: {
        content: [String],
    },
    data(){
        return {
            mditor:null
        }
    },
	mounted(){
        this.$nextTick(()=>{
			this.ready()
		})
    },
    created(){

    },
    methods:{
		ready(){
			var ctx = this;		
			let e = this.$refs['markDown_editor'];
			var mditor = this.mditor = Mditor.fromTextarea(e);
			mditor.on('ready',()=>{
				mditor.height = '550px';
				var helpBtn = mditor.toolbar.getItem("help");	//帮助按钮点击
				helpBtn.handler = function () {
					return ;
				};
				mditor.value = ctx.content;
				mditor.on('changed', function(){
                    ctx.$emit('update:content', mditor.value);
				});
				var isMac = function() { return /macintosh|mac os x/i.test(navigator.userAgent); }();
				mditor.toolbar.items.splice(0,0,{
					name: 'mail-reply',
					icon: 'mail-reply',
					handler: function () {
						mditor.editor.undo();
					},
					title: '撤销',
					key: 'ctrl+z'
				},{
					name: 'mail-forward',
					icon: 'mail-forward',
					handler: function () {
						mditor.editor.redo();
					},
					title: '恢复',
					key: isMac ? 'command+shift+z' : 'ctrl+y',
				});
				mditor.editor.on('drop',function(event){
					console.log('drop',event);
				});
				mditor.editor.on('paste',function(event){
					console.log('paste',event.clipboardData.types);
				});
				mditor.on('head-dblclick',function(){	//双击头部
					// ctx.renderContent()
					// console.log('head-dblclick');
				});
				// mditor.viewer.value = mditor.editor.value;
			});
		},
    }
}
</script>

<style lang="less" scoped>

</style>