/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-05-28 18:05:10
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-05-28 18:13:55
 */

import { loadScript } from '@/utils/index'

/**
 * @name 初始化Valine
 */
export function initValine(valineOptions) {
  if ($('#vcomments').length !== 0) {
    if (typeof window.Valine === 'undefined') {
      loadScript(
        '//cdn.jsdelivr.net/npm/leancloud-storage/dist/av-min.js',
        function () {
          loadScript(
            'https://cdn.jsdelivr.net/npm/valine/dist/Valine.min.js',
            function () {
              new Valine(valineOptions)
            }
          )
        }
      )
    } else {
      new Valine(valineOptions)
    }
  }
}
