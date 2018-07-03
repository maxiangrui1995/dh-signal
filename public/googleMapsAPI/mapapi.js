window.google = window.google || {};
google.maps = google.maps || {};
(function() {
  function getScript(src) {
    document.write(
      '<script type="text/javascript" src="' + src + '"></script>'
    );
  }

  var modules = (google.maps.modules = {});
  google.maps.__gjsload__ = function(name, text) {
    modules[name] = text;
  };

  google.maps.Load = function(apiLoad) {
    delete google.maps.Load;
    apiLoad(
      [
        null,
        [
          [
            [
              "http://mt0.googleapis.com/vt?lyrs=m@152\u0026src=api\u0026hl=zh-CN\u0026",
              "http://mt1.googleapis.com/vt?lyrs=m@152\u0026src=api\u0026hl=zh-CN\u0026"
            ]
          ],
          [
            [
              "http://khm0.googleapis.com/kh?v=84\u0026hl=zh-CN\u0026",
              "http://khm1.googleapis.com/kh?v=84\u0026hl=zh-CN\u0026"
            ],
            null,
            null,
            null,
            1
          ],
          [
            [
              "http://mt0.googleapis.com/vt?lyrs=h@152\u0026src=api\u0026hl=zh-CN\u0026",
              "http://mt1.googleapis.com/vt?lyrs=h@152\u0026src=api\u0026hl=zh-CN\u0026"
            ],
            null,
            null,
            "imgtp=png32\u0026"
          ],
          [
            [
              "http://mt0.googleapis.com/vt?lyrs=t@126,r@152\u0026src=api\u0026hl=zh-CN\u0026",
              "http://mt1.googleapis.com/vt?lyrs=t@126,r@152\u0026src=api\u0026hl=zh-CN\u0026"
            ]
          ],
          null,
          [
            [
              null,
              0,
              7,
              7,
              [
                [[330000000, 1246050000], [386200000, 1293600000]],
                [[366500000, 1297000000], [386200000, 1320034790]]
              ],
              [
                "http://mt0.gmaptiles.co.kr/mt?v=kr1.13\u0026hl=zh-CN\u0026",
                "http://mt1.gmaptiles.co.kr/mt?v=kr1.13\u0026hl=zh-CN\u0026"
              ]
            ],
            [
              null,
              0,
              8,
              9,
              [
                [[330000000, 1246050000], [386200000, 1279600000]],
                [[345000000, 1279600000], [386200000, 1286700000]],
                [[348900000, 1286700000], [386200000, 1293600000]],
                [[354690000, 1293600000], [386200000, 1320034790]]
              ],
              [
                "http://mt0.gmaptiles.co.kr/mt?v=kr1.13\u0026hl=zh-CN\u0026",
                "http://mt1.gmaptiles.co.kr/mt?v=kr1.13\u0026hl=zh-CN\u0026"
              ]
            ],
            [
              null,
              0,
              10,
              19,
              [
                [[329890840, 1246055600], [386930130, 1284960940]],
                [[344646740, 1284960940], [386930130, 1288476560]],
                [[350277470, 1288476560], [386930130, 1310531620]],
                [[370277730, 1310531620], [386930130, 1320034790]]
              ],
              [
                "http://mt0.gmaptiles.co.kr/mt?v=kr1.13\u0026hl=zh-CN\u0026",
                "http://mt1.gmaptiles.co.kr/mt?v=kr1.13\u0026hl=zh-CN\u0026"
              ]
            ],
            [
              null,
              3,
              7,
              7,
              [
                [[330000000, 1246050000], [386200000, 1293600000]],
                [[366500000, 1297000000], [386200000, 1320034790]]
              ],
              [
                "http://mt0.gmaptiles.co.kr/mt?v=kr1p.12\u0026hl=zh-CN\u0026",
                "http://mt1.gmaptiles.co.kr/mt?v=kr1p.12\u0026hl=zh-CN\u0026"
              ]
            ],
            [
              null,
              3,
              8,
              9,
              [
                [[330000000, 1246050000], [386200000, 1279600000]],
                [[345000000, 1279600000], [386200000, 1286700000]],
                [[348900000, 1286700000], [386200000, 1293600000]],
                [[354690000, 1293600000], [386200000, 1320034790]]
              ],
              [
                "http://mt0.gmaptiles.co.kr/mt?v=kr1p.12\u0026hl=zh-CN\u0026",
                "http://mt1.gmaptiles.co.kr/mt?v=kr1p.12\u0026hl=zh-CN\u0026"
              ]
            ],
            [
              null,
              3,
              10,
              null,
              [
                [[329890840, 1246055600], [386930130, 1284960940]],
                [[344646740, 1284960940], [386930130, 1288476560]],
                [[350277470, 1288476560], [386930130, 1310531620]],
                [[370277730, 1310531620], [386930130, 1320034790]]
              ],
              [
                "http://mt0.gmaptiles.co.kr/mt?v=kr1p.12\u0026hl=zh-CN\u0026",
                "http://mt1.gmaptiles.co.kr/mt?v=kr1p.12\u0026hl=zh-CN\u0026"
              ]
            ]
          ],
          [
            [
              "http://cbk0.googleapis.com/cbk?",
              "http://cbk1.googleapis.com/cbk?"
            ]
          ],
          [
            [
              "http://khmdb0.googleapis.com/kh?v=37\u0026hl=zh-CN\u0026",
              "http://khmdb1.googleapis.com/kh?v=37\u0026hl=zh-CN\u0026"
            ]
          ],
          [
            [
              "http://mt0.googleapis.com/mapslt?hl=zh-CN\u0026",
              "http://mt1.googleapis.com/mapslt?hl=zh-CN\u0026"
            ]
          ],
          [
            [
              "http://mt0.googleapis.com/mapslt/ft?hl=zh-CN\u0026",
              "http://mt1.googleapis.com/mapslt/ft?hl=zh-CN\u0026"
            ]
          ],
          [
            [
              "http://mt0.googleapis.com/vt?hl=zh-CN\u0026",
              "http://mt1.googleapis.com/vt?hl=zh-CN\u0026"
            ]
          ]
        ],
        [
          "zh-CN",
          "US",
          null,
          0,
          null,
          "http://maps.google.com",
          window.googleMapsFilesUrl + "mapfiles/",
          "http://gg.google.com",
          "https://maps.googleapis.com",
          "http://maps.googleapis.com"
        ],
        [window.googleMapsFilesUrl + "mapfiles/api-3/16/2", "3.4.9"],
        [843083496],
        1,
        null,
        null,
        null,
        null,
        0,
        "",
        null,
        null,
        0
      ],
      loadScriptTime
    );

    window.google.maps.Load = function(apiLoad) {
      delete window.google.maps.Load;
    };
  };
  var loadScriptTime = new Date().getTime();
  getScript(window.googleMapsFilesUrl + "mapfiles/api-3/16/2/main.js");
})();
