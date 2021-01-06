import Vue from 'vue';
// css reset
import 'normalize.css';
import Antd from 'ant-design-vue';
import Store from './store';
// 使用Antd
import 'ant-design-vue/dist/antd.less';

import 'xe-utils'
import VXETable from 'vxe-table'
// import 'vxe-table/lib/style.css'

Vue.use(Antd).use(VXETable)

export default ({ router, states = {}, App }, resolve = () => {}) => {
  const store = Store(states);

  const app = new Vue({
    store,
    router,
    render: (h) => h(App),
  }).$mount('#app');

  // 回调函数
  resolve(app);
}