<template>
	<div v-loading="loading" element-loading-text="文件上传中" element-loading-background="rgba(0, 0, 0, 0.5)">
		 <textarea name="content" id="markDown_editor" ref="markDown_editor"/>
	</div>
</template>

<script>
import { Loading } from 'element-ui';
import "mditor/dist/js/mditor.js"
import "mditor/dist/css/mditor.css"
export default {
    props: {
        content: [String],
    },
    data(){
        return {
			mditor:null,
			loading:false
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
		async uploadImg(file) {
			if (file == null) {
				return;
			}
			this.loading = true;
			var name = file.name || 'screenshot.png';
            name = name.replace(/\.(?:jpg|gif|png)$/i, ''); // clear ext
            name = name.replace(/\W+/g, '_'); // clear unvalid chars
			var formData = new FormData();
			formData.append('file',file,name);
			let res = await this.$Api.upload(formData);
			if(res.data.code==1){
				this.mditor.editor.insertBeforeText('![' + name + '](' + res.data.url + ")\n");
				this.loading = false;
				this.$message.success(res.data.message);
			}else{
				this.$message.error(res.data.message);
				this.loading = false;
			}
		},
		clear(){
			this.mditor.value = "";
		},
		ready(){
			var ctx = this;		
			let e = this.$refs['markDown_editor'];
			var mditor = this.mditor = window.Mditor.fromTextarea(e);
			mditor.on('ready',()=>{
				mditor.height = '550px';
				var helpBtn = mditor.toolbar.getItem("help");	//帮助按钮点击
				var imgBtn = mditor.toolbar.getItem('image');   //图片按钮点击
				helpBtn.handler = function () {
					return ;
				};

				imgBtn.handler = function () {
					var accept = {
						image: 'image/png, image/gif, image/jpg, image/jpeg',
					};
					var $file = window.document.createElement('input')
						$file.setAttribute('type','file')
						$file.setAttribute('accept',accept.image)
						$file.click();
						$file.onchange = function(){
							var file = this.files[0];
							ctx.uploadImg(file);
						}
				};
				ctx.$nextTick(()=>{
					mditor.value = ctx.content;
				})
				mditor.on('changed', function(){
					ctx.$emit('update:content', mditor.value);
					ctx.$emit('onChange',mditor.value)
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
					 mditor.fullscreen = !mditor.fullscreen;
				});
				// mditor.viewer.value = mditor.editor.value;
			});
		},
    }
}
</script>

<style lang="less" scoped>

</style>