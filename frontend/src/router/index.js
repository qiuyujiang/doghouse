import { createRouter, createWebHashHistory} from 'vue-router'

const routes = [
  {path: '/', component: () => import('@/pages/doghouse/doghouse_home.vue')}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeResolve((to, from, next) => {
  /* 没有该路由 */
  if(to.matched.length==0){
    next('/lost');
    return;
  }
  /* 不需要登入验证 */
  if (to.meta.noCheck) {
    next();
    return;
  }
  /* 需要验证 */
  if (to.meta.needJoin) {
    checkRouter(router,to,next);
  }else{
    next();
  }
});

function checkRouter(router,to,next){
  goRouter(router,to,next);
}
function goRouter(router,to,next){
  next();
}
export default router;


