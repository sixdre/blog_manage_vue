/** 
 * Created by xuhao on 2017/11/10.
 */

import Vue from 'vue'
import App from './App'
import router from './router'
import api from './api/api'
import store from './store'
import ElementUI,{MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import { formValidate, hasPermission ,timeFormat } from '@/utils';

Vue.filter('moment',timeFormat)

Vue.use(ElementUI);
Vue.use(formValidate);  //表单验证
Vue.use(hasPermission)  //按钮权限

Vue.use(ElementUI);

function removeDialog(title, cb1, cb2) {
    if (typeof title == 'function') {
        cb1 = title
        title = '确认删除该记录吗?';
    } 
    MessageBox.confirm(title, '提示', {
        type: 'warning',
    }).then(() => {
        if (cb1&& typeof cb1=='function') {
            cb1();
        }
    }).catch(() => {
        if (cb2&& typeof cb2=='function') {
            cb2();
        }
    });
}


Vue.config.productionTip = false;
Vue.prototype.$Api= api
Vue.prototype.$removeDialog = removeDialog;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
