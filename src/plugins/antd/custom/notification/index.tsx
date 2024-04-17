import Icon from "ant-design-vue/lib/icon";
import Notification from "ant-design-vue/lib/vc-notification";

const notificationInstance = {};
let defaultDuration = 5;
let defaultTop = "55px";
let defaultBottom = "24px";
let defaultPlacement = "topRight";
let defaultGetContainer = () => document.body;
let defaultCloseIcon = null;

function setNotificationConfig(options) {
  const { duration, placement, bottom, top, getContainer, closeIcon } = options;
  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  }
  if (bottom !== undefined) {
    defaultBottom = typeof bottom === "number" ? `${bottom}px` : bottom;
  }
  if (top !== undefined) {
    defaultTop = typeof top === "number" ? `${top}px` : top;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
  if (closeIcon !== undefined) {
    defaultCloseIcon = closeIcon;
  }
}

function getPlacementStyle(
  placement,
  top = defaultTop,
  bottom = defaultBottom
) {
  let style;
  switch (placement) {
    case "topLeft":
      style = {
        left: 0,
        top,
        bottom: "auto",
      };
      break;
    case "topRight":
      style = {
        right: 0,
        top,
        bottom: "auto",
      };
      break;
    case "topCenter":
      style = {
        transform: "translateX(-50%)",
        left: "50%",
        top,
        bottom: "auto",
      };
      break;
    case "bottomLeft":
      style = {
        left: 0,
        top: "auto",
        bottom,
      };
      break;
    case "bottomCenter":
      style = {
        transform: "translateX(-50%)",
        left: "50%",
        top: "auto",
        bottom,
      };
      break;
    default:
      style = {
        right: 0,
        top: "auto",
        bottom,
      };
      break;
  }
  return style;
}

function getNotificationInstance(
  {
    prefixCls,
    placement = defaultPlacement,
    getContainer = defaultGetContainer,
    top,
    bottom,
    closeIcon = defaultCloseIcon,
  },
  callback
) {
  const cacheKey = `${prefixCls}-${placement}`;
  if (notificationInstance[cacheKey]) {
    callback(notificationInstance[cacheKey]);
    return;
  }
  Notification.newInstance(
    {
      prefixCls,
      class: `${prefixCls}-${placement}`,
      style: getPlacementStyle(placement, top, bottom),
      getContainer,
      closeIcon: (h) => {
        const icon = typeof closeIcon === "function" ? closeIcon(h) : closeIcon;
        const closeIconToRender = (
          <span class={`${prefixCls}-close-x`}>
            {icon || <Icon class={`${prefixCls}-close-icon`} type="close" />}
          </span>
        );
        return closeIconToRender;
      },
    },
    (notification) => {
      notificationInstance[cacheKey] = notification;
      callback(notification);
    }
  );
}

function notice(args) {
  const { type, message } = args;
  const outerPrefixCls = args.prefixCls || "ant-notification";
  const prefixCls = `${outerPrefixCls}-notice`;
  const duration = args.duration || defaultDuration;

  const { placement, top, bottom, getContainer, closeIcon } = args;
  getNotificationInstance(
    {
      prefixCls: outerPrefixCls,
      placement,
      top,
      bottom,
      getContainer,
      closeIcon,
    },
    (notification) => {
      notification.notice({
        content: (h) => (
          <div class={`${prefixCls}-message`}>{message}</div>
        ),
        duration,
        closable: true,
        onClose: args.onClose,
        onClick: args.onClick,
        key: args.key,
        style: args.style || {},
        class: `${prefixCls}-${type}`,
      });
    }
  );
}

interface Notification {
  success?: (args: any) => void;
  info?: (args: any) => void;
  warning?: (args: any) => void;
  warn?: (args: any) => void;
  error?: (args: any) => void;
  open: (args: any) => void;
  config: (options: any) => void;
  close(key: any): void;
  destroy(): void;
}

const api: Notification = {
  open: notice,
  close(key) {
    Object.keys(notificationInstance).forEach((cacheKey) =>
      notificationInstance[cacheKey].removeNotice(key)
    );
  },
  config: setNotificationConfig,
  destroy() {
    Object.keys(notificationInstance).forEach((cacheKey) => {
      notificationInstance[cacheKey].destroy();
      delete notificationInstance[cacheKey];
    });
  },
};

["success", "info", "warning", "error"].forEach((type) => {
  api[type] = (args) =>
    api.open({
      ...args,
      type,
    });
});

api.warn = api.warning;
export default api;
