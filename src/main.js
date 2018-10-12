/** 
 * Created by xuhao on 2017/11/10.
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './api/api'
import store from './store'
import '@/assets/css/frame.css';
import 'font-awesome/css/font-awesome.min.css';
import { MessageBox } from 'element-ui';
import { formValidate, timeFormat } from '@/utils';
import common from '@/mixin'
import rangeTime from '@/components/rangeTime'

let MyPlugin = {
    install(Vue, options) {
        Vue.component('rangeTime', rangeTime);
        Vue.prototype.$Api = api;
        Vue.prototype.$removeDialog = function(title, cb1, cb2) {
            if (typeof title == 'function') {
                cb1 = title
                title = '确认删除该记录吗?';
            }
            MessageBox.confirm(title, '提示', {
                type: 'warning',
            }).then(() => {
                if (cb1 && typeof cb1 == 'function') {
                    cb1();
                }
            }).catch(() => {
                if (cb2 && typeof cb2 == 'function') {
                    cb2();
                }
            });
        };
        Vue.prototype.form_rules = formValidate;
        Vue.filter('moment', timeFormat);
        Vue.mixin(common);
        //图片预览
        Vue.directive('preview', {
            bind: function(el, binding, vnode) {
                var viewer = new window.Viewer(el, {
                    // hidden: function() {
                    //     viewer.destroy()
                    // }
                });
            }
        })
        Vue.directive('download', {
            bind: function(el, binding, vnode) {
                el.addEventListener('click', function() {
                    if (binding.value) {
                        api.download(binding.value)
                    } else {
                        router.back(-1);
                    }
                })
            }
        })
    }
};

Vue.use(MyPlugin) //插件(公共方法)
Vue.config.productionTip = false;
Vue.prototype.$RongIM = null;

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})