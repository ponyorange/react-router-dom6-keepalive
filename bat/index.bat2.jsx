import ReactDOM from "react-dom";
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocation, Navigate } from "react-router-dom";
/**
 * 1、pop（页面回退）的时候删除上一页的缓存
 * 1-1、路由变化的时候，哪些路由不需要删除
 * 2、暴露方法给外部自己删除
 * 有两个模式：
 * 1、用黑白名单
 * 2、pop自动删除缓存页面
 * 什么参数都不传，则所有页面都缓存
 * */

/* 钩子 */
const __ORANGE__KeepAliveArgs__ORANGE__ = {
  pageShowFuns: [], //页面显示钩子，*代表所有。
  pageHidenFuns: [], //页面隐藏钩子
  lastActiveName: undefined, //上一次显示的页面路由
};

// 渲染当前匹配的路由 不匹配的 利用createPortal 移动到 document.createElement('div') 里面
function _KeepAliveComponent({
  active,
  children,
  name,
  renderDiv,
  activeName,
}) {
  const [targetElement] = useState(() => document.createElement("div"));
  const activatedRef = useRef(false);
  activatedRef.current = activatedRef.current || active;
  useEffect(() => {
    if (name === __ORANGE__KeepAliveArgs__ORANGE__.lastActiveName) {
    }
    // 渲染匹配的组件,执行页面显示hook
    if (active) {
      //执行页面隐藏钩子
      __ORANGE__KeepAliveArgs__ORANGE__.pageHidenFuns.forEach((item) => {
        if (
          item.activeName === __ORANGE__KeepAliveArgs__ORANGE__.lastActiveName
        ) {
          item.callBack();
        }
      });
      // 执行页面显示钩子
      __ORANGE__KeepAliveArgs__ORANGE__.pageShowFuns.forEach((item) => {
        if (item.activeName === activeName || item.activeName === "*") {
          item.callBack();
        }
      });
      //改变上一次页面
      __ORANGE__KeepAliveArgs__ORANGE__.lastActiveName = activeName;
      renderDiv.current.appendChild(targetElement);
      // renderDiv.current.appendChild(targetElement.children[0]);
    } else {
      try {
        // 移除不渲染的组件
        renderDiv.current.removeChild(targetElement);
      } catch (e) {}
    }
  }, [activeName, active, name, renderDiv, targetElement]);
  useEffect(() => {
    // 添加一个id 作为标识 并没有什么太多作用
    targetElement.setAttribute("id", name);
    //添加页面style
    // targetElement.setAttribute("style", "width: 100%; height: 100%;");
    // targetElement.children[0].scrollBy(0, 100);
  }, [name, targetElement]);
  // 把vnode 渲染到document.createElement('div') 里面
  return (
    <>
      {activatedRef.current && ReactDOM.createPortal(children, targetElement)}
    </>
  );
}
export const KeepAliveComponent = memo(_KeepAliveComponent);

