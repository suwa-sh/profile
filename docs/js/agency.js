// Agency Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){
            $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    d3.csv("profile/data/know-how.csv", function(error, data) {
//      console.log(data);
      updateSummary(data);
    });

    d3.csv("profile/data/products.csv", function(error, data) {
      updateProducts(data);
    });

    d3.csv("profile/data/careers.csv", function(error, data) {
//      console.log(data);
      updateCareers(data);
    });

    d3.csv("profile/data/projects.csv", function(error, data) {
//      console.log(data);
      updateProjects(data);
    });

    d3.csv("profile/data/public_relations.csv", function(error, data) {
//      console.log(data);
      updatePublicRelations(data);
    });

})(jQuery); // End of use strict

function updateSummary(summaries) {
  summaries.forEach(function(curSummary) {
//      console.log(curSummary);
    $('#services-container').append('\
      <div class="col-md-4">\
        <span class="fa-stack fa-4x">\
          <i class="fa fa-circle fa-stack-2x text-primary"></i>\
          <i class="fa ' + curSummary.code + ' fa-stack-1x fa-inverse"></i>\
        </span>\
        <h4 class="service-heading">' + curSummary.name + '</h4>\
        <p class="text-muted">' + curSummary.description + '</p>\
      </div>\
    ');
  });
}

function updateProducts(products) {
  products.forEach(function(curProduct) {
//      console.log(curProduct);
    $('#products-conteiner').append('\
      <div class="col-md-4 col-sm-6 portfolio-item">\
        <a href="' + curProduct.url + '" class="portfolio-link" data-toggle="modal">\
          <div class="portfolio-hover">\
            <div class="portfolio-hover-content">\
              <i class="fa fa-plus fa-3x"></i>\
            </div>\
          </div>\
          <img src="img/product/' + curProduct.code + '.png" class="img-responsive" alt="">\
        </a>\
        <div class="portfolio-caption">\
          <h4>' + curProduct.name + '</h4>\
          <p class="text-muted">' + curProduct.category + '</p>\
        </div>\
      </div>\
    ');
  });
}

function updateCareers(careers) {
  var isLeft = true;
  careers.forEach(function(curCareer) {
    var classStr = "";
    if (isLeft) {
      classStr = "";
      isLeft = false;
    } else {
      classStr = 'class="timeline-inverted"'
      isLeft = true;
    }

    $('#careers-last').before('\
      <li ' + classStr + '>\
        <div class="timeline-image">\
          <img class="img-circle img-responsive" src="img/logos/logo_' + curCareer.code + '.jpg" alt="" style="height: 100%">\
        </div>\
        <div class="timeline-panel">\
          <div class="timeline-heading">\
            <h4>' + curCareer.start.substr(0, 4) + '-' + curCareer.end.substr(0, 4) + '</h4>\
            <h4 class="subheading">' + curCareer.name + '</h4>\
          </div>\
          <div class="timeline-body">\
            <p class="text-muted">' + curCareer.description + '</p>\
          </div>\
        </div>\
      </li>\
    ');
  });
}

function updateProjects(projects) {

  var industries = [];
  var roles = [];
  var mws = [];
  var langs = [];
  projects.forEach(function(curProject) {
    pushCsv(industries, curProject.customer_industry);
    pushCsv(roles, curProject.roles);
    pushCsv(mws, curProject.mw_pkg);
    pushCsv(langs, curProject.language);
  });

  // TODO スクロールされてきたらアニメーションをかける
  // 業種
  renderSummaryPieChart('業種', '#industory-chart', industries)
  // ロール
  renderSummaryPieChart('ロール', '#role-chart', roles)
  // MW/PKG
  renderSummaryPieChart('MW/PKG', '#mw-chart', mws)
  // 言語
  renderSummaryPieChart('言語', '#language-chart', langs)

}

function pushCsv(list, csvString) {
  if (csvString) {
    var values = csvString.split(',');
    values.forEach(function(curValue) {
      list.push(curValue);
    });
  }
}

function renderSummaryPieChart(title, elemId, names) {
  var ctx = $(elemId);

  // カウントオブジェクトList (name, count)
  var countObjList = [];
  // namesを全件ループ
  names.forEach(function(curName) {
    // keyが存在しなければ追加
    var isExist = false
    countObjList.forEach(function(curCountObj){
      if (curCountObj.name === curName) {
        curCountObj.count = curCountObj.count + 1;
        isExist = true;
        return;
      }
    });
    if (! isExist) {
      var curCountObj = {};
      curCountObj.name = curName;
      curCountObj.count = 1;
      countObjList.push(curCountObj);
    }
  });

  // sort(count:desc, name:asc)
  countObjList.sort(function(left, right) {
    if (left.count < right.count) {
      return 1;
    } else if (left.count == right.count) {
      if(left.name < right.name) {
        return -1;
      } else {
        return 1;
      }
    }
    return -1;
  });

  // 値設定
  var labels = [];
  var values = [];
  countObjList.forEach(function(curCountObj) {
    // labels = カウントマップ.keyList
    labels.push(curCountObj.name);
    // values = カウントマップ.valueList
    values.push(curCountObj.count);
  });

  // 配色設定
  var backgroundColors = [];
  var borderColors = [];
  values.forEach(function(curValue) {
    var curColor = chroma.random().rgb();
    backgroundColors.push('rgba(' + curColor[0] + ', ' + curColor[1] + ', ' + curColor[2] + ', 0.6)')
    borderColors.push('rgba(' + curColor[0] + ', ' + curColor[1] + ', ' + curColor[2] + ', 1)')
  });

  // 描画
  var data = {
    datasets: [{
      data: values,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 2
    }],
    labels: labels
  };
  return new Chart(ctx,{
      type: 'doughnut',
      data: data,
      options: {
        title: {
            display: true,
            text: title,
            fontSize: 24
        },
        legend: {
          display: false
        }
      }
  });

}


function updatePublicRelations(prs) {
  console.log(prs);
  prs.forEach(function(curPr) {
//      console.log(curSummary);
    $('#pr-container').append('\
      <div class="col-md-4">\
        <span class="fa-stack fa-4x">\
          <i class="fa fa-circle fa-stack-2x"></i>\
          <i class="fa ' + curPr.code + ' fa-stack-1x fa-inverse"></i>\
        </span>\
        <h4 class="service-heading">' + curPr.name + '</h4>\
        <p class="text-muted">' + curPr.description + '</p>\
      </div>\
    ');
  });
}
