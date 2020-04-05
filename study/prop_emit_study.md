- 子组件定义 props,

  - 当使用传入的原始值时: 用一个data属性接收这个prop

  ```javascript
  // MyTable.vue
  
  props: ['initialCounter'],
  data: function (){
      return{
          counter: this.initialCounter
      }
  }
  ```

  - 当需要对传入的原始值做转换时: 使用两种方式:

    - computed

      ```javascript
      props: [ 'size' ],
      computed: {
          normalizedSize: function () {
              return this.size.trim().toLowerCase()
          }
      } 
      ```

    - watch

      ```javascript
      props: {
          play: Boolean,
          default: false
      },
      watch: {
          play: {
              handler(val) {
                  this.music = val;
                  if( this.music ) {
                      this.clickTip();
                  }
              },
              immediate: true    
          }
      }   
      ```

- 父组件 在script 代码中导入子组件

  ```javascript
  
  import MyTable from '@/components/MyTable.vue';
  export default {
    name: 'App',
    components: {
        MyTable
    },
    data() {
        return {
            tableData: [
            	//此处为父组件获取的要填入子组件的数据列表
  			{
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            	},
            ]          
        }      
    }
  }
  
  ```

  - 父组件在 template 代码中引入子组件

    ```html
    <template>
      <MyTable :table-data="tableData" />
    </template>    
    ```

  - 注意事项:

    - 子组件prop的命名可以是单词间可用下划线连接接,也可以是驼峰

    - 如果子组件是驼峰命名, 则父组件 template 引用时, 就必须转成中划线连接的小写字母;

    - 举例: 

      - 子组件props命名为  tableData    ->  父组件引用: \<MyTable :table-data="xxx" \>

      - 子组件props命名为  table_data    ->  父组件引用: \<MyTable :table_data="xxx" \>

        