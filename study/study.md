### git basic

- clone project:  git clone <rep>

- create branch: git branch <name>

- create and enter branch: git checkout -b <name>

- switch branch: git checkout <name>

- status: git status

- add all files: git add . 

- submit : git commit -m 'description'

- pull:  git pull

- push: git push

- view all branches: git branch --list

- view all branches(include remote): git branch -a

### git rules

- master： master branch， no permitting coding on it

- dev： development branch， coding on it

  

### 版本分支： 建立于dev分支下

- feature-<projectName>-v1.0.0-202001121: 分支完整名称

- feature为分支类型，feature表示为新增需求

- 20200121为建立分支日期

  

### Bug分支： 建立于当前版本分支下面

- bug-<bug id>-200200121:  bug分支完整名称
- bug为分支类型，bug表示为bug修改
- 20200121为建立分支日期

### git practice

1. add rep at git on browser with name 'https://github.com/shihezichen/vue-admin.git'
2. git clone https://github.com/shihezichen/vue-admin.git 
3. git checkout -b  dev
4. git push
5. git push --set-upstream origin dev
6. git branch -a 
7. git checkout -b feature-vueAdmin-v1.0.0-20200123

### Node Basic

- vue  -V
- npm  uninstall vue/cli -g
- node  -v
- npm -v
- 管理nodejs版本：  npm install  -g n  stable
- npm  install -g @vue/cli
- vue -V
- 淘宝镜像： npm install -g cnpm --registry=https://registry.npm.taobao.org
- npm更新包的方法：
  - 方法1： 手动修改package.json的依赖包版本， 执行 npm install   --force
  - 方法2： 使用第三方插件
    - npm install -g  npm-check-updates
    - ncu   //查看可更新包
    - ncu  -u   //更新package.json
    - npm install   //升级到最新版本
  - 方法3： 使用yarn，  yarn upgrade
- node_modules 几个可能的位置：
  - C:\Users\shihe\AppData\Roaming    用户Roaming目录
  - C:\Users\shihe\       即用户目录
  - d:\nodejs   即node安装目录
- 如果提示 vue和vue-template-compiler版本不匹配， 升级vue版本到特定版本： npm install vue@2.5.17 --save

### Vue Basic

- create project :   vue create vue-admin
- npm run serve
- 增加 normalize.css 文件， 改为 scss 后缀
- 增加 mixin.scss 作为全局css， 内部导入 normalize.scss
- 增加 vue.config.js 配置， 缺省加载 mixin.scss
- main.js 做全局性导入和加载
- vue.config.js： 
  - https://cli.vuejs.org/zh/config/#vue-config-js
  - sass loader: prependData: `@import "@/assets/scss/global.scss";`
  - devServer 的host， port

### Element-UI

- npm  install element-ui  -S
- import ElementUI from "element-ui";
- import "element-ui/lib/theme-chalk/index.css";
- Vue.use(ElementUI);

### Vue组件文件规则

- 固定内容：  tempate，  script， style

- script规则：

  ```javascript
  <script>
  export default {
    name: "home",     // 当前组件名称
    components: {},   // 组件，有引入组件时， 放置组件名称
    data(){         // 数据, v-model绑定数据使用
      return {}
    },
    created(){},    // 创建完成时
    mounted(){},    // 挂在完成时
    props: {},  // 子组件接收父组件参数
    watch:{}    // 子组件接收父组件参数
  }
  </script>
  ```

### 基本指令 用法

- v-for:

  ```javascript
  <li class="current" v-for="(item,index) in menuTab" :key="item.id"> {{item.txt}} {{index}}</li>
  ```

- :class的绑定方式

  - 最简单绑定: 

    ```javascript
    :class="{ 'active': isActive }"
    或者
    :class="{ 'active': isActive==-1}"
    或者
    :class="{ 'active': isActive==index}"
    
    第一种绑定多个:
    :class="{ 'active': isActive, 'sort': isSort }"
    第二种绑定多个:也可以把后面绑定的对象写成一个变量放到data里面:
    :class="classObject"
    data(){
        return {
            classObject: { active: true, sort: false}
        }
    }
    第三种绑定多个: 使用computed属性
    :class= "classObject"
    data(){
        return {
            isActive: true,
            isSort: false
        }
    },
    computed: {
        classObject: function() {
            return {
                active: this.isActive,
                sort: this.isSort
            }
        }
    }
    ```

