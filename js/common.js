/********************
 * 데이타조회
 *******************/

function loadJsonToHtml(jsonArr) {
  console.log(">>>>>> loadJsonToHtml() 01 ");
  for (let i = 0; i < jsonArr.length; i++) {
    convertJsonToHtml(i + 1, jsonArr[i]["url"], jsonArr[i]["method"], jsonArr[i]["title"]);
  }
}

async function convertJsonToHtml(idx, url, method, title) {
  document.getElementById("jsonFile" + idx).innerHTML = url;
  document.getElementById("title" + idx).innerHTML = "[" + idx + "] " + title;
  let resData = null;
  if (method == "get") {
    const response = await axios.get(url);
    resData = response.data;
  } else if (method == "post") {
    const response = await axios.post(url);
    resData = response.data;
  } else if (method == "put") {
    const response = await axios.put(url);
    resData = response.data;
  }
  let obj = createTable(resData, { idx, url, title });
  document.getElementById("html" + idx).appendChild(obj);
}

/********************
 * JsonToHtml
 *******************/

// 테이블 생성 함수
function createTable(jsonObj, info) {
  console.log(" ▶ " + JSON.stringify(info, null, "  "), jsonObj);
  if (jsonObj instanceof Array) {
    return _make_array(jsonObj);
  } else if (jsonObj instanceof Object) {
    return _make_object(jsonObj);
  } else {
    return null;
  }
}

// 테이블 생성 함수 :: array
function _make_array(jsonObj) {
  let _table = document.createElement("table");
  _table.setAttribute("class", "arr_table");

  let _thead = document.createElement("thead"); // 헤더 생성
  _thead.setAttribute("class", "arr_thead");
  let _htr = document.createElement("tr");
  _htr.setAttribute("class", "arr_htr");

  let _hthx = document.createElement("th");
  _hthx.setAttribute("class", "arr_hthx");
  _hthx.appendChild(_out_title("_r"));
  _htr.appendChild(_hthx);

  for (let key in jsonObj[0]) {
    let _hth = document.createElement("th");
    _hth.setAttribute("class", "arr_hth");
    _hth.appendChild(_out_title(key));
    _htr.appendChild(_hth);
  }
  _thead.appendChild(_htr);
  _table.appendChild(_thead);

  let _tbody = document.createElement("tbody"); // 바디 생성
  _tbody.setAttribute("class", "arr_tbody");
  for (let i = 0; i < jsonObj.length; i++) {
    let _tr = document.createElement("tr");
    _tr.setAttribute("class", "arr_tr");
    let _tdx = document.createElement("td");
    _tdx.setAttribute("class", "arr_tdx");
    _tdx.appendChild(_out_value("", "" + (i + 1) + "/" + jsonObj.length)); // 일반값인 경우
    _tr.appendChild(_tdx);
    for (let key in jsonObj[i]) {
      let _td = document.createElement("td");
      _td.setAttribute("class", "arr_td");
      let value = jsonObj[i][key];
      if (value instanceof Array) {
        _td.appendChild(_make_array(value));
      } else if (value instanceof Object) {
        _td.appendChild(_make_object(value));
      } else {
        _td.appendChild(_out_value(key, value)); // 일반값인 경우
      }
      _tr.appendChild(_td);
    }
    _tbody.appendChild(_tr);
  }
  _table.appendChild(_tbody);
  return _table;
}

// 테이블 생성 함수 :: object
function _make_object(jsonObj) {
  let _table = document.createElement("table");
  _table.setAttribute("class", "obj_table");
  let _tbody = document.createElement("tbody"); // 바디 생성
  _tbody.setAttribute("class", "obj_tbody");
  for (let key in jsonObj) {
    let value = jsonObj[key];
    let _tr = document.createElement("tr");
    _tr.setAttribute("class", "obj_tr");
    let _td1 = document.createElement("td");
    _td1.setAttribute("class", "obj_td1");
    _td1.appendChild(_out_title(key));
    _tr.appendChild(_td1);
    let _td2 = document.createElement("td");
    _td2.setAttribute("class", "obj_td2");
    if (value instanceof Array) {
      _td2.appendChild(_make_array(value));
    } else if (value instanceof Object) {
      _td2.appendChild(_make_object(value));
    } else {
      _td2.appendChild(_out_value(key, value));
    }
    _tr.appendChild(_td2);
    _tbody.appendChild(_tr);
  }
  _table.appendChild(_tbody);
  return _table;
}

// 타이블
function _out_title(value) {
  let result = "";
  if (value == null || value == "null") {
    result = "";
  } else {
    result = value;
    result += getMetaName(value);
  }
  return document.createTextNode(result);
}

// 값
function _out_value(meta, value) {
  let result = "";
  if (value == null || value == "null") {
    result = "";
  } else {
    result = value;
    result += getCodeValue(meta, value);
  }
  return document.createTextNode(result);
}

/********************
 * 메타 값 조회
 *******************/

function getCodeValue(meta, value) {
  let result = "";
  for (let i = 0; i < _codes.length; i++) {
    if (_codes[i].meta == meta) {
      if (_codes[i].value === value) {
        result = ":" + _codes[i].text;
        break;
      }
    }
  }
  return result;
}

function getMetaName(meta) {
  let result = "";
  for (let i = 0; i < _metas.length; i++) {
    if (_metas[i].meta === meta) {
      result = " :: " + _metas[i].name;
      break;
    }
  }
  return result;
}

/********************
 *
 *******************/
