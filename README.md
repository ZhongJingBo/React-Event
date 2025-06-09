# React-Event

模拟实现 React 事件

```html
<div id="container">
  <div class="btn_1">click</div>
</div>
<script>
  // 模拟 JSX <div onClick={()=>{ console.log(1111111)}} onClickCapture>click</div>
  const btn1 = document.querySelector(".btn_1");
  btn1.myOnClick = (e) => {
    console.log("click", e);
  };

  btn1.myOnClickCapture = (e) => {
    e.stopPropagation();
    console.log("clickCapture", e);
  };
</script>
```
