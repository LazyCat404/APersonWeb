# 与 2 大不相同呦

##  代理

1. 同一对象被代理多次，返回同一对象：WeakMap() 缓存

2. 一个对象被代理过，再次被代理会返回之前的代理对象：添加标记属性

## computed、watch、 和 watchEffect

> 处理数据响应式的核心 API，它们功能相近，又有所区别。


### computed （计算属性）

> 基于响应式依赖派生出新数据的机制，它通过缓存计算结果来优化性能，适合**高频访问**但**计算成本较高**的场景。

- 基于依赖的响应式更新：计算属性会自动追踪其内部依赖的响应式数据（如 ref、reactive 或组件的 data）。当依赖变化时，计算属性会重新计算并返回新值；若依赖未变化，则直接返回缓存的旧值。

- 惰性求值：计算属性仅在**被访问时**才会触发计算（而非立即执行）。

- 缓存机制：计算属性会缓存计算结果，只有依赖变化时才会重新计算。

```js
// vue2
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    };
  },
  computed: {
    // 完整形式（带 getter/setter）
    fullName: {
      get() {
        return this.firstName + ' ' + this.lastName;
      },
      set(newValue) {
        const names = newValue.split(' ');
        this.firstName = names[0] || '';
        this.lastName = names[1] || '';
      }
    },
    // 简写形式（仅 getter）
    reversedName() {
      return this.fullName.split('').reverse().join('');
    }
  }
};
```

```js
// vue3
import { ref, computed } from 'vue';

export default {
  setup() {
    const firstName = ref('John');
    const lastName = ref('Doe');
    // 计算属性
    const fullName = computed(() => {
      return firstName.value + ' ' + lastName.value;
    });
    // 带 setter 的计算属性
    const fullNameWithSetter = computed({
      get: () => firstName.value + ' ' + lastName.value,
      set: (newValue) => {
        const names = newValue.split(' ');
        firstName.value = names[0] || '';
        lastName.value = names[1] || '';
      }
    });

    return { fullName, fullNameWithSetter };
  }
};

```

#### Getter 和 Setter

- `Getter`（必须）：定义计算属性的逻辑。

- `Setter`（可选）：允许反向更新依赖数据（类似双向绑定）。

```js
const count = ref(0);
const doubleCount = computed({
  get: () => count.value * 2,
  set: (newValue) => {
    count.value = newValue / 2;
  }
});
doubleCount.value = 10; // 触发 setter，count.value 变为 5
```

### watch （侦听器）

> 用于**监听数据变化并执行副作用**，适合处理需要**响应数据变化但不需要返回新值**的场景。

- 响应式监听：可以监听 `ref`、`reactive`、`computed` 或组件的 `data` 中的属性，当被监听的数据变化时，`watch` 的回调函数会被触发。

- 异步执行：默认情况下，`watch` 的回调是异步的（在 Vue 的下一个事件循环中执行），确保在数据变化后、DOM 更新完成后再执行逻辑。可通过配置项 `flush: 'sync'` 强制同步执行。

- 立即执行：默认情况下，`watch` 会在组件挂载时立即执行一次回调，可通过配置项 `immediate: true` 或 `immediate: false` 来控制是否立即执行。

```js
// vue2
export default {
  data() {
    return {
      count: 0,
      user:{
        name: 'John',
        age: 30
      }
    };
  },
  watch: {
    // 监听简单属性
    count(newValue, oldValue) {
      console.log(`count 从 ${oldVal} 变为 ${newVal}`);
    },
    // 监听对象属性
    user: {
      handler(newVal, oldVal) {
        console.log('user 对象变化:', newVal);
      },
      deep: true, // 深度监听
      immediate: true // 立即执行
    },
    // 监听对象特定属性
    'user.name'(newVal) {
      console.log(`用户名变为 ${newVal}`);
    }
  }
}
```

```js
// vue3
import { ref, reactive, watch } from 'vue';
 
export default {
  setup() {
    const count = ref(0);
    const user = reactive({
      name: 'John',
      age: 30
    });
 
    // 监听简单 ref
    watch(count, (newVal, oldVal) => {
      console.log(`count 从 ${oldVal} 变为 ${newVal}`);
    });
 
    // 监听 reactive 对象的某个属性
    watch(
      () => user.name,
      (newName) => {
        console.log(`用户名变为 ${newName}`);
      }
    );
 
    // 监听多个数据源
    watch([count, () => user.age], ([newCount, newAge], [oldCount, oldAge]) => {
      console.log(`count: ${oldCount} -> ${newCount}, age: ${oldAge} -> ${newAge}`);
    });
 
    // 深度监听对象（需手动指定）
    watch(
      () => ({ ...user }), // 返回新对象触发变化
      (newUser) => {
        console.log('user 对象变化:', newUser);
      },
      { deep: true }
    );
    // 立即执行
    watch(
      count,
      (newVal) => {
        console.log('初始化 count:', newVal);
      },
      { immediate: true }
    );

    return { count, user };
  }
};
```

