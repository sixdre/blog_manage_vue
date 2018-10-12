import moment from 'moment'
import form_rules from './form_rules';
moment.locale('zh-cn');

//时间格式化
export const timeFormat = function(value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
    return moment(value).format(formatString);
}

//表单验证
export const formValidate = form_rules;

//获取图片宽高
export const getImageWh = function(file) {
    return new Promise(function(resolve, reject) {
        try {
            var image = new Image()
            image.src = URL.createObjectURL(file);
            image.onload = function() {
                var w = image.width;
                var h = image.height;
                resolve([w, h]);
            }
        } catch (err) {
            reject(err);
        }
    });
}

// eslint-disable-next-line
//use example   v-if="hasPermission('post,/api/users')"
export const hasPermission = function(data) {
    let per = data.split(','),
        method = per[0],
        url = per[1],
        flag = false,
        permissionList = this.$store.state.permission.resources;
    permissionList.forEach(function(s) {
        if (s.type == method && s.resource == url) {
            flag = true;
            return;
        }
    })
    return flag;
}

//格式化数字为3位相间逗号分隔符
export const formatNum =  function (num_s) {
    return parseFloat(num_s).toLocaleString()
}

//转换文件的大小为kb mb gb 或tb
export const bytesToSize =  function (bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024, 
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    
     return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}


