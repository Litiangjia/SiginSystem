import dialog from "@/assets/ts/messageDialog";
//静态类Message
export default class Message {
  //静态成功方法
  static success(message: string, duration: number = 2000) {
    new dialog({
      type: 'success',
      message: message,
      duration: duration
    });
  }
  //静态失败方法
  static error(message: string, duration: number = 2000) {
    new dialog({
      type: 'error',
      message: message,
      duration: duration
    });
  }

  //静态提示方法
  static info(message: string, duration: number = -1) {
    new dialog({
      type: 'info',
      message: message,
      duration: duration
    });
  }

  //静态警告方法
  static warning(message: string, duration: number = -1) {
    const d = new dialog({
      type: 'warning',
      message: message,
      duration: duration
    });
    return d;
  }

  // 静态自定义方法
  // static dialog(message: string, duration: number = 2000) {
  //   new dialog({
  //     type: 'dialog',
  //     message: message,
  //     duration: duration
  //   });
  // }
}
