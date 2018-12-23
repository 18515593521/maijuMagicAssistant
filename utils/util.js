const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//获取数据在数组中的索引值
function getIndexFromArray(dataArr, key, value) {
  var index = -1;

  for (var i = 0; i < dataArr.length; i++) {
    var OneObj = dataArr[i];
    if (key) {
      if (OneObj[key] == value) {
        return i;
      }
    } else {
      if (OneObj == value) {
        return i;
      }
    }
  }

  return index;
}
//将秒转换成 时间格式
function switchTime(timestamp, type) {
  var myDate = new Date(timestamp);

  var year = myDate.getFullYear();
  var month = myDate.getMonth();
  month += 1;
  if (month < 10) {
    month = "0" + month;
  }

  var day = myDate.getDate();
  if (day < 10) {
    day = "0" + day;
  }

  var hour = myDate.getHours();
  if (hour < 10) {
    hour = "0" + hour;
  }

  var minute = myDate.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }

  var second = myDate.getSeconds();
  if (second < 10) {
    second = "0" + second;
  }

  var time = '';
  if (type == "date") {
    return time = year + "-" + month + "-" + day;
  } else if (type == "second") {
    return time = hour + ":" + minute;
  } else if (type == "minute") {
    return time = hour + ":" + minute + ":" + second;
  } else if (type == "dateTime") {
    return  time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  } else {
   return time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }

}
function judgeDuration(m) {
    return m < 10 ? '0' + m : m
}


module.exports = {
  formatTime: formatTime,
  getIndexFromArray: getIndexFromArray,
  switchTime: switchTime
}