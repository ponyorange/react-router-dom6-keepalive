import { useUpdate } from "../../hooks/useUpdate";
import ReactDOM from "react-dom";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";

function KeepAlive({
  activeName,
  children,
  exclude,
  include,
  isAsyncInclude,
  maxLen = 10,
}) {
  const containerRef = useRef(null);
  const components = useRef([]);
  const [asyncInclude] = useState(isAsyncInclude);
  const [stateComponets, setStateComponets] = useState(components.current);
  const update = useUpdate();
  useLayoutEffect(() => {
    console.log(activeName);
    if (!activeName) {
      console.log("activeName");
      return;
    }
    // 缓存超过上限的 干掉第一个缓存
    if (components.current.length >= maxLen) {
      components.current = components.current.slice(1);
    }
    // 添加
    const component = components.current.find((res) => res.name === activeName);
    if (!component) {
      components.current = [
        ...components.current,
        {
          name: activeName,
          ele: children,
        },
      ];
      if (!asyncInclude) {
        update();
      }
    } else {
      //找到了缓存的页面
      const pageIdx = components.current.indexOf(component) + 1;
      const pageLen = components.current.length;
      if (pageIdx < pageLen) {
        //页面回退
        //把最后一个给删掉
        components.current = components.current.slice(0, pageIdx);
      }
    }
    // console.log(components);
    setStateComponets(components.current);
    return () => {
      // 处理 黑白名单
      if (!exclude && !include) {
        return;
      }
      components.current = components.current.filter(({ name }) => {
        if (exclude && exclude.includes(name)) {
          return false;
        }
        if (include) {
          return include.includes(name);
        }
        return true;
      });
    };
  }, [children, activeName, exclude, maxLen, include, update, asyncInclude]);

  return (
    <>
      <div ref={containerRef} className="keep-alive" />
      {stateComponets.map(({ name, ele }) => (
        <Component
          active={name === activeName}
          renderDiv={containerRef}
          name={name}
          key={name}
        >
          {ele}
        </Component>
      ))}
    </>
  );
}
export default memo(KeepAlive);

// 渲染当前匹配的路由 不匹配的 利用createPortal 移动到 document.createElement('div') 里面
function Component({ active, children, name, renderDiv }) {
  // console.log("name===", name);
  const [targetElement] = useState(() => document.createElement("div"));
  const activatedRef = useRef(false);
  activatedRef.current = activatedRef.current || active;
  useEffect(() => {
    if (active) {
      // 渲染匹配的组件
      renderDiv.current.appendChild(targetElement);
    } else {
      try {
        // 移除不渲染的组件
        renderDiv.current.removeChild(targetElement);
      } catch (e) {}
    }
  }, [active, name, renderDiv, targetElement]);
  useEffect(() => {
    // 添加一个id 作为标识 并没有什么太多作用
    targetElement.setAttribute("id", name);
  }, [name, targetElement]);
  // 把vnode 渲染到document.createElement('div') 里面
  return (
    <>
      {activatedRef.current && ReactDOM.createPortal(children, targetElement)}
    </>
  );
}
export const KeepAliveComponent = memo(Component);
