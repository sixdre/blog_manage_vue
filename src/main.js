/** 
 * Created by xuhao on 2017/11/10.
 */

import Vue from 'vue'
import App from './App'
import router from './router'
import api from './api/api'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './filter/time'


Vue.use(ElementUI);


Vue.config.productionTip = false;
Vue.prototype.$Api= api

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
