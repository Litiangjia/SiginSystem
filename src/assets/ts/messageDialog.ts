// dialog.ts
import '@/assets/commonLess/componentsLess/messageDialog.less';
import { date } from 'yup';

//规范化的消息提示框（接口既是规范，又是功能）
interface DialogOptions {
  message: string ;   // 消息内容
  duration?: number;          // 显示时长，单位毫秒
  parentElement?: HTMLElement; // 指定插入的父元素，默认为document.body
  type?: 'info' | 'success' | 'warning' | 'error' | 'dialog'; // 消息类型
  infoDuration?: number; // info类型时,锁头解锁时间
  title?: string; // 标题
}

class MessageDialog {
  private  bl = false; // 锁头
  private static obj = {}; // 单例对象
  private parentObj: MessageDialog | Record<string, never> = {};

  private element = document.createElement("div");
  private options: Required<DialogOptions>;//使用规范化的配置（代表必须遵守包含该接口的属性功能）
  private timer: number | null = null; // 定时器
  public fn = () => { }; // 回调函数

  constructor(options: DialogOptions) { //构造方法
    // 合并默认配置
    this.options = {
      duration: -1,   //负数表示永久显示  不定时关闭
      parentElement: document.body,
      type: 'info',
      title: '',
      infoDuration:50, //默认锁头解锁时间为500毫秒
      ...options
    };



    if(this.options.type == 'info'){  //消息队列等待机制
        if(Object.keys(MessageDialog.obj).length==0){
           MessageDialog.obj = this;
        }else{
          this.parentObj = MessageDialog.obj;
          MessageDialog.obj = this;
        }

        this.infoShow(this.options.duration); //info类型时，自动关闭定时器 无duration负数限制
    }
    this.createElement();
    this.show();
  }




 /**
   * 创建消息框DOM元素
   */
  private createElement(): void { //无返回值
    // 设置内容
    switch (this.options.type) {
      case 'info':
          this.element.className = 'infoDialog';
          this.element.innerHTML = `
            <div class="infoDialog__title">消息提示</div>
            <div class="infoDialog__content">${this.options.message}}</div>
          `;
          // 绑定关闭事件
        //  this.bindCloseEvent('infoDialog__actions','close__infoDialog');
        break;
      case'success':
        this.element.className = 'successDialog';
        this.element.innerHTML = `
          <div class="successDialog__title">成功</div>
          <div class="successDialog__content">${this.options.message}</div>
          <div class="successDialog__actions">
            <button>确定</button>
          </div>
        `
        // 绑定关闭事件
        this.bindCloseEvent('successDialog__actions',"close__successDialog");
        break;
      case 'error':
        this.element.className = 'errorDialog'
        this.element.innerHTML = `
          <div class="errorDialog__title">error</div>
          <div class="errorDialog__content">${this.options.message}</div>
          <div class="errorDialog__actions">
            <button>确定</button>
          </div>
      `
        // 绑定关闭事件
        this.bindCloseEvent('errorDialog__actions',"close__errorDialog");
        break;
      case 'dialog':
         this.element.className = 'dialog';
         this.element.innerHTML = `
            <div class="dialog__title">${this.options.title}</div>
            <div class="dialog__content">${this.options.message}</div>
            <div class="dialog__actions">
              <button>确定</button>
            </div>
          `;
          // 绑定关闭事件
          this.bindCloseEvent('dialog__actions',"close__dialog");
        break;
      default:
        this.element.className = 'warningDialog';
        this.element.innerHTML = `
          <div class="warningDialog__title">警告</div>
          <div class="warningDialog__content">${this.options.message}</div>
          <div class="warningDialog__actions">
            <button>确定</button>
          </div>
        `
        // 绑定关闭事件
        this.bindCloseEvent('warningDialog__actions',"close__warningDialog");
        break;
    }
    //执行回调函数
    this.element.addEventListener('animationend', () => {
      //this.enter(function)
      this.fn(); //执行回调函数
    })
  }
  /**
   * 绑定关闭事件
   */
  public bindCloseEvent(className:string,className2:string|null=null){
     // 绑定关闭事件
    const closeBtn = this.element.querySelector('.'+className) as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      this.close(className2);
    });
  }

  public enter(fn:()=>void): void {
    this.fn = fn; //设置回调函数
  }

  /**
   * 显示消息框
   */
  public show(): void {
    // 插入到指定父元素或默认body
    this.options.parentElement.appendChild(this.element);
    // 自动关闭定时器
    const type = this.options.type;
    const duration = this.options.duration;
    //info类型时，自动关闭定时器 无duration负数限制
    if(type=='info'){
      //this.infoShow(duration); //info类型时，自动关闭定时器 无duration负数限制
    }else if(duration>0){
      //非info类型时，有duration限制
      // 设置定时器,非info类型时，有duration限制
      this.timer = window.setTimeout(() => {
          this.close(
            type=='dialog'?'close__dialog'
            :type=='success'?'close__successDialog'
            :type=='error'?'close__errorDialog'
            :'close__warningDialog');
      }, duration);
    }
  }

  public infoShow(duration:number): void {
      if(Object.keys(this.parentObj).length===0){ //第一个弹窗时，启动定时器
          this.clearTimer(this.timer);
          // 触发退出动画
          this.timer = window.setTimeout(() => {
            console.log(this.options.message,duration);
            this.element.style['zIndex'] = '99999';
            this.close("close__infoDialog");
          }, duration<0?1:duration);
          this.element.addEventListener("animationstart",()=>{//
              if(this.element.className.includes('close__infoDialog')){ //
                  setTimeout(() => {
                    this.bl = true; //锁头开给子弹窗
                  },this.options.infoDuration)
              }
          });
      }else{ //子弹窗时
          if (this.parentObj instanceof MessageDialog && this.parentObj.bl) {
            this.clearTimer(this.timer);
            // 触发退出动画
            this.timer = window.setTimeout(() => {
              console.log(this.options.message,duration);
              this.element.style['zIndex'] = '99999';
              this.close("close__infoDialog");
            }, duration<0?1:duration);

            this.element.addEventListener("animationstart",()=>{//
                if(this.element.className.includes('close__infoDialog')){ //
                    setTimeout(() => {
                      this.bl = true; //锁头开给子弹窗
                    },this.options.infoDuration)
                }
            });

          }else{
             setTimeout(() => {
                this.infoShow(duration);
             },1);//延时执行，防止父弹窗动画还没结束时，子弹窗动画开始，导致子弹窗闪烁
          }
      }
  }

  /**
   * 清除定时器
   */
  public clearTimer(timer:number|null): void {
    if(timer){
      clearTimeout(timer);
      timer = null;
    }
  }

  /**
   * 关闭消息框
   */
  public close(className:string|null): void {
    // 清除定时器
    this.clearTimer(this.timer);
    // 触发退出动画
    this.element.className += ' '+className;

    // 监听动画结束事件
    this.element.addEventListener('animationend', () => {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    });

  }

  /**
   * 静态方法，快速显示消息
   */
  static show(options: DialogOptions): MessageDialog {
    return new MessageDialog(options);
  }
}
export default MessageDialog;