function KeepAlive({
  exclude,
  include,
  activeName,
  children,
  isPopDelete = false, //返回上一页的时候，删除当前页的缓存。否则不删除，直到超过最大缓存数
  alwaysCacheRouts = [], //控制哪些路由总是缓存，应用场景：tabar对应的页面。在isPopDelete=true时生效
  maxLen = 10,
}) {
  if (include && exclude) {
    exclude = undefined;
    console.warn(
      "白名单和黑名单同时存在时，只会使用白名单。也就是说黑名单将会被忽略。"
    );
  }
  if (include || exclude) {
    //优先使用黑白名单
    isPopDelete = false;
  }

  const lastActiveComponent = useRef(null);
  const containerRef = useRef(null);
  const components = useRef([]);
  const [stateComponets, setStateComponets] = useState([]);
  //目前显示的是哪个页面的路由
  const location = useLocation();
  const nowShowPathname = activeName || location.pathname;
  /**
   * 判断一些不需要缓存的组件，比如重定向，直接重定向，不需要缓存
   * 这里不能用type.name 判断组件是否是Navigate，因为生产版编译后type.name 都是t
   * */
  const isNoNeedCacheElement = () => {
    const navEle = <Navigate to="/" />;
    if (!children) return true;
    else if (navEle.type === children.props.children.type) return true;
    else if (children.props.value.outlet) {
      if (navEle.type === children.props.value.outlet.props.children.type)
        return true;
      else if (
        children.props.value.outlet.props.value.outlet &&
        navEle.type ===
          children.props.value.outlet.props.value.outlet.props.children.type
      )
        return true;
    } else return false;
  };

  useLayoutEffect(() => {
    if (!children) return;
    // 重定向判断
    if (isNoNeedCacheElement()) return;
    // 缓存超过上限的 删除第一个缓存
    if (components.current.length >= maxLen) {
      components.current = components.current.slice(1);
    }
    // 添加
    let component = components.current.find(
      (res) => res.name === nowShowPathname
    );
    let isNeedCache = true; //默认全都缓存
    if (include) {
      isNeedCache = !!include.includes(nowShowPathname);
    } else if (exclude) {
      isNeedCache = !exclude.includes(nowShowPathname);
    }
    if (!component) {
      component = {
        name: nowShowPathname,
        ele: children,
        isNeedCache,
        scrollTop: 0,
      };
      components.current = [...components.current, component];
    } else {
      //找到了缓存的页面
      const pageIdx = components.current.indexOf(component) + 1;
      const pageLen = components.current.length;
      if (
        pageIdx < pageLen &&
        !alwaysCacheRouts.includes(lastActiveComponent.current.name) &&
        isPopDelete
      ) {
        //页面回退
        //把最后一个给删掉
        components.current = components.current.slice(
          0,
          components.current.length - 1
        );
      }
      //把不需要缓存的页面删掉
      else if (lastActiveComponent.current) {
        //把不需要缓存的页面删掉
        if (!lastActiveComponent.current.isNeedCache) {
          components.current = components.current.filter(
            (item) => item !== lastActiveComponent.current
          );
        }
      }
    }

    lastActiveComponent.current = component;
    setStateComponets([...components.current]);
  }, [children, maxLen, alwaysCacheRouts, isPopDelete, exclude, include]);

  //滚动到上次离开到位置
  useEffect(() => {
    if (!children) return;
    if (isNoNeedCacheElement()) return;
    const component = components.current.find((res) => res.name === activeName);
    if (component) {
      const lastEle = containerRef.current;
      document.getElementsByTagName("html")[0].scrollTop = component.scrollTop;
      return () => {
        component.scrollTop = -lastEle.getBoundingClientRect().top;
      };
    }
  }, [children]);

  if (!children) {
    return <></>;
  } else if (isNoNeedCacheElement()) {
    return <>{children}</>;
  } else {
    return (
      <>
        <div ref={containerRef} id="react-router-dom6-keepalive-container" />
        {stateComponets.map(({ name, ele }) => (
          <KeepAliveComponent
            active={name === nowShowPathname}
            activeName={nowShowPathname}
            renderDiv={containerRef}
            name={name}
            key={name}
          >
            {ele}
          </KeepAliveComponent>
        ))}
      </>
    );
  }
}
export default memo(KeepAlive);

export const onPageShow = function (activeName, callBack) {
  if (
    __ORANGE__KeepAliveArgs__ORANGE__.pageShowFuns.some(
      (item) => item.activeName === activeName
    )
  ) {
    //提示使用第一个
    console.warn(
      "你已经注册了",
      activeName,
      "pageShow,默认使用第一个，请注意调用"
    );
  } else {
    __ORANGE__KeepAliveArgs__ORANGE__.pageShowFuns.push({
      activeName,
      callBack,
    });
  }
};

export const onPageHiden = function (activeName, callBack) {
  if (
    __ORANGE__KeepAliveArgs__ORANGE__.pageHidenFuns.some(
      (item) => item.activeName === activeName
    )
  ) {
    //提示使用第一个
    console.warn(
      "你已经注册了",
      activeName,
      "pageHiden,默认使用第一个，请注意调用"
    );
  } else {
    __ORANGE__KeepAliveArgs__ORANGE__.pageHidenFuns.push({
      activeName,
      callBack,
    });
  }
};
