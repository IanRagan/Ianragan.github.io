// Dom7
var $$ = Dom7;

var Repo = this;
// Init App
var Repo = new Framework7({
  id: 'co.shuga.repo',
  root: '#app',
  theme: "ios",
  methods: {
    hideCydia: function() {
      document.querySelector(".navbar").parentElement.removeChild(document.querySelector(".navbar"));
      for (var i = document.querySelectorAll(".hideCydia").length - 1; i >= 0; i--) {
        document.querySelectorAll(".hideCydia")[i].parentElement.removeChild(document.querySelectorAll(".hideCydia")[i]);
      }
    },
    initHome: function() {
      if(Repo.device.ios == false) {
        // document.getElementById("cydiaAdd").parentElement.removeChild(document.getElementById("cydiaAdd"));
      }
    },
    initPackage: function() {
      this.hideCydia();

      bundleId = window.location.hash.substr(1);
      currentiOS = parseFloat(
  ('' + (/CPU.*OS ([0-9_]{1,})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
  .replace('undefined', '3_2').replace('_', '.').replace('_', ''));

      var req = new XMLHttpRequest();
      req.open("GET", "json/" + bundleId + ".json", true);
      req.send();
      req.onload = function (e) {
        if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
          var resp = JSON.parse(req.responseText);

          var miniOS = parseFloat(resp.works_min.replace(".","_").replace(/\./g,"").replace("_","."));
          var maxiOS = parseFloat(resp.works_max.replace(".","_").replace(/\./g,"").replace("_","."));

          // Package description
          document.getElementById("pkgName").innerHTML = resp.name;
          document.getElementById("pkgAuthor").innerHTML = resp.author;
          document.getElementById("pkgVer").innerHTML = "v" + resp.version;
          document.getElementById("pkgDesc").innerHTML = resp.description;

          // Supported iOS versions
          if(String(currentiOS) == "NaN") {
            document.getElementById("iosMin").innerHTML = resp.works_min;
            document.getElementById("iosMax").innerHTML = resp.works_max;
            document.getElementById("youriOSVer").style.display = "none";
          } else {
            document.getElementById("youriOSVer").innerHTML = "You are running iOS " + currentiOS + ".";
            if(miniOS <= currentiOS && maxiOS >= currentiOS) {
              document.getElementById("iosWorks").innerHTML = "This package works on your device!";
              document.getElementById("iosWorks").parentElement.style.background = "#d2ffbe";
            } else {
              document.getElementById("iosWorks").innerHTML = "This package does not work on your device!";
              document.getElementById("iosWorks").parentElement.style.background = "#ffbfbf";
            }
          }

          // Screenshots and Images
          var screenshotList = "";
          for (var i = resp.screenshots.length - 1; i >= 0; i--) {
            screenshotList += `<div class="swiper-slide"><img class="screenshot" src="img/screenshots/${resp.screenshots[i]}"></div>`;
          }
          document.getElementById("screenshotList").innerHTML = screenshotList;

          if(resp.screenshots.length == 0) {
            document.getElementById("screenshotBlock").parentElement.removeChild(document.getElementById("screenshotBlock"));
          }


          document.getElementById("pkgIcon").src = "img/packages/" + resp.icon;
           
        }
      };
    }
  },
  routes: routes,
});

Repo.error = function(eventDetails, error) {
  console.error(error);
  var errorMessage = Repo.toast.create({
    text: "An error occured when " + eventDetails + " Returned with the error: \"" + error + "\"",
    closeTimeout: 3000,
  });
  errorMessage.open();
}