- click方法与处理

  ```javascript
  <li  v-for="(item,index) in menuTab" :key="item.id" :class="{'current': item.current}" @click="toggleMenu(item)"> {{item.txt}} {{index}}</li>
  ```

  ```javascript
    data() {
      return {
        menuTab: [
          { id:1, txt:"登录", current:true },
          { id:2, txt:"注册", current:false },
        ],
      };
    },
    methods: {
      // 切换选中项(样式会变化)
      toggleMenu(item) {
        // 遍历并且全部设置为非选中
        this.menuTab.forEach(elem => {
          elem.current = false;
        });
        // 设置当前点击项为选中
        item.current = true;
      }
    },
  ```

- v-show和v-if区别

  - v-show 隐藏DOM
  - v-if 删除DOM

    ### 基础数据类型与对象类型

- 基础数据类型赋值是值拷贝

- 对象数据类型赋值是引用

### 表单数据绑定

- v-model: 在表单控件或者组件上创建双向绑定, input, select, textarea, component
- 表单项 prop 与 v-model 联合使用:	
  
  	* 在form级别使用:model绑定到data中的表单对象上, 并定义rules对象
    
  * 在item级别使用prop指定本item对应的rule, 这些rule都是在data中rules中定义
  
  * 在item级别中的表单控件上, 使用v-model绑定到对应的表单对象的属性


  ```javascript
  <el-form :model="ruleForm" :rules="rules"  ref="ruleForm">
      <el-form-item prop="pass">
          <label>密码</label>
          <el-input type="password" v-model="ruleForm.pass">
      </el-form-item>
  </el-form>
  ```
在data中定义表单对象ruleForm, 以及其属性 pass

在data中定义rules对象, 每条具备validator和trigger

在data中定义validator变量, 一般是一个函数, 传入rule名称, 当前value, 以及回调函数


  ```javascript
  data() {
      var validatePass = (rule, value, callback) => {
          if( value === '') {
              callback(new Error('请再次输入密码'));
          } else {
              callback();
          }
      }
      return {
          // 表单数据
          ruleForm: {
              pass: '',
          },
          rules: {
              pass: [
                  { validator: validatePass, trigger: 'blur' }
              ]
          }
      }
  }
  ```

- 邮箱验证正则表达式

  ```javascript
  let reg = /^([a-zA-Z]|[0-9])(\w|_)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if ( !reg.test(value)) {
     eturn callback(new Error("Email不符合格式和字符要求"));
  }
  ```
  
- 字母+数字:  ```let reg = reg=/^([a-zA-Z0-9]{6,20})$/```


  - 字母或数字: ```let reg=/^[a-z0-9]{6}/```

  - 过滤特殊字符:

    ```javascript
    export function stripscript(s) {
      var pattern = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      var rs = "";
      for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, "");
      }
      return rs;
    }
    ```

    

- Vue 3.0


  - ```npm  install  @vue/composition-api  -S```

- axios:

  - get:

    ```javascript
    axios.get('/usr',{
        params: {
            ID:12345
        }
    })
    .then(function (response){
        console.log(response)
    })
    .catch(function (error){
    	console.log(error)       
    })
    ```

  - post:

    ```javascript
    axios.post('/usr',{
        firstName: 'Fred',
        lastName: 'Flintstone'
    })
    .then(function (response){
        console.log(response)
    })
    .catch(function (error){
    	console.log(error)       
    })
    ```

  - 并发多个请求

    ```javascript
    function getUserAccount(){
       return axios.get('/usr/12345');
    }
    
    function getUserPermissions() {
        return axios.get('/usr/12334/permissions')
    }
    
    axios.all([ getUserAccount(), getUserPermission() ])
    .then( axios.spread(function (accty, perm){
        //两个请求都执行完成
        console.log("all finished.")
    } ))
    ```

  - request:

    ```javascript
    axios.request({
        method: 'get',
        url: '/usr/123445',
        data: {
            first: 'fred',
            sec: 'ftion'
        }
    })
    .then( function (response) {
        console.log(response);
    })
    .catch( function (error){
        console.log(error);
    })
    ```

    

### 路由跳转

- context.root.$router.push({name:'console'});