/**
 * 通过调用 snabbdom 的相关方法，进一步了解h()以及patch() 
 * 1. Vdom 如何被渲染函数（h()）产生？
 * 2. diff 原理
 * 3. Vdom 如何通过
 */

import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";
  
  const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
  ]);
  
  const container = document.getElementById("container");
  const vnode = h("div#container.two.classes", { on: { click: function(){} } }, [
    h("span", { style: { fontWeight: "bold" } }, "This is bold"),
    " and this is just normal text",
    h("a", { props: { href: "/foo" } }, "I'll take you places!"),
  ]);
  // Patch into empty DOM element – this modifies the DOM as a side effect
  patch(container, vnode);
  
  const newVnode = h(
    "div#container.two.classes",
    { on: { click: function(){} } },
    [
      h(
        "span",
        { style: { fontWeight: "normal", fontStyle: "italic" } },
        "This is now italic type"
      ),
      " and this is still just normal text",
      h("a", { props: { href: "/bar" } }, "I'll take you places!"),
    ]
  );
  // Second `patch` invocation
  patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state