<template >
    <div>
        <h1> This is HOme page</h1>
        <Button @click="showMsg()"> 按钮  {{ text }}</Button>
     </div>
</template>

<script>
import {  reactive, ref, onMounted } from "@vue/composition-api";

export default {
  name: "Home",
  setup( props, { root } ) {
    // DOM挂载完成后
    onMounted( () => {
    })

    const text = ref("Reactive TEXT");

    const showMsg = () => {
      console.log("-----");
 	  //console.log(root.$db.read().get('posts').value());
    };

    return {
        showMsg,
        text
    };
  }
};
</script>
