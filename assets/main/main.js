var ghostSearchkey = '99efee9603c92e5cd04501f069'; // 搜索key
var baiduTongJikey = '37d3bf3116f041cb10bd1d890e65bcfc'; // 百度统计id
var leancloudAppId = 'rEDT0uBB2LEdndoJ4od2SlKf-gzGzoHsz'; // leancloud 应用 appid
var leancloudAppKey = 'lmX57j7hrYGCHROA72tBUIXq';  // leancloud 应用 appkey
var leancloudServerURL = 'https://leancloud-api.iiong.com'; // leancloud 应用 Api 地址私有域名
var googleAnalyticsId = 'UA-141063659-1'; // 谷歌分析ID

// key: '1c8b902ac09889962117d082e6',
// key: '99efee9603c92e5cd04501f069',

var valineObject = undefined;
var valineOptions = {
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
  placeholder: '请您理智发言，共建美好社会！',
  path: window.location.pathname // **请确保必须写该属性
};

/**
 * 分页业务 - 创建
 */
function createPagination() {
  var url = window.location.href;
  var currPageElm = document.querySelector('.curr-page');
  var totalPagesElm = document.querySelector('.total-pages');
  if (!currPageElm || !totalPagesElm)
    return;
  var currentPage = Number.parseInt(currPageElm.textContent, 10);
  var totalPages = Number.parseInt(totalPagesElm.textContent, 10);
  var paginationElm = document.querySelector('.pagination');
  var paginationPrev = document.querySelector('.page-item');
  if (totalPages > 1) {
    var paginationItems = [];
    var paginationArr = pagination(currentPage, totalPages);
    paginationArr.forEach(function (pagElm) {
      var urlArray = url.split('/');
      if (pagElm === currentPage) {
        paginationItems.push('<li class="page-item active"><span class="page-link">' + pagElm + '</span></li>');
      } else if (typeof pagElm === 'number') {
        if (urlArray[urlArray.length - 3] === 'page') {
          url = url.replace(/\/page\/.*$/, '') + '/';
        }
        paginationItems.push('<li class="page-item"><a class="page-link" href="' + url + 'page/' + pagElm + '/" aria-label="第' + pagElm + '页">' + pagElm + '</a></li>');
      } else {
        paginationItems.push('<li class="page-item ellipsis"><a class="page-link">...</a></li>');
      }
    });
    if (paginationPrev !== null) {
      currentPage === 1 ?
        paginationPrev.insertAdjacentHTML('beforebegin', paginationItems.join(''))
        :
        paginationPrev.insertAdjacentHTML('afterend', paginationItems.join(''));
    }
  } else if (paginationElm != null) {
    paginationElm.style.display = 'none';
  }
}
/**
 * 分页业务 - 过程
 */
function pagination(currentPage, pageCount) {
  var range = [];
  var delta = 2;
  for (var i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
    range.push(i);
  }
  if (currentPage - delta > 2)
    range.unshift('...');
  if (currentPage + delta < pageCount - 1)
    range.push('...');
  range.unshift(1);
  range.push(pageCount);
  return range;
}

/**
 * valine 评论支持
 */
function valineInit() {
  var initConfig = function() {
    if (document.getElementById('vcomments') !== null) {
      valineObject = new Valine(valineOptions);
    }
  };

  if ($('#vcomments').length !== 0) {
    if (typeof window.Valine === 'undefined') {
      loadScript('//cdn.jsdelivr.net/npm/leancloud-storage/dist/av-min.js', function () {
        loadScript(
          'https://cdn.jsdelivr.net/npm/valine/dist/Valine.min.js',
          function () {
            return initConfig();
          }
        );
      });
    } else {
      return initConfig();
    }

  }
}

/**
 * 搜索功能支持
 */
function searchInit() {
  var initConfig = function() {
    var ghostSearch = new GhostSearch({
      key: ghostSearchkey,
      url: [location.protocol, '//', location.host].join(''),
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
  };
  if ($('#ghost-search-field').length !== 0) {
    if (typeof window.GhostSearch === 'undefined') {
      loadScript('//cdn.jsdelivr.net/npm/@tryghost/content-api/umd/content-api.min.js', function () {
        loadScript('//cdn.jsdelivr.net/npm/ghost-search/dist/ghost-search.min.js', function () {
          loadScript('//cdn.jsdelivr.net/npm/dayjs/dayjs.min.js', function () {
            initConfig();
          })
        });
      });
    } else {
      initConfig();
    }
  }
}

/**
 * 监听点击链接时间，非本站链接进行新标签打开
 */
function watchSiteLink() {
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
}

(function ($) {
  $(document).ready(function () {
    //百度推送
    window.location.protocol.split(':')[0] === 'https' ? loadScript('https://zz.bdstatic.com/linksubmit/push.js') : loadScript('http://push.zhanzhang.baidu.com/push.js');
    //百度统计
    loadScript('https://hm.baidu.com/hm.js?' + baiduTongJikey);
    // 谷歌分析
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + googleAnalyticsId, function () {
      window.dataLayer = window.dataLayer || [];

      function gtag() {
        dataLayer.push(arguments);
      }

      gtag('js', new Date());
      gtag('config', googleAnalyticsId);
    });

    var aaa = valineInit();
    searchInit();
    watchSiteLink();
    createPagination();

    /**
     * Pjax业务
     */
    $(document).pjax(
      'a[target!=_blank]',
      '.site-warp',
      {
        timeout: 5000,
        push: true, // 使用pushState在浏览器中添加历史记录
        replace: false, // 替换URL地址但不添加浏览器历史记录
        container: '.site-warp', // 被替换内容元素的CSS选择器
        fragment: '.site-warp', // css选择器，提取ajax响应内容中指定的内容片段
      }
    ).on('pjax:send', function () {
      // pjax通过链接点击已经开始之后触发
      $('.site-warp').fadeTo(0, 0);
    }).on('pjax:complete', function () {
      // 无论结果如何，都在ajax响应完成后触发
      $('.site-warp').fadeTo(500, 1);

      doPjaxCompleteAction();
    });
  });
})(jQuery);

/**
 * 重载业务
 */
function doPjaxCompleteAction() {
  initPage();
  valineInit();
  searchInit();
  watchSiteLink();
  createPagination();
  if (typeof window.Prism !== 'undefined') {
    Prism.highlightAll(); // 语法高亮
  }
  if (typeof valineObject !== 'undefined') {
    valineObject.init(Object.assign({}, valineOptions, {
      path: window.location.pathname
    }));
  }
  $('[data-toggle="tooltip"]').tooltip();

  // 百度统计
  if (typeof _hmt !== 'undefined') {
    _hmt.push(['_trackPageview', location.pathname + location.search]);
  }
  // 谷歌分析
  if (typeof ga !== 'undefined') {
    ga('send', 'pageview', location.pathname + location.search);
  }

  log();
}
