var ghostSearchkey = '99efee9603c92e5cd04501f069'; // 搜索key
var baiduTongJikey = '37d3bf3116f041cb10bd1d890e65bcfc'; // 百度统计id
var leancloudAppId = 'rEDT0uBB2LEdndoJ4od2SlKf-gzGzoHsz'; // leancloud 应用 appid
var leancloudAppKey = 'lmX57j7hrYGCHROA72tBUIXq';  // leancloud 应用 appkey
var leancloudServerURL = 'https://leancloud-api.iiong.com'; // leancloud 应用 Api 地址私有域名
var googleAnalyticsId = 'UA-141063659-1'; // 谷歌分析ID

// key: '1c8b902ac09889962117d082e6',
// key: '99efee9603c92e5cd04501f069',

(function ($) {
  $(document).ready(function () {
    //百度推送
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
      loadScript('https://zz.bdstatic.com/linksubmit/push.js');
    } else {
      loadScript('http://push.zhanzhang.baidu.com/push.js');
    }
    //百度统计
    loadScript('https://hm.baidu.com/hm.js?' + baiduTongJikey);
    // 谷歌分析
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + googleAnalyticsId, function () {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', googleAnalyticsId);
    });
    //valine评论支持
    if($('#vcomments').length !== 0) {
      loadScript('//cdn.jsdelivr.net/npm/leancloud-storage/dist/av-min.js', function () {
        loadScript(
          'https://cdn.jsdelivr.net/npm/valine/dist/Valine.min.js',
          function () {
            if (document.getElementById('vcomments') !== null) {
              new Valine({
                el: '#vcomments',
                appId: leancloudAppId,
                appKey: leancloudAppKey,
                serverURLs: leancloudServerURL,
                notify: true,
                verify: true,
                avatar: 'mm',
                visitor: true, // 文章访问量统计
                highlight: true, // 代码高亮
                recordIP: true, // 是否记录评论者IP
                placeholder: '请您理智发言，共建美好社会！'
              });
            }
          }
        );
      });
    }
    // 配置搜索
    if($('#ghost-search-field').length !== 0) {
      loadScript('//cdn.jsdelivr.net/npm/@tryghost/content-api/umd/content-api.min.js', function () {
        loadScript('//cdn.jsdelivr.net/npm/ghost-search/dist/ghost-search.min.js', function () {
          loadScript('//cdn.jsdelivr.net/npm/dayjs/dayjs.min.js', function () {
            var ghostSearch = new GhostSearch({
              key: ghostSearchkey,
              host: [location.protocol, '//', location.host].join(''),
              trigger: 'focus',
              defaultValue: '',
              options: {
                keys: ['title', 'published_at', 'url']
              },
              api: {
                parameters: {
                  fields: ['title', 'published_at', 'url']
                }
              },
              template: function (results) {
                var time = dayjs(results.published_at).format('YYYY年MM月DD日');
                return '' +
                  '<a href="' + results.url + '" class="ghost-search-item">' +
                  '<h2>' + results.title + '</h2>' +
                  '<span>发布日期：' + time + '</span>' +
                  '</a>'
              },
              on: {
                afterDisplay: function (result) {
                  var mate = $('.search-meta');
                  var text = mate.attr('data-no-results-text');
                  text = text.replace('[results]', result.total);
                  mate.text(text).show();
                }
              }
            });

            // 搜索关键词
            $('#nav-top-search').keypress(function (e) {
              if (e.which === 13) {
                $('.app-search-result').addClass('active');
                $('html').addClass('overflow-hidden');
                // todo 优化搜索 有几次搜索结果不显示
                $('#ghost-search-field').val($(this).val()).focus();
              }
            });
            // 手机关键词搜索
            $('#mobile-search').keypress(function (e) {
              if (e.which === 13) {
                $('.app-search-result').addClass('active');
                $('html').addClass('overflow-hidden');
                // todo 优化搜索 有几次搜索结果不显示
                $('#ghost-search-field').val($(this).val()).focus();
              }
            });

            $('.search-close').click(function () {
              $('.app-search-result').removeClass('active');
              $('#nav-top-search').val('');
              $('html').removeClass('overflow-hidden');
            });
          })
        });
      });
    }
    // 监听点击链接时间，非本站链接进行新标签打开
    $(document).on('click', 'a', function (event) {
      var link = event.target.href; // 完整链接
      var host = event.target.hostname;
      if (/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(link)) {
        if (host !== window.location.hostname) {
          event.preventDefault();
          window.open(event.target.href)
        }
      }
    });
  });
})(jQuery);
