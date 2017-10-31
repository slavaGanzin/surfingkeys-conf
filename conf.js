//---- Cleanup ----//
// Unmap undesired defaults
var unmaps = [ "sb" ,  "sw", "ob"
             , "ow" ,  "cp", ";cp"
             , ";ap", "spa", "spb"
             , "spd", "sps", "spc"
             , "spi", "sfr", "zQ"
             , "zz" ,  "zR", "ab"
             , "Q"  ,   "q", "ag"
             , "af" ,  ";s"
             ];

unmaps.forEach(function(u) {
  unmap(u);
});

var rmSearchAliases =
  { "s" : [ "g", "d", "b"
          , "w", "s", "h" ]
  };

Object.keys(rmSearchAliases).forEach(function(k) {
  rmSearchAliases[k].forEach(function(v) {
    removeSearchAliasX(v, k);
  });
});

//---- Settings ----//
settings.hintAlign = "left";
settings.omnibarSuggestionTimeout = 500;
settings.hintGroups = true;
settings.hintGroupStart = "middle";
settings.richHintsForKeystroke = 1;

//---- Theme ----//
settings.theme = `
    /* Disable RichHints CSS animation */
    .expandRichHints {
        animation: 0s ease-in-out 1 forwards expandRichHints;
    }
    .collapseRichHints {
        animation: 0s ease-in-out 1 forwards collapseRichHints;
    }
`;

//---- Maps ----//
// Left-hand aliases
// Movement
map('w', 'k');
map('s', 'j');

// Right-hand aliases
// Tab Navigation
map('J', 'E');
map('K', 'R');

// History
map('H', 'S');
map('L', 'D');


//---- Mapkeys ----//
const ri = { repeatIgnore: true };

mapkey('=w',  "Lookup whois information for domain", whois,           ri);
mapkey('=d',  "Lookup dns information for domain",   dns,             ri);
mapkey('=D',  "Lookup all information for domain",   dnsVerbose,      ri);
mapkey(';se', "#11Edit Settings",                    editSettings,    ri);
mapkey(';pd', "Toggle PDF viewer from SurfingKeys",  togglePdfViewer, ri);
mapkey('gi',  "Edit current URL with vim editor",    vimEditURL,      ri);


function mapsitekey(domainRegex, key, desc, f, opts) {
    opts = opts || {};
    mapkey(`\\${key}`, desc,  f, Object.assign({}, opts, { domain: domainRegex }));
}

function mapsitekeys(domainRegex, maps) {
    maps.forEach(function(map) {
        mapsitekey(domainRegex, map[0], map[1], map[2]);
    });
}

mapsitekeys(/(amazon\.com)/i, [
    ['fs', "Fakespot", fakeSpot],
    // TODO: Add to cart
    // TODO:
]);

mapsitekeys(/(yelp\.com)/i, [
    ['fs', "Fakespot", fakeSpot],
]);

mapsitekeys(/(youtube\.com)/i, [
    ['F',  "Toggle fullscreen", ytFullscreen],
]);

mapsitekeys(/(vimeo\.com)/i, [
    ['F', "Toggle fullscreen",  vimeoFullscreen],
]);

mapsitekeys(/(github\.com)/i, [
    ['s',  "Toggle Star", ghToggleStar],
]);

mapsitekeys(/(gitlab\.com)/i, [
    ['s',  "Toggle Star", glToggleStar],
]);

mapsitekeys(/(reddit\.com)/i, [
    ['c',  "Collapse comment", redditCollapseComment],
    ['v',  "Cast vote", redditVote],
]);

mapsitekeys(/(news\.ycombinator\.com)/i, [
    ['c',  "Collapse comment", hnCollapseComment],
    ['v',  "Cast vote", hnVote],
]);

//---- Search & completion ----//
// Search leader
const sl = 'a';

