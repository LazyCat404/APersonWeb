# 可交互的矢量图

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>填充</title>
  <style>
    .gradient {
      fill: red;  /* 填充红色，不可用 background 改变颜色*/
    }
    .gradient:hover {
      fill: url('#gradient-example');
    }
  </style>
</head>
<body>
    <svg class="the-svg" width="50px" viewBox="0 0 100 100">
        <defs>
            <!-- 线渐变 -->
            <linearGradient id="gradient-example">
                <stop offset="13%" stop-color="#24bed2"/>
                <stop offset="100%" stop-color="#32ffe4"/>
            </linearGradient>
        </defs>
        <circle class="gradient" cx="50" cy="50" r="50"/>
    </svg>
</body>
</html>
```