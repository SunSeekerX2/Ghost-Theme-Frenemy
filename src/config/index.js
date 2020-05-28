/**
 * @name: 主题全部配置
 * @author: SunSeekerX
 * @Date: 2020-05-24 12:24:52
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-05-28 18:10:58
 */

export default {
  baiduTongji: {
    // 百度统计key
    key: '3f0d7a82297c929467637543290d6e37',
  },
  // valine配置
  valineOptions: {
    el: '#vcomments',
    // leancloud 应用 appid
    appId: '4zCOQmtHXSOvLlPnTV108NOw-gzGzoHsz',
    // leancloud 应用 appkey
    appKey: 'sMdusoM6SbN9tgyCCKzTIwif',
    // serverURLs: leancloudServerURL,
    notify: true,
    verify: true,
    avatar: 'mm',
    visitor: true, // 文章访问量统计
    highlight: true, // 代码高亮
    recordIP: true, // 是否记录评论者IP
    placeholder: '请您理智发言，共建美好社会！',
    path: window.location.pathname, // **请确保必须写该属性
  },
}
