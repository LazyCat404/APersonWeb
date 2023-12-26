# 让交互更简单

## createAnimationApi()

> 它是`lottie-api`唯一方法，它将返回一个API实例，该实例通过传入的参数获取动画关键路径，并返回

- 接受**1**个参数 -> **lottie 动画实例**

- 返回动画API实例

## 附加方法

> 由动画API实例调用

- `getKeyPath`：返回指向动画特性的关键点路径

- `addValueCallback`：向动画属性添加回调

- `recalculateSize`：如果元素被调整大小，则调用此方法

- `toContainerPoint`：将点从动画坐标转换为全局坐标

- `fromContainerPoint`：将点从全局坐标转换为动画坐标

- `toKeypathLayerPoint`：将点从全局动画坐标转换为特性动画坐标

- `fromKeypathLayerPoint`：将点从特性动画坐标转换为全局动画坐标

- `getCurrentFrame`：以帧为单位返回当前动画时间

- `getCurrentTime`：以秒为单位返回当前动画时间