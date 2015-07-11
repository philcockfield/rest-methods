import _ from 'lodash';
import Promise from 'bluebird';


class XhrError extends Error {
  constructor(xhr, message) {
    super(message || 'Failed while interacting with server');
    this.status = xhr.status;
  }
}


const handleComplete = (xhr, resolve, reject) => {
      if (xhr.status !== 200) {
        reject(new XhrError(xhr));
      } else {
        resolve(JSON.parse(xhr.responseText));
      }
};



export default {
  get(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = () => handleComplete(xhr, resolve, reject);
        xhr.send();
    });
  },


  post(url, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) { handleComplete(xhr, resolve, reject); }
        };
        if (_.isObject(data)) { data = JSON.stringify(data); }
        xhr.send(data);
    });
  }
};
