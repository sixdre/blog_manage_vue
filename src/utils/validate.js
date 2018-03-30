//检测是否为固定电话号码
function delSpace(txt) { //清除字符串中所有的空白字符
    if (txt == null) {
        return "";
    } else {
        txt = txt.toString();
        txt = txt.replace(/\s{1,}/, "");
        return txt;
    }
}
//检测是否为url
export const isURL = function (txt) {
    if (txt == null || txt == "") { return false; }
    else {
        var regex = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        return regex.test(txt);
    }
}
//检测是否为固定电话号码
export const isTel = function (txt) {
    if (txt == null || txt == "") { return false; }
    else {
        var regex = /[0-9]{1}[0-9]{2,3}-[1-9]{1}[0-9]{5,8}/;
        return regex.test(txt);
    }
}
//检测是否为手机号码
export const isMobile = function (txt) {
    if (txt == null || txt == "") { return false; }
    else {
        var regex = /^0?1[3|4|5|8][0 -9]\d{8}$/;
        return regex.test(txt);
    }
}
//检测是否为电话号码(固定电话或手机)
export const isPhoneNum = function (txt) {
    return isTel(txt) || isMobile(txt);
}
// 是否为整数
export const isInteger = function (txt) {
    if (txt == null || txt == "") { return false; }
    else {
        txt = delSpace(txt);
        return !isNaN(parseInt(txt));
    }
}
//是否为数字
export const isNumeric = function (txt) {
    if (txt == null || txt == "") { return false; }
    else {
        txt = delSpace(txt);
        return !isNaN(parseFloat(txt));
    }
}
//检测15位或18位的身份证号
export const isIdCardNum = function (txt) {
    if (txt == null || txt == "") {
        return false;
    }
    var idNo = txt.toString();
    var len = idNo.length;
    var reg;
    var noArr;
    var dateStr = "";
    if (len != 15 && len != 18) {
        return false;
    } else if (len == 15) {
        reg = /(\d{3})(\d{3})(\d{2})(\d{2})(\d{2})(\d{3})/;
        if (reg.test(idNo) == false) {
            return false;
        } else {
            noArr = reg.exec(idNo);
            dateStr = "19" + noArr[3] + "-" + noArr[4] + "-" + noArr[5];
            return isDateFormat(dateStr);
        }
    } else {
        reg = /(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})(\d{1})([0-9xX]{1})/;
        if (reg.test(idNo) == false) {
            return false;
        } else {
            noArr = reg.exec(idNo);
            dateStr = noArr[7] + noArr[8] + noArr[9] + noArr[10] + "/" + noArr[11] + noArr[12] + "/" + noArr[13] + noArr[14];
            if (isNaN(new Date(dateStr)) == false) {
                var wi = new Array(0, 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var amt = 0;
                var i;
                var chkNo = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                for (i = 1; i < 18; i++) {
                    amt += (noArr[i] * wi[i]);
                }
                return (chkNo[amt % 11] == noArr[18].toUpperCase());
            } else {
                return false;
            }
        }
    }
}