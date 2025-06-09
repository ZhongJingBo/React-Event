/* allNativeEvents 是一个 set 集合，保存了大多数的浏览器事件 */
const allNativeEvents = new Set();
allNativeEvents.add("click");
allNativeEvents.add("change");
allNativeEvents.add("focus");


function getEventCallbackNameFromtEventType(eventType) {
    return {
      click: ["myOnClickCapture", "myOnClick"],
    }[eventType];
}

/**
 * 区分挂载的冒泡 和 捕获事件
 * React 会收集 目标元素到 root根节点之间所有的事件，这里不收集了。
 */
function collectPaths(targetElement, container, eventType) {
  const paths = {
    capture: [],
    bubble: [],
  };

  const callbackNameList = getEventCallbackNameFromtEventType(eventType);

  callbackNameList.forEach((callbackName, i) => {
    const eventCallback = targetElement[callbackName];

    if (i == 0) {
      paths.capture.unshift(eventCallback);
    } else {
      paths.bubble.push(eventCallback);
    }
  });

  return paths;
}



function listenToAllSupportedEvents(container) {
  allNativeEvents.forEach((eventType) => {
    // React 中还有 nonDelegatedEvents保存了 js 中，不冒泡的事件 ，这里不做区分了
    /* 在冒泡阶段绑定事件 */
    listenToNativeEvent(eventType, false, container);
    /* 在捕获阶段绑定事件 */
    listenToNativeEvent(eventType, true, container);
  });
}

function listenToNativeEvent(eventType, isCapturePhaseListener, container) {
    if (isCapturePhaseListener) {
      container.addEventListener(
        eventType,
        (e) => {
          dispatchEvent(container, eventType, e ,isCapturePhaseListener);
        },
        true
      );
    } else {
      container.addEventListener(
        eventType,
        (e) => {
          dispatchEvent(container, eventType, e ,isCapturePhaseListener);
        },
        false
      );
    }
  }

  function createSyntheticEvent(e) {    
	const syntheticEvent = e 
	syntheticEvent.__stopPropagation = false;
	const originStopPropagation = e.stopPropagation.bind(e);

	syntheticEvent.stopPropagation = () => {
		syntheticEvent.__stopPropagation = true;
		if (originStopPropagation) {
			originStopPropagation();
		}
	};

	return syntheticEvent;
}


function dispatchEvent(container, eventType, e ,isCapturePhaseListener) {
  const targetElement = e.target;
  if (targetElement === null) {
    console.error("事件不存在target", e);
    return;
  }

  const { capture, bubble } = collectPaths(targetElement, container, eventType);
  const se = createSyntheticEvent(e);
  if(isCapturePhaseListener){
    triggerEventFlow(capture,se);
  }else{
    if(!se.__stopPropagation){
        triggerEventFlow(bubble ,se);
    }
  
  }
}

function triggerEventFlow(paths ,se) {
    for (let i = 0; i < paths.length; i++) {
      const callback = paths[i];


      callback.call(null,se);
      if (se.__stopPropagation) {
        break;
    }
    }
}
  


/**
 * 获取dom 模拟React事件注册
 */
function createRoot() {
  const container = document.querySelector("#container");

  // 为容器注册事件
  listenToAllSupportedEvents(container);
}

createRoot();
