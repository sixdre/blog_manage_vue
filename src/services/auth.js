import setting from '@/config/setting'

export default {
  login (data) {
    sessionStorage.setItem(setting.userToken, data);
  },
  setUserName(data) {
     sessionStorage.setItem(setting.userName, data)
  },
  getUserName() {
     return sessionStorage.getItem(setting.userName)
  },
  setRole(data) {
    sessionStorage.setItem(setting.role, data)
  },
  getRole() {
    return sessionStorage.getItem(setting.role)
  },
  setAvatar(data) {
    localStorage.setItem(setting.avatar, data)
  },
  getAvatar() {
    return localStorage.getItem(setting.avatar)
  },
  authenticated () {
    var t = sessionStorage.getItem(setting.userToken)
    return t && t.length > 0
  },
  authenticatedUid () {
    var t = sessionStorage.getItem(setting.uid)
    return t && t.length > 0
  },
  getToken () {
    return sessionStorage.getItem(setting.userToken)
  },
  getUid () {
    return sessionStorage.getItem(setting.uid)
  },
  logout () {
    sessionStorage.removeItem(setting.userName)
    sessionStorage.removeItem(setting.role)
    sessionStorage.removeItem(setting.userToken)
  }
}
