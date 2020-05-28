/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-05-28 17:23:25
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-05-28 17:26:32
 */

/**
 * 动态加载JS文件的方法
 * Load javascript file method
 *
 * @param {String}   fileName              JS文件名
 * @param {Function} [callback=function()] 加载成功后执行的回调函数
 * @param {String}   [into='head']         嵌入页面的位置
 */
export function loadScript(fileName, callback, into) {
  into = into || 'body'
  callback = callback || function () {}
  var script = null
  script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = fileName
  script.onload = function () {
    loadFiles.js.push(fileName)
    callback()
  }
  if (into === 'head') {
    document.getElementsByTagName('head')[0].appendChild(script)
  } else {
    document.body.appendChild(script)
  }
}
