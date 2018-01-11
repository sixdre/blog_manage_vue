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
import './filter/time'


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


const hasPermission = {
    // eslint-disable-next-line
    //use example   v-if="hasPermission('post,/api/users')"
    install (Vue, options){
        Vue.mixin({
            methods:{
                hasPermission(data) {
                    let per = data.split(','),
                        method = per[0],
                        url = per[1],
                        flag = false,
                        permissionList = this.$store.state.permission.resources;
                    permissionList.forEach(function(s) {
                        if (s.type == method&&s.resource == url) {
                            flag = true;
                            return;
                        }
                    })
                    return flag;
                }
            }
        })
    }
}


Vue.use(hasPermission)





new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
