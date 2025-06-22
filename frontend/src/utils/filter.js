import Vue from 'vue'

/* 千位符 */
Vue.filter('kilbit',val=>{
    if(val){
        if(typeof val == 'number'){
            val = val.toString();
        }
        return val.replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
    }else{
        return 0;
    }
})