import _ from 'lodash';


const handleComplete = (xhr, callback) => {
      if (!_.isFunction(callback)) { return; }
      if (xhr.status !== 200) {
        callback({ status: xhr.status })
      } else {
        callback(null, JSON.parse(xhr.responseText));
      }
};



export default {
  get(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = () => handleComplete(xhr, callback);
    xhr.send();
  },


  post(url, json, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) { handleComplete(xhr, callback); }
    };
    xhr.send(JSON.stringify(json));
  }
};
