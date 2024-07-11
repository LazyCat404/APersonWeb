/**
 * 节流：在一定时间内只触发一次函数，如果在这段时间内触发多次函数，只有一次生效
 * @param handler 执行函数 
 * @param wait 等待时间
 * @returns 
 * 调用示例： 
 * const throttledFunction = throttle(getData,2000)
 * throttledFunction()
 */
function throttle<T extends (...args: any[]) => any>(
  handler: T,
  wait = 1000
): (...args: Parameters<T>) => ReturnType<T> | void {
  let lastTime = 0;
  return function(this: any, ...args: Parameters<T>): ReturnType<T> | void {
    const nowTime = Date.now();
    if (nowTime - lastTime > wait) {
      const result = handler.apply(this, args); // 保留this的上下文
      lastTime = nowTime;
      return result;
    }
  };
}
/**
 * 防抖
 * @param handler 
 * @param delay 
 * @returns 
 * 调用示例： 
 * const debounceFunction = debounce(getData,800)
 * debounceFunction()
 */
function debounce<T extends (...args: any[]) => any>(handler: T, delay = 300):(...args: Parameters<T>) => ReturnType<T> | undefined {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const context = this;
    if (timer !== null) {
      clearTimeout(timer);
      timer = null; // 清除后通常将timer设置为null，以避免后续错误
    }
    timer = setTimeout(() => {
      handler.apply(context, args);
    }, delay);
    return undefined; 
  };
}