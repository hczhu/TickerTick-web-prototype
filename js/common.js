const SEARCH_URL = "https://api.tickertick.com/feed?";
const USER_ACTION_URL = "https://apiw.tickertick.com/story_feedback?";
const MAX_LOCAL_STORAGE_ITEMS = 10000;


function createUserIdStr() {
  return Math.floor(Math.random() * 10**9 + 10**8).toString(16)  + "_" + Date.now().toString(16);
}

function writeObjToLocalStorage(key, obj) {
  try {
    console.log(typeof(key) + " " + JSON.stringify(key));
    obj.__ts = new Date().getTime();
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (e) {
    console.log("Failed to write key: " + key + " to local storage.");
    return false;
  }
  return true;
}

function readObjFromLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.log("Failed to read key: " + key + " from local storage.");
    return null;
  }
}

function getUserIdStr() {
  user = readObjFromLocalStorage("user");
  if (user != null) {
    user = user.user;
  }
  params = getUrlParams();
  if ("user" in params) {
    user = params["user"];
  }
  if (user == null) {
    user = createUserIdStr();
    writeObjToLocalStorage("user", {
      user: user
    });
    console.log("Created an id for a first time user: " + user);
  }
  return user; 
}

const USER = getUserIdStr();
console.log("User: " + USER);

function getUrlParams(url) {
  // http://stackoverflow.com/a/23946023/2407309
  if (typeof url == 'undefined') {
    url = window.location.search
  }
  var url = url.split('#')[0] // Discard fragment identifier.
    var urlParams = {}
  var queryString = url.split('?')[1]
    if (!queryString) {
      if (url.search('=') !== false) {
        queryString = url
      }
    }
  if (queryString) {
    var keyValuePairs = queryString.split('&')
      for (var i = 0; i < keyValuePairs.length; i++) {
        var keyValuePair = keyValuePairs[i].split('=')
          var paramName = keyValuePair[0]
          var paramValue = keyValuePair[1] || ''
          urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '))
      }
  }
  return urlParams
}

const should_show_all = ('all' in getUrlParams());

function getQueryFeedUrl() {
  params_dict = getUrlParams();
  params = [];
  for (k in params_dict) {
    if (k != "user") {
      params.push(k + "=" + params_dict[k]);
    }
  }
  params.push('user=' + USER)
  url = SEARCH_URL + params.join('&');
  return url;
}

function getFeedUrlFromForms(lang, relevance, ticker, ignore_q = true) {
  var params_dict = getUrlParams();
  var q = "f" + relevance + ":" + ticker;
  if (!ignore_q) {
    if ("q" in params_dict) {
      q = params_dict["q"];
    }
  }
  var url = SEARCH_URL + "q=" + q  + "&lang=" + lang;
  if ("all" in params_dict) {
    url += "&all=1";
  }
  if ("n" in params_dict) {
    url += "&n=" + params_dict["n"];
  }
  url += "&user=" + USER;
  return url;
}

function getFormValuesFromUrl() {
  var params_dict = getUrlParams();
  var [lang, relevance, ticker] = ["en,cn", "3", "fb"];
  if ("lang" in params_dict) { lang = params_dict["lang"]; }
  if ("relevance" in params_dict) { relevance = params_dict["relevance"]; }
  if ("ticker" in params_dict) { ticker = params_dict["ticker"]; }
  return [lang, relevance, ticker];
}

function getStockFeedUrl() {
  keys = Object.keys(getUrlParams());
  if (keys.length > 1) {
    return null;
  }
  if (keys.length == 1 && keys[0] == "q") {
    return null;
  }
  ticker = keys.length > 0 ? keys[0] : "fb";
  url = SEARCH_URL + "user=" + USER + "&q=tk:" + ticker;
  return url;
}

function getIfApiUrl() {
  stock_url = getStockFeedUrl();
  if (stock_url != null) {
    return stock_url;
  }
  return getQueryFeedUrl();
}

function fetchStories(url, last = 0) {
  const delimiter = url.indexOf('?') < 0 ? '?' : '&';
  url = url + delimiter + 'last=' + last;
  console.log('Fetching ' + url);
  return fetch(url).then(response => {
    console.log("Got response: ", response.json);
    return response.json()
  })
  .then(data => {
    // This is an array
    var stories = data.stories;
    console.log("Fetched " + stories.length + " stories from " + url);
    for (var i in stories) {
      stories[i].id_str = stories[i].id;
      stories[i].days_ago = Math.round((Date.now() - (new Date(stories[i].time))) / 1000 / 3600 / 24)
      console.log("Added id_str and days_ago: " + stories[i])
    }
    return stories;
  })
  .catch(err => {
    console.log("Failed to fetch url: ", url, " with error: ", err);
    return [];
  });
}

function sendUserActions(action, story_ids, user_id) {
  if (user_id == null) {
    user_id = USER;
  }

  url = USER_ACTION_URL + "user=" + user_id;
  feedback_struct = {};
  feedback_struct[action] = story_ids;

  var header = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'feedback=' + JSON.stringify(feedback_struct)
  };

  // header.headers['Content-Length'] = header.body.length;

  console.log("POSTing data: " + JSON.stringify(header));
  
  fetch(url, header).then(response => {
    if (response.status != 200) {
      console.log("Got not OK response code: " + response.status + " from fetching url: " + url);
    }
  }).catch(err => {
    console.log("Failed to fetch url: " + err);
  });
}
