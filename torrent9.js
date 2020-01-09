var https = require('https');
var http = require('http');
var fs = require('fs');

var urlsToScrap = [{
    "type": "movies",
    "link": "/torrents/films/"
  }, {
    "type": "movies",
    "link": "/torrents/films/51"
  }, {
    "type": "movies",
    "link": "/torrents/films/101"
  }, {
    "type": "movies",
    "link": "/torrents/films/151"
  }, {
    "type": "movies",
    "link": "/torrents/films/201"
  },


  {
    "type": "series",
    "link": "/torrents_series.html,page-0"
  }, {
    "type": "series",
    "link": "/torrents_series.html,page-1"
  }, {
    "type": "series",
    "link": "/torrents_series.html,page-2"
  }, {
    "type": "series",
    "link": "/torrents_series.html,page-3"
  }, {
    "type": "series",
    "link": "/torrents_series.html,page-4"
  }
];

var http_ip = "127.0.0.1"; //ip ou domaine du serveur web
var http_port = 1414; //port du serveur web
var http_title = "Oxtorrent RSS";
var torrent9_url = "https://www.oxtorrent.com/";

var torrentsId = {};
var lastUpdate = (new Date()).toGMTString();

//Fonction qui retourne un hash MD5
function md5(s) {
  function L(k, d) {
    return (k << d) | (k >>> (32 - d));
  }

  function K(G, k) {
    var I, d, F, H, x;
    F = (G & 2147483648);
    H = (k & 2147483648);
    I = (G & 1073741824);
    d = (k & 1073741824);
    x = (G & 1073741823) + (k & 1073741823);
    if (I & d) {
      return (x ^ 2147483648 ^ F ^ H);
    }
    if (I | d) {
      if (x & 1073741824) {
        return (x ^ 3221225472 ^ F ^ H);
      } else {
        return (x ^ 1073741824 ^ F ^ H);
      }
    } else {
      return (x ^ F ^ H);
    }
  }

  function r(d, F, k) {
    return (d & F) | ((~d) & k);
  }

  function q(d, F, k) {
    return (d & k) | (F & (~k));
  }

  function p(d, F, k) {
    return (d ^ F ^ k);
  }

  function n(d, F, k) {
    return (F ^ (d | (~k)));
  }

  function u(G, F, aa, Z, k, H, I) {
    G = K(G, K(K(r(F, aa, Z), k), I));
    return K(L(G, H), F);
  }

  function f(G, F, aa, Z, k, H, I) {
    G = K(G, K(K(q(F, aa, Z), k), I));
    return K(L(G, H), F);
  }

  function D(G, F, aa, Z, k, H, I) {
    G = K(G, K(K(p(F, aa, Z), k), I));
    return K(L(G, H), F);
  }

  function t(G, F, aa, Z, k, H, I) {
    G = K(G, K(K(n(F, aa, Z), k), I));
    return K(L(G, H), F);
  }

  function e(G) {
    var Z;
    var F = G.length;
    var x = F + 8;
    var k = (x - (x % 64)) / 64;
    var I = (k + 1) * 16;
    var aa = Array(I - 1);
    var d = 0;
    var H = 0;
    while (H < F) {
      Z = (H - (H % 4)) / 4;
      d = (H % 4) * 8;
      aa[Z] = (aa[Z] | (G.charCodeAt(H) << d));
      H++;
    }
    Z = (H - (H % 4)) / 4;
    d = (H % 4) * 8;
    aa[Z] = aa[Z] | (128 << d);
    aa[I - 2] = F << 3;
    aa[I - 1] = F >>> 29;
    return aa;
  }

  function B(x) {
    var k = "",
      F = "",
      G, d;
    for (d = 0; d <= 3; d++) {
      G = (x >>> (d * 8)) & 255;
      F = "0" + G.toString(16);
      k = k + F.substr(F.length - 2, 2);
    }
    return k;
  }

  function J(k) {
    k = k.replace(/rn/g, "n");
    var d = "";
    for (var F = 0; F < k.length; F++) {
      var x = k.charCodeAt(F);
      if (x < 128) {
        d += String.fromCharCode(x);
      } else {
        if ((x > 127) && (x < 2048)) {
          d += String.fromCharCode((x >> 6) | 192);
          d += String.fromCharCode((x & 63) | 128);
        } else {
          d += String.fromCharCode((x >> 12) | 224);
          d += String.fromCharCode(((x >> 6) & 63) | 128);
          d += String.fromCharCode((x & 63) | 128);
        }
      }
    }
    return d;
  }
  var C = Array();
  var P, h, E, v, g, Y, X, W, V;
  var S = 7,
    Q = 12,
    N = 17,
    M = 22;
  var A = 5,
    z = 9,
    y = 14,
    w = 20;
  var o = 4,
    m = 11,
    l = 16,
    j = 23;
  var U = 6,
    T = 10,
    R = 15,
    O = 21;
  s = J(s);
  C = e(s);
  Y = 1732584193;
  X = 4023233417;
  W = 2562383102;
  V = 271733878;
  for (P = 0; P < C.length; P += 16) {
    h = Y;
    E = X;
    v = W;
    g = V;
    Y = u(Y, X, W, V, C[P + 0], S, 3614090360);
    V = u(V, Y, X, W, C[P + 1], Q, 3905402710);
    W = u(W, V, Y, X, C[P + 2], N, 606105819);
    X = u(X, W, V, Y, C[P + 3], M, 3250441966);
    Y = u(Y, X, W, V, C[P + 4], S, 4118548399);
    V = u(V, Y, X, W, C[P + 5], Q, 1200080426);
    W = u(W, V, Y, X, C[P + 6], N, 2821735955);
    X = u(X, W, V, Y, C[P + 7], M, 4249261313);
    Y = u(Y, X, W, V, C[P + 8], S, 1770035416);
    V = u(V, Y, X, W, C[P + 9], Q, 2336552879);
    W = u(W, V, Y, X, C[P + 10], N, 4294925233);
    X = u(X, W, V, Y, C[P + 11], M, 2304563134);
    Y = u(Y, X, W, V, C[P + 12], S, 1804603682);
    V = u(V, Y, X, W, C[P + 13], Q, 4254626195);
    W = u(W, V, Y, X, C[P + 14], N, 2792965006);
    X = u(X, W, V, Y, C[P + 15], M, 1236535329);
    Y = f(Y, X, W, V, C[P + 1], A, 4129170786);
    V = f(V, Y, X, W, C[P + 6], z, 3225465664);
    W = f(W, V, Y, X, C[P + 11], y, 643717713);
    X = f(X, W, V, Y, C[P + 0], w, 3921069994);
    Y = f(Y, X, W, V, C[P + 5], A, 3593408605);
    V = f(V, Y, X, W, C[P + 10], z, 38016083);
    W = f(W, V, Y, X, C[P + 15], y, 3634488961);
    X = f(X, W, V, Y, C[P + 4], w, 3889429448);
    Y = f(Y, X, W, V, C[P + 9], A, 568446438);
    V = f(V, Y, X, W, C[P + 14], z, 3275163606);
    W = f(W, V, Y, X, C[P + 3], y, 4107603335);
    X = f(X, W, V, Y, C[P + 8], w, 1163531501);
    Y = f(Y, X, W, V, C[P + 13], A, 2850285829);
    V = f(V, Y, X, W, C[P + 2], z, 4243563512);
    W = f(W, V, Y, X, C[P + 7], y, 1735328473);
    X = f(X, W, V, Y, C[P + 12], w, 2368359562);
    Y = D(Y, X, W, V, C[P + 5], o, 4294588738);
    V = D(V, Y, X, W, C[P + 8], m, 2272392833);
    W = D(W, V, Y, X, C[P + 11], l, 1839030562);
    X = D(X, W, V, Y, C[P + 14], j, 4259657740);
    Y = D(Y, X, W, V, C[P + 1], o, 2763975236);
    V = D(V, Y, X, W, C[P + 4], m, 1272893353);
    W = D(W, V, Y, X, C[P + 7], l, 4139469664);
    X = D(X, W, V, Y, C[P + 10], j, 3200236656);
    Y = D(Y, X, W, V, C[P + 13], o, 681279174);
    V = D(V, Y, X, W, C[P + 0], m, 3936430074);
    W = D(W, V, Y, X, C[P + 3], l, 3572445317);
    X = D(X, W, V, Y, C[P + 6], j, 76029189);
    Y = D(Y, X, W, V, C[P + 9], o, 3654602809);
    V = D(V, Y, X, W, C[P + 12], m, 3873151461);
    W = D(W, V, Y, X, C[P + 15], l, 530742520);
    X = D(X, W, V, Y, C[P + 2], j, 3299628645);
    Y = t(Y, X, W, V, C[P + 0], U, 4096336452);
    V = t(V, Y, X, W, C[P + 7], T, 1126891415);
    W = t(W, V, Y, X, C[P + 14], R, 2878612391);
    X = t(X, W, V, Y, C[P + 5], O, 4237533241);
    Y = t(Y, X, W, V, C[P + 12], U, 1700485571);
    V = t(V, Y, X, W, C[P + 3], T, 2399980690);
    W = t(W, V, Y, X, C[P + 10], R, 4293915773);
    X = t(X, W, V, Y, C[P + 1], O, 2240044497);
    Y = t(Y, X, W, V, C[P + 8], U, 1873313359);
    V = t(V, Y, X, W, C[P + 15], T, 4264355552);
    W = t(W, V, Y, X, C[P + 6], R, 2734768916);
    X = t(X, W, V, Y, C[P + 13], O, 1309151649);
    Y = t(Y, X, W, V, C[P + 4], U, 4149444226);
    V = t(V, Y, X, W, C[P + 11], T, 3174756917);
    W = t(W, V, Y, X, C[P + 2], R, 718787259);
    X = t(X, W, V, Y, C[P + 9], O, 3951481745);
    Y = K(Y, h);
    X = K(X, E);
    W = K(W, v);
    V = K(V, g);
  }
  var i = B(Y) + B(X) + B(W) + B(V);
  return i.toLowerCase();
}

//Fonction qui télécharge un fichier
function download(link, cb) {
  try {
    var h = link.indexOf('https:') > -1 ? https : http;
    var fileRequest = h.get(link, function(res) {
      var html = '';
      res.on("data", function(chunk) {
        html += chunk;
      });
      res.on('end', function() {
        if (typeof(cb) !== 'undefined') {
          cb(html);
        }
      });
      res.on('error', function() {
        console.error("[DL] Error downloading " + link);
        cb(undefined, "[DL] Error downloading " + link);
      });
    }).on('error', function() {
      console.error("[DL] Error downloading " + link);
      cb(undefined, "[DL] Error downloading " + link);
    });

  } catch (e) {
    console.error("[DL] Error downloading " + link);
    console.error(e);
    cb(undefined, e);
  }
}

//Fonction qui scrap une page de T9
function scrapT9() {
  lastUpdate = (new Date()).toGMTString();
  var tmptorrentsId = {};
  var type;
  var cb = function(data, err) {
    if (err) {
      return false;
    }
    var myregexp = /<td><i class="fa (?:fa-video-camera|fa-desktop)"(?:[^>]+)><\/i> <a title="(?:[^>]+)" href="([^"]+)"(?:[^>]+)>([^>]+)<\/a><\/td>/ig;
    var match = myregexp.exec(data);
    while (match !== null) {
      var torrentid = md5(match[1]);
      if (!tmptorrentsId[torrentid]) {
        var torrent = {
          "link": match[1],
          "type": type,
          "name": match[2],
          "id": torrentid
        };
        tmptorrentsId[torrentid] = torrent;
      }

      match = myregexp.exec(data);
    }
    scrapUrl();
  };

  var pos = 0;
  var scrapUrl = function() {
    if (pos < urlsToScrap.length) {
      var url = torrent9_url + urlsToScrap[pos].link;
      type = urlsToScrap[pos].type;
      pos += 1;
      console.error("[SCRAP] " + url);
      download(url, cb);
    } else {
      torrentsId = tmptorrentsId;
      console.error("[SCRAP] " + Object.keys(tmptorrentsId).length + " torrents scrapped");
    }
  };

  scrapUrl();
}

//Fonction qui genere la page d'index
function generateIndex(res) {
  try {
    var categories = {};
    for (var i = 0; i < urlsToScrap.length; i++) {
      var itm = urlsToScrap[i];
      if (itm.type && itm.type.length > 0) {
        categories[itm.type] = '<li><a href="http://' + http_ip + ':' + http_port + '/' + itm.type.toUpperCase() + '">' + itm.type.toUpperCase() + '</a></li>';
      }
    }
    var catHtml = [];
    for (var p in categories) {
      catHtml.push(categories[p]);
    }
    var html = [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '<title>' + http_title + '</title>',
      '</head>',
      '<body>',
      '<h2>List of available feeds:</h2>',
      '<ul>',
      catHtml.join(''),
      '</ul>',
      '</body>',
      '</html>'
    ];
    res.writeHead(200, {
      'Content-Type': 'text/html;charset=UTF-8'
    });
    res.end(html.join(''));
  } catch (e) {
    console.error("[RSS] Error generating Index " + e);
  }
}

//Fonction qui genere un flux RSS
function generateRss(res, type) {
  try {
    var rssItems = [];

    for (var p in torrentsId) {
      var torrent = torrentsId[p];
      if (torrent.type.toLowerCase() !== type) {
        continue;
      }
      var itm = ['<item>',
        '<title><![CDATA[' + torrent.name + ']]></title>',
        '<description><![CDATA[' + torrent.name + ']]></description>',
        '<link>' + torrent.link + '</link>',
        '<guid>' + torrent.id + '</guid>',
        '<enclosure url="http://' + http_ip + ':' + http_port + '/download/' + torrent.id + '" type="application/x-bittorrent" length="10000" />',
        '</item>'
      ];
      //'<pubDate>Fri, 18 May 2018 10:04:17 +0200</pubDate>',
      rssItems.push(itm.join(''));
    }

    var rss = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
      '<channel>',
      '<atom:link href="http://' + http_ip + ':' + http_port + '/' + type + '" rel="self" type="application/rss+xml" />',
      '<title>' + http_title + '</title>',
      '<description>Most popular Torrents in the smallest file size RSS Feed</description>',
      '<link>http://' + http_ip + '/</link>',
      '<language>en-us</language>',
      '<lastBuildDate>' + lastUpdate + '</lastBuildDate>',
      rssItems.join(''),
      '</channel>',
      '</rss>'
    ];
    res.writeHead(200, {
      'Content-Type': 'application/atom+xml;charset=UTF-8'
    });
    res.end(rss.join(''));
  } catch (e) {
    console.error("[RSS] Error " + e);
  }
}

