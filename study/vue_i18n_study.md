- npm install vue-i18n --save-dev

- main.js

  ```javascript
  import VueI18n from 'vue-i18n'
  Vue.use(VueI18n)
  const i18n = new VueI18n({
      locale: 'zh',
      messages: {
          'zh': require('./VueI18n/i18n-zh'),
          'en': require('./VueI18n/i18n-en')
      }
  })
  
  Vue.config.productionTip = false
  
  new Vue({
      el:'#app',
      router,
      i18n,
      components: { App },
      template: '<App/>'
  })
  ```

- 建立文件 VueI18n/language-zh.js和 VueI18n/language-en.js

  内容:

  ```javascript
  export const lang = {
      home: '首页',
      name: '中文'
  }
  ```

- 在组件中使用

  ```vue
  <template>
  	<div>
      	<span> {{ $t('lang.home')}} </span> 
   		<span @click="changeLanguages()">切换语言</span>
      </div>
  </template>
  
  <script>
  export default {
      data() {
          return {
              lang: 'zh'
          }
      },
      methods: {
          changeLanguages() {
              console.log(this.$i18n.locale);
              let lang = this.$i18n.locale === 'zh' ? 'en' :'zh'
              this.$i18n.locale = lang
          }
      }
  }    
  </script>
  <style scoped lang="scss">
  </style>
  ```

  