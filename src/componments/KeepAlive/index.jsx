import ReactDOM from "react-dom";
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  Suspense,
} from "react";
import { useLocation, Navigate } from "react-router-dom";
/**
 * 1、pop（页面回退）的时候删除上一页的缓存
 * 1-1、路由变化的时候，哪些路由不需要删除
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
  children,
  name,
  renderDiv,
  activeName,
  isNeedSuspense,
  SuspenseLoading,
}) {
  //缓存页面离屏渲染的 div
  const aliveContainer = document.createElement("div");
  aliveContainer.setAttribute("id", "keepalive-" + name);
  /*无需设置样式*/
  // aliveContainer.setAttribute("style", "width: 100%; height: 100%;");
  // aliveContainer.children[0].scrollBy(0, 100);
  const targetElement = useRef(aliveContainer);
  const returnEleRef = useRef(
    isNeedSuspense
      ? ReactDOM.createPortal(
          <Suspense fallback={SuspenseLoading}>{children}</Suspense>,
          targetElement.current,
          name
        )
      : ReactDOM.createPortal(children, targetElement.current, name)
  );
  useEffect(() => {
    if (name === __ORANGE__KeepAliveArgs__ORANGE__.lastActiveName) {
    }
    // 渲染匹配的组件,执行页面显示hook
    if (name === activeName) {
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
      renderDiv.current.appendChild(targetElement.current);
    } else {
      try {
        // 移除不渲染的组件
        renderDiv.current.removeChild(targetElement.current);
      } catch (e) {}
    }
  }, [activeName, name, renderDiv]);
  // 把vnode 渲染到 aliveContainer 里面
  return <>{returnEleRef.current}</>;
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
  isNeedSuspense = false, //用于懒加载的处理
  SuspenseLoading = <div>loading</div>, //懒加载时的loading
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
  //目前显示的是哪个页面的路由
  const location = useLocation();
  const nowShowPathname = activeName || location.pathname;
  /**
   * 判断一些不需要缓存的组件，比如重定向，直接重定向，不需要缓存
   * 这里不能用type.name 判断组件是否是Navigate，因为生产版编译后type.name 都是t
   * */
  const isNoNeedCacheElement = useMemo(() => {
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
      else return false;
    } else return false;
  }, [children]);

  if (!isNoNeedCacheElement) {
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
  }

  //滚动到上次离开到位置
  useEffect(() => {
    if (!children) return;
    if (isNoNeedCacheElement) return;
    const component = components.current.find(
      (res) => res.name === nowShowPathname
    );
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
  } else if (isNoNeedCacheElement) {
    return <>{children}</>;
  } else {
    return (
      <>
        <div ref={containerRef} id="react-router-dom6-keepalive-container" />
        {components.current.map(({ name, ele }) => (
          <KeepAliveComponent
            activeName={nowShowPathname}
            renderDiv={containerRef}
            name={name}
            key={name}
            isNeedSuspense={isNeedSuspense}
            SuspenseLoading={SuspenseLoading}
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

export const removeKeeAliveHook = function (activeName, type = "show") {
  if (type === "show") {
    __ORANGE__KeepAliveArgs__ORANGE__.pageShowFuns =
      __ORANGE__KeepAliveArgs__ORANGE__.pageShowFuns.filter(
        (item) => item !== activeName
      );
  } else {
    __ORANGE__KeepAliveArgs__ORANGE__.pageHidenFuns =
      __ORANGE__KeepAliveArgs__ORANGE__.pageHidenFuns.filter(
        (item) => item !== activeName
      );
  }
};
