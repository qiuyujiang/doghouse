Promise.prototype.finally = function (callback) {
    let Promise = this.constructor;
    return this.then(
      value  => Promise.resolve(callback()).then(() => value),
      reason => Promise.resolve(callback()).then(() => { throw reason })
    );
};

Date.prototype.formatDate = function (fmt) { 
  if(!this) return;
  var o = {
      "M+": this.getMonth() + 1, 
      "d+": this.getDate(),
      "h+": this.getHours(), 
      "m+": this.getMinutes(), 
      "s+": this.getSeconds(), 
      "q+": Math.floor((this.getMonth() + 3) / 3), 
      "S": this.getMilliseconds() 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
Number.prototype.formatDate = function (fmt) { 
  if(!this) return;
  let date = new Date(this);
  return date.formatDate(fmt);
}
String.prototype.formatDate = function (fmt) {
  //2017-12-22 16:47:00
  // let params=this.replace(/[-\s]/g,':').split(':')
  // params[1]-=1;
  // params= params.join('-')
  // console.log(params)
  if(!this) return;
  let result=new Date(this);
  return result.formatDate(fmt);
}

String.prototype.gblength = function() {    
  var l = this.length;   
  var blen = 0;   
  for(let i=0; i<l; i++) {   
    if ((this.charCodeAt(i) & 0xff00) != 0) {   
      blen+=1;   
    }else{
      blen +=0.5;   
    }
  }
  if(blen<1){
    blen=Math.floor(blen)
  }else{
    blen=Math.ceil(blen)
  }
  return blen;    
}    