| **配置项**       | **类型**               | **默认值** | **说明**                                                                 |
|------------------|------------------------|-----------|--------------------------------------------------------------------------|
| `deep`           | `boolean`              | `false`   | **是否深度监听**：<br> `true`：监听对象/数组内部属性的变化（需递归遍历）。<br> `false`：仅监听引用变化（如重新赋值）。 |
| `immediate`      | `boolean`              | `false`   | **是否立即执行**：<br> `true`：在组件挂载时**立即触发一次回调**（适合初始化逻辑）。<br> `false`：仅在数据变化后触发。 |
| `flush`          | `'pre'` \| `'post'` \| `'sync'` | `'pre'` | **回调执行时机**：<br> `'pre'`：在 Vue 的**更新周期前**同步执行（可能触发多次）。<br> `'post'`：在**DOM 更新后**执行（推荐，避免渲染问题）。<br> `'sync'`：强制同步执行（谨慎使用，可能影响性能）。 |
---

### watchEffect （副作用）

> 用于**自动追踪响应式数据依赖并执行副作用**的函数，它会在组件初始化时**立即执行**一次，并在依赖的响应式数据变化时**重新执行**。

- 自动依赖追踪：需显式指定要监听的数据，watchEffect 会自动捕获回调函数中使用的所有响应式数据，当这些数据变化时，回调函数会重新执行。适合**简单**、**自动化的副作用逻辑**，无需手动管理依赖（但缺乏对数据变化的精细控制）的场景。

- 立即执行：`watchEffect` 会在组件挂载化时**立即执行**一次，并在 *依赖的响应式数据* 变化时**重新执行**。

- 清理副作用：回调函数可以返回一个清理函数，会在回调函数重新执行前（如：依赖变化时） 或 组件卸载时（避免内存泄漏）触发。

- 无新旧值对比：回调函数不接收新值和旧值，仅触发副作用逻辑。

```js
//  基础用法
import { ref, watchEffect } from 'vue';

const count = ref(0);

watchEffect(() => {
  console.log(`当前 count 值: ${count.value}`);
});

// 输出：当前 count 值: 0（立即执行）
// 当 count.value 变化时（如 count.value++），会重新输出最新值。

// 清理副作用
import { ref, watchEffect } from 'vue';
 
const count = ref(0);
 
const stop = watchEffect((onCleanup) => {
  console.log(`Count: ${count.value}`);
  
  // 清理函数：在回调重新执行或组件卸载时调用
  onCleanup(() => {
    console.log('清理副作用（如取消定时器、网络请求等）');
  });
});
 
// 停止监听（手动调用返回的函数）
stop();
```

### 三项对比

| **特性**       | **`computed`**                          | **`watch`**                              | **`watchEffect`**                        |
|----------------|----------------------------------------|-----------------------------------------|-----------------------------------------|
| **用途**       | 计算派生数据（基于响应式依赖返回新值）   | 监听数据变化并执行异步/复杂副作用         | 自动追踪依赖并执行副作用（无需显式声明） |
| **返回值**     | 有返回值（一个**只读的 `ref`** 对象）    | **无返回值**                           | **无返回值**               |
| **依赖追踪（收集）**   | 自动 | 手动 | 自动          |
| **（回调）触发时机**   | 仅在读取时计算| 依赖变化时**立即执行**               | 组件挂载时**立即执行一次**，依赖变化时重新执行 |
| **回调参数**   | 无                                     | 可获取**新值、旧值**                     | 无新旧值               |
| **缓存机制**   | 有（依赖不变时重复返回同一值）   | 无                                   | 无                                 |
| **性能** | 较低 | 较低 | 较高 |
| **适用场景**   | 模板中需要显示的派生数据（如过滤列表）   | 数据变化后需要执行异步操作（如 API 请求） | 快速实现副作用（如自动同步 UI、日志记录） |
---