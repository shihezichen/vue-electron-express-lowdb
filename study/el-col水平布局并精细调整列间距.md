- el-col调整列间距往往很粗犷, 无法对横向间距做精细化调整

- 解决办法: 使用el-col做较大的列间定义, 内部的多个元素之间的间距,不再用el-col调整, 单独内部调整

- 例子:

  `类型: [文本框]  日期: [起始日期选择框] - [结束日期选择框]  搜索值:  [ 文本输入框]   [搜索按钮]`

  类似这种多个元素横向排版且间距有特殊要求的, 就不要用el-col进行间隔;

  

  利用css属性:  

  在一个父节点 div.label-wrap 下, 当第一个子元素为 float: left时,   第二个子元素会向左对齐到父元素, 此时设置第二个子元素的 margin-left 等于第一个子元素的宽度, 就可以实现横向衔接排版:

  ```css
  <el-col :span=8>
  	<div class="label-wrap">
  	   <label >搜索值:</label>
  	   <div class="wrap-content">
  	       <!-- 注意, 此处控件是100%宽度撑满父节点 -->
  		  <el-select style="width: 100%">
  	   </div>
  	</div>
  </el-col>
  
  <el-col :span=8>
  	<div class="date-wrap">
  	   <label >搜索值:</label>
  	   <div class="wrap-content">
  	       <!-- 注意, 此处控件是100%宽度撑满父节点 -->
  		  <el-date-picker style="width: 100%">
  	   </div>
  	</div>
  </el-col>
  
  <el-col :span=8>
  	<div class="search-wrap">
  	   <label >搜索值:</label>
  	   <div class="wrap-content">
  	       <!-- 注意, 此处控件是100%宽度撑满父节点 -->
  		  <el-input style="width: 100%">
  	   </div>
  	</div>
  </el-col>
  ```

  ```scss
  .label-wrap {
      label {
          float: left;
          line-height: 40px;
          height: 40px;         
          text-align: left,
          width: 60px;  //width 和 wrap-content的margin-left缩进一致
      }
      .wrap-content {
          margin-left: 60px;
      }
  }
  
  .date-wrap {
      label {
          float: left;
          line-height: 40px;
          height: 40px;    
          text-align: right,
          width: 70px;  //width 和 wrap-content的margin-left缩进一致
      }
      .wrap-content {
          margin-left: 70px;
      }
  }
  
  ...
  ```

- 进一步优化

  可以发现 label-wrap, date-wrap, search-wrap 它们基本上大同小异, 差别仅仅是 width, text-align 不同, 因此可以抽取出来封装为css函数:

  - 在全局css函数定义文件config.scss中

    ```scss
    // 行高不传入时使用默认值
    @mixin labelDom( $text-align, $width, $line-height:"normal" ) {
        label {
            float: left;
            line-height: $line-height + px;
            text-align: $text-align;
            width: $width + px;
        }
        .wrap-content {
            margin-left: $width + px;
        }
    }
    ```

  - 由于CSS函数调用需要有条件判断, 不同条件传入不同参数,  在CSS中可以用选择器来实现.  因此需要在html中增加不同条件的判断, 首先把多个div的class都调整为同一个class为 label-wrap 然后增加一个class作为条件标识

    ```html
    <div class="label-wrap category" >
     
    <div class="label-wrap date">
        
    <div class="label-wrap search">
        
    ```

  - 修改css部分: 

    ```scss
    <style lang="scss" scoped>
    @import "../../syles/config.scss";
    
    .label-wrap {
        &.category { @include labelDom(left,60, 40); }
        &.date { @include labelDom(right, 109, 40); }
    }
    </style>
    ```

    需要注意, el-col之间有gutter, 因此计算宽度时记得减去gutter.