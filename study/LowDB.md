- LowDB简介

  - 轻量级本地存储方式, 适用于不依赖服务器小型项目
  - 基于Loadash构建, 可使用Loadash强大的函数
  - LowDB: https://github.com/typicode/lowdb
  - Loadash: https://lodash.com/

- 安装LowDB

  ```java
  npm install lowdb
  或
  yarn add lowdb    
  ```

- 使用LowDB

  ```javascript
  // Low DB对象
  const low = require('lowdb');
  // 同步文件适配器, 此外还有: FileAsync, LocalBrowser, Memory 等
  const FileSync = require('lowdb/adapters/FileSync');
  // 生成适配器
  const adapter = new FileSync('db.json');
  // 还可以定义写之前和读之后的操作, 如下:
  // const adapter = new FileSync('db.json', {
  //     serialize: (data) => encrypt(JSON.stringify(data)),
  //    deserialize: (data) => JSON.parse(decrypt(data))
  //});
  
  // 创建db
const db = low(adapter);
  
// 以下操作DB
  
  // 建立对象(可对比表)
  db.defaults({
      posts: [],
      user: {},
      count: 0
  }).write()
  // 也可以建立一个空对象, 以后再填入具体的属性,如下:
  // db.defaults({ 'testTable1':[] }).write();
  // await db.read().get('testTable1').
  //   		.push({ id: 1, name: 'testname', age: 60 })
  //			.write();
  
  // 向某个列表属性添加成员
  db.get('posts')
    .push({ id: 1, title: 'lowdb is awesome' })
    .write();
  // lowdb-id提供的方法
  db.get('posts').insert({ // 对数组进行insert操作
    title: 'xxx',
    content: 'xxxx'
  }).write()
  
  // 针对对象可以直接set()来更新
  // 设置通过设置某个属性的子属性值的方式添加子属性
  db.set('user.name', 'typicode')
    .write();
  
  // unset 删除一个属性
  db.unset('user.name')
    .write();
  
  // 针对原有数据进行更新, 更新属性值,用update
  db.update('count', n => n + 1 )
    .write();
  
  // 查找
  db.get('users')
    .find({ sex: 'male' })
    .value();
  
  // 查询
  db.has('users')
    .value();
  
  if (!db.has('uploaded').value()) { // 先判断该值存不存在
    db.set('uploaded', []).write() // 不存在就创建
  }
  
  // 获取特定字段, 例如 users下的name字段
  db.get('users')
    .map('name')
    .value();
  
  // 获取数量
  db.get('users')
    .size()
    .value();
  
  // 获取特定信息, 例如获取 users 第一个元素的名称
  db.get('users[0].name')
    .value();
  
  // 修改与更新, 例如把 users 列表中name 为Tom的改为Tim
  db.get('users')
    .find({ name: 'Tom' })
    .assign({ name: 'Tim' })
    .write();
  
  // 删除信息, 例如删除 users 列表中 name 为 Time 的
  db.get('users')
    .remove({ name: 'Time' })
    .write();
  db.get('posts')
    .remove({ title: 'low!' })
    .write();
  
  // 使用loadash-id删除指定的id项
  db.get('posts')
    .removeById(id)
    .write();
  
  // 移除属性
  db.unset('users.name')
    .write();
  
  // 深拷贝
  db.get('users')
    .cloneDeep()
    .value();
  
  // 过滤,排序,topN
  db.get('posts')
    .filter({ published: true })
    .sortBy('views')
    .take(5)
    .value()
  ```
  
- id索引

  可以使用shortid和loadash-id为每一条记录创建唯一的id索引, 然后通过id检索操作记录

  ```javascript
  const shortid = require('shortid');
  
  // 为记录添加索引
  const postId = db
    .get('posts')
    .push({ id: shortid.generate(), title: 'low!' })
    .write()
    .id
  
  // 检索记录
  const post = db
    .get('posts')
    .find({ id: postId })
    .value()
  
  ```

- 强制从文件中读取: 再写操作之前都强制读一次, 保证获取的最新状态(当多个进程访问同一个db时)

  ```javascript
  db.read().get('posts').value
  db.read().set('posts', []).write()
  ```

- Vue里使用lowdb的方法: main.js

  ```javascript
  import db from '@/db/datastore';
  
  ...
  
  // 类似把axios挂在vue的原型链一样,后续可以使用 this.$db 或 root.$db 来使用lowdb了
  Vue.prototype.$db = db;
  ```

- 删除数组中某一个元素:

  ```javascript
  // 插入数组元素
  db.read().set('array',['happy', 'sad', 'smile']).write();
  // 删除数组中的某一个元素, 值为'sad'
  let keyword = 'sad';
  db.get('array')
    .remove( ( val ) => {
        return  val === keyword;
    })
    .write();
  ```

- 深查询:   即根据子元素的值进行匹配,来判断是否删除或返回当前元素

  ```javascript
  // 深查询,即根据子元素的值进行匹配,来判断是否删除当前元素
  db.set('media',[]).write();
  // 插入两条记录
  db.get('media').push({
      id: 1, name: 'name1', children: {
          author: '久石让',
          title: '菊次郎的夏天',
          state: 'reading'
      },
      tag: ['童年']
  }).push({
      id: 2, name: 'name2', children: {
          author: '佚名',
          title: '荡起双桨',
          state: 'reading'
      },
      tag: ['童年', '恐怖']
  }).write();
  // 根据tag查询media下的所有条目
  let search_tag = '恐怖';
  let values = db.get('media').filter( item => {
      return item.tag.indexOf( search_tag ) !== -1 ;
  }).value();
  console.log(values);
  ```

- 配合express的例子: FileAsync防止阻塞 request

  ```javascript
  const express = require('express')
  const bodyParser = require('body-parser')
  const low = require('lowdb')
  const FileAsync = require('lowdb/adapters/FileAsync')
  
  // Create server
  const app = express()
  app.use(bodyParser.json())
  
  // Create database instance and start server
  const adapter = new FileAsync('db.json')
  low(adapter)
    .then(db => {
      // Routes
      // GET /posts/:id
      app.get('/posts/:id', (req, res) => {
        const post = db.get('posts')
          .find({ id: req.params.id })
          .value()
  
        res.send(post)
      })
  
      // POST /posts
      app.post('/posts', (req, res) => {
        db.get('posts')
          .push(req.body)
          .last()
          .assign({ id: Date.now().toString() })
          .write()
          .then(post => res.send(post))
      })
  
      // Set db default values
      return db.defaults({ posts: [] }).write()
    })
    .then(() => {
      app.listen(3000, () => console.log('listening on port 3000'))
    })
  
  ```

- In-memory例子:

  ```javascript
  const fs = require('fs')
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const Memory = require('lowdb/adapters/Memory')
  
  const db = low(
    process.env.NODE_ENV === 'test'
      ? new Memory()
      : new FileSync('db.json')
  )
  
  db.defaults({ posts: [] })
    .write()
  
  db.get('posts')
    .push({ title: 'lowdb' })
    .write()
  ```

  