// This is a base64-encoded image used as a placeholder for
// the crunchbase Omnibar results if they don't have an image
const blank = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAAAAAByaaZbAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+EICxEMErRVWUQAAABOdEVYdFJhdyBwcm9maWxlIHR5cGUgZXhpZgAKZXhpZgogICAgICAyMAo0NTc4Njk2NjAwMDA0OTQ5MmEwMDA4MDAwMDAwMDAwMDAwMDAwMDAwCnwMkD0AAAGXSURBVEjH1ZRvc4IwDMb7/T8dbVr/sEPlPJQd3g22GzJdmxVOHaQa8N2WN7wwvyZ5Eh/hngzxTwDr0If/TAK67POxbqxnpgCIx9dkrkEvswYnAFiutFSgtQapS4ejwFYqbXQXBmC+QxawuI/MJb0LiCq0DICNHoZRKQdYLKQZEhATcQmwDYD5GR8DDtfqaYAMActvTiVMaUvqhZPVYhYAK2SBAwGMTHngnc4wVmFPW9L6k1PJxbSCkfvhqolKSQhsWSClizNyxwAWdzIADixQRXRmdWSHthsg+TknaztFMZgC3vh/nG/qo68TLAKrCSrUg1ulp3cH+BpItBp3DZf0lFXVOIDnBdwKkLO4D5Q3QMO6HJ+hUb1NKNWMGJn3jf4ejPKn99CXOtsuyab95obGL/rpdZ7oIJK87iPiumG01drbdggoCZuq/f0XaB8/FbG62Ta5cD97XJwuZUT7ONbZTIK5m94hBuQs8535MsL5xxPw6ZoNj0DiyzhhcyMf9BJ0Jk1uRRpNyb4y0UaM9UI7E8+kt/EHgR/R6042JzmiwgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wOC0xMVQxNzoxMjoxOC0wNDowMLy29LgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDgtMTFUMTc6MTI6MTgtMDQ6MDDN60wEAAAAAElFTkSuQmCC";

// Register Search Engine Completions
// The `completions` variable is defined in `completions.js` and
// is prepended to this file by gulp-concat.
for(var i = 0; i < completions.length; i++) {
    var s  = completions[i], // Search Engine object
        la = sl + s.alias;   // Search leader + alias

    addSearchAliasX(s.alias, s.name, s.search, sl, s.compl, s.callback);
    mapkey(la, '#8Search ' + s.name, 'Front.openOmnibar({type: "SearchEngine", extra: "' + s.alias + '"})');
}

//---- Functions ----//
function fakeSpot() {
    var url = "http://fakespot.com/analyze?url=" + window.location.href;
    window.open(url, '_blank').focus();
}

function ytFullscreen() {
    $('.ytp-fullscreen-button.ytp-button').click();
}

function vimeoFullscreen() {
    $('.fullscreen-icon').click();
}

function ghToggleStar() {
  var repo = window.location.pathname.slice(1).split("/").slice(0,2).join("/");
  var cur = $('div.starring-container > form').filter(function() {
    return $(this).css("display") === "block";
  });

  var action = "starred";
  var star = "★";
  if ($(cur).attr("class").indexOf("unstarred") === -1) {
    action = "un" + action;
    star = "☆";
  }

  $(cur).find("button").click();
  Front.showBanner(star + " Repository " + repo + " " + action);
}

function glToggleStar() {
  var repo = window.location.pathname.slice(1).split("/").slice(0,2).join("/");
  var action = $('.btn.star-btn > span').click().text().toLowerCase() + "red";
  var star = "☆";
  if (action === "starred") {
    star = "★";
  }
  Front.showBanner(star + " Repository " + repo + " " + action);
}

function vimEditURL() {
    Front.showEditor(window.location.href, function(data) {
        window.location.href = data;
    }, 'url');
}

function whois() {
    var url = "http://centralops.net/co/DomainDossier.aspx?dom_whois=true&addr=" + window.location.hostname;
    window.open(url, '_blank').focus();
}

function dns() {
    var url = "http://centralops.net/co/DomainDossier.aspx?dom_dns=true&addr=" + window.location.hostname;
    window.open(url, '_blank').focus();
}

function dnsVerbose() {
    var url = "http://centralops.net/co/DomainDossier.aspx?dom_whois=true&dom_dns=true&traceroute=true&net_whois=true&svc_scan=true&addr=" + window.location.hostname;
    window.open(url, '_blank').focus();
}

function togglePdfViewer() {
    chrome.storage.local.get("noPdfViewer", function(resp) {
        if(!resp.noPdfViewer) {
            chrome.storage.local.set({"noPdfViewer": 1}, function() {
                Front.showBanner("PDF viewer disabled.");
            });
        } else {
            chrome.storage.local.remove("noPdfViewer", function() {
                Front.showBanner("PDF viewer enabled.");
            });
        }
    });
}

function editSettings() {
    tabOpenLink("/pages/options.html");
}

function redditCollapseComment() {
    Hints.create('a.expand', Hints.dispatchMouseClick);
}

function hnCollapseComment() {
    Hints.create('a.togg', Hints.dispatchMouseClick);
}

function redditVote() {
    Hints.create('div.arrow', Hints.dispatchMouseClick);
}

function hnVote() {
    Hints.create('div.votearrow', Hints.dispatchMouseClick);
}

// vim: set ft=javascript expandtab:
