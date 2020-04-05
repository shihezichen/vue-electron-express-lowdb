## Vue基本用法

### main.js

- 一般需要导入的库:

  ```javascript
  import Vue from 'vue'
  import App from './App.vue'
  // 支持 composition-api
  import VueCompositionApi from '@vue/composition-api'
  // 使用Element UI
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css'
  // Store
  import store from '@/store/store.js';
  // Router
  import router from '@/route/router';
  
  Vue.use(ElementUI);
  Vue.use(VueCompositionApi);
  Vue.config.productionTip = false
  
  new Vue({
    router,
    store,
    render: h => h(App),
  
  }).$mount('#app')
  ```

- vue 3.0中主要元素:

  ```html
  <template lang="pug">
      // 显示到浏览器的注释
      // - 不显示到浏览器的注释
      div Slice管理
          router-link(to="/slice/create") 创建
          router-link(to="/slice/delete") 删除
  
      	div#app
              // - 子组件
              Header(title="Eno", color="red")
              Content(title="Wscats",
                      color="yellow")
      	a.cancel-btn("@click"="toggle" href="javascript:" )
      	// - 根据变量值切换样式
      	div#searchBar( ':class'="['weui-search-bar', {'weui-search-bar_focusing' : isFocus}]" )
      	// - <div :class="['weui-search-bar', {'weui-search-bar_focusing' : isFocus}]" id="searchBar">
  </template>
  
  <script>
  // composition-api
  import { reactive, ref, isRef, toRefs, onMounted, onUpdated, onUnmounted,  watch } from '@vue/composition-api';
  // 导入外部函数
  import { stripscript, validatePass, validateEmail, validateVCode } from '@/utils/validate';
  // 导入子组件
  import Header from "./components/Header.vue";
  import Content from "./components/Header.vue";
      
  export default {
      name: "slice",
      // 引用的子组件
      components: { Header, Content },
      //  本组件属性, 定义接受值, 供父组件传递进来更改, 在setup中可以使用到
      props: { },
      // vue 3.0 的组件入口,等价于2.0的beforeCreate和Created两个生命周期
      setup(props, { refs, root }) {
          /**
           *attrs: (...) == this.$attrs
           emit: (...) == this.$emit
           listeners: (...) == this.$listeners
           parent: (...) == this.$parent
           refs: (...) == this.$refs
           root: (...) == this
           */
  
          /**
           *         数据声明
           */
  
          //  raw类型
          const currentType = ref('login');
          const loginDisabled = ref(true);
          const retryCount = ref(0);
          const timer = ref(null);
  
          //  对象/数组等类型
          //  菜单TAB页复杂数据
          const menuTab= reactive({
               items: [
                  { label: 'login', type: 'login' },
                  { label: 'register', type: 'register'}
               ]
           })
          
          // 状态对象
          const state = reactive({
              searchValue: "",
              // 搜索框两个状态，聚焦和非聚焦
              isFocus: false,
              inputElement: null
          });
  
          // 局部使用函数, 不会暴露给 template 部分使用
          let validatePasword = (rule, value, callback ) => {
              // 调用外部函数
              if( !validatePass(value)) {
                   callback(new Error('密码为6至20位字母+数字')
              }else{
                   callback()
              }
          }
  
          /**
           * 外部可见, 会暴露给 template 使用
           */
  
          // 不带参数:  事件响应
          const resetFormData = ( () => {
              this.$refs[formName].resetFields();  // 2.0
              refs.loginForm.resetFields();  // 3.0
          })
  
          // 带参数:
          const updateButtonStatue = ( (params) => {
              butStatus.status = params.status;
              butStatus.text = params.text;
          })
  
          // 生命周期
  
          // DOM挂载完成后
          onMounted( () => {
  			// 此处调用函数
              // 首屏加载的时候触发请求
              loadMore();            
          })
          onUpdated( () => {
              
          })
          onUnmounted(() => {
             
           })        
          
          // 监听 需要关注变化的变量
          watch( 
              () => {
                  // 前面定义的响应式数据对象
              	return state.searchValue;
          	},
              () => {
                  // 把变化存储到store中心
                  store.setSearchValue( state.searchValue);
              }
          )
  
          // 暴露变量/方法到tempalte可见
          return {
              // ref
              currentType, loginDisabled, retryCount
  
              // reactive
              menuTab,
              // 直接返回 state 数据是非响应式的, MV单向绑定
              // ...state
              // roRefs包装后返回state数据是响应式的, MVVM双向绑定
              //...toRef(state)
              
              // methods:
              resetFormData, updateButtonStatue,
          }
      }
  }
  </script>
  
  <style lang="scss" scoped>
  // id
  #login {
      height: 100vh;
      background-color: #344a5f;
  }
  // class
  .login-wrap {
      width: 330px;
      margin: auto;
  }
  // 多层
  .login-form {
      margin-top: 29px;
      label {
          display: block;
          margin-bottom: 3px;
          font-size: 14px;
          color: #fff;
      }
      .item-from { margin-bottom: 13px; }
      .block {
          display: block;
          width: 100%;
      }
      .login-btn { margin-top: 19px; }
  }
  
  </style>
  ```

- store基本用法

  store.js 暴露出一个store对象, 方便多个组件间共享 store 对象中的值. 这个对象还封装了set/get方法来操作该store对象

  ```javascript
  // store.js
  export default {
      //  定义数据
      //  访问方式: root.$store.state.xxx
      state: {
          searchValue: "",
          count: 10
      },
      // getters可以对数据进行计算后返回
      //   访问方式:root.$store.getters.xxx
      getters: {
          count: (state) => state.count * 2;
      },
      //Mutations
      // 提交更改数据更改state存储的状态(同步函数)
      // 使用方式: root.$store.commit('SET_COUNT', 100)
      mutations: {
          SET_COUNT(state, newValue) {
              state.count = newValue
          }
      },
      actions: {}
  
  }
  ```

- axios的用法

- computed的用法

  ```javascript
  // 监听store中的状态, 并赋值组件的变量 isCollapse
  //  当store变化时, 组件变量也会变化
  const isCollapse = computed( () => {
      return root.$store.state.isCollapse 
  })
  ```

- 样式的三元运算符

  当menuStatus为true时使用close类, 否则使用open类

  ```css
  <div id="layout" :class="[menuStatus ? 'close' : 'open']"
  ```

- HTML5本地存储

  - sessionStorage(关闭浏览器时即清除) 临时性
    - 存储: window.sessionStorage.setItem("key", "value");
    - 获取: window.sessionStorage.getItem("key", "value");
    - 删除: window.sessionStorage.removeItem("key");
    - 清空所有: sessionStorage.clear()
    - 限制: 5M, 存储于客户端, 只能存储字符串类型
  - localStorage(手动清除) 长期性
    - 存储: window.localStorage.setItem("key", "value");
    - 获取: window.localStorage.getItem("key", "value");
    - 删除: window.localStorage.removeItem("key");
    - 清空所有: localStorage.clear()

  