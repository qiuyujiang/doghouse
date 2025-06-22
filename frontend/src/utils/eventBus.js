import Vue from 'vue';  
let EventBus={};
let eventArray=[];
if(!EventBus.instance){
    EventBus.instance=new Vue();
}

EventBus.$on=function(eventName,fn){
    if(eventArray.indexOf(eventName)==-1){
        eventArray.push(eventName)
    }
    EventBus.instance.$on(eventName,fn);
}

EventBus.$emit=function(eventName,data){
    EventBus.instance.$emit(eventName, data);
}

EventBus.offAll=function(eventName,data){
    eventArray.forEach((item)=>{
        EventBus.instance.$off(item);
    });
}
export default EventBus;  