//Fonction qui recupere l'url du torrent et qui effectue une redirection
function generateDownload(res, url) {
  try {
    var cb = function(data, err) {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Error downloading " + url);
        return false;
      }
      var myregexp = /<a class="btn btn-danger download" href="([^"]+)">/ig;
      var match = myregexp.exec(data);
      if (match !== null) {
        res.writeHead(302, {
          'Content-Type': 'text/html',
          'Location': torrent9_url + match[1]
        });
        res.end('Redirecting to torrent link');
      } else {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Torrent link not found in " + url);
      }
    };

    download(url, cb);

  } catch (e) {
    console.error("[DL] Error " + e);
  }
}

//Fonction qui lance le serveur
function serverStart() {
  try {
    var server = http.createServer(function(req, res) {
      try {
        var ip_client = req.connection.remoteAddress;
        var error = true;
        var error_msg = 'Permission denied';
        if (req && req.url === "/favicon.ico") {
          error = false;
          res.writeHead(200, {
            'Content-Type': 'image/x-icon'
          });
          res.end();
        } else if (req && req.method && req.method === "GET" && req.url) {
          var prms = req.url.toLowerCase().split("/");
          if (prms.length === 2) {
            error = false;
            if (prms[1].length === 0) {
              console.error('[WWW] ip_client: ' + ip_client + ' - Index Page');
              generateIndex(res);
            } else {
              var type = prms[1].toLowerCase();
              console.error('[RSS] ip_client: ' + ip_client + ' - type: ' + type);
              generateRss(res, type);
            }
          } else if (prms.length === 3 && prms[1].length > 0 && prms[2].length > 0 && prms[1].toLowerCase() === "download" && torrentsId[prms[2].toLowerCase()]) {
            error = false;
            var torrentid = prms[2].toLowerCase();
            console.error('[DL] ip_client: ' + ip_client + ' - TorrentId: ' + torrentid);
            generateDownload(res, torrent9_url + torrentsId[torrentid].link);
          }
        }

        if (error === true) {
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          });
          res.end(error_msg);
          console.error('[WWW] ip_client: ' + ip_client + ' - url: ' + req.url + ' - msg: ' + error_msg);
        }

      } catch (e) {
        console.error(e);
      }
    });
    server.listen(http_port);
    console.log('[WWW] HTTP Server started on port ' + http_port);

  } catch (e) {
    console.error(e);
  }
}


//STARTER
setInterval(function() {
  scrapT9();
}, 1800000);
serverStart();
scrapT9();
