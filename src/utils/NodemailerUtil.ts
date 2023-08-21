import {createTransport, Transporter, SentMessageInfo} from "nodemailer";

let _instance: Transporter<SentMessageInfo>;

export interface IMailInfo{
    title:string,
    name:string,
    msg:string,
}

/**
 * 用于发送邮件的工具类
 */
export class NodemailerUtil {
    public static sendPddMail(to: string, info: IMailInfo) {
        const instance = this.getInstance();
        instance.sendMail({
            from: "后台管理插件消息通知 <123@qq.com>", // sender address
            to: to, // list of receivers
            subject: info.title, // Subject line
            html: `<div style="width:100%">
                      <style>
                          .title {
                              font-size: 20px;
                              text-align: center;
                              padding: 10px;
                              font-weight: bold;
                              color: #f00;
                          }
                    
                          .item {
                            padding: 10px;
                          }
                    
                          .item-label {
                            font-size: 16px;
                          }
                    
                          .item-value {
                              font-size: 14px;
                          }
                          .item-value img{
                                width: 100%;
                          }
                      </style>
                      <div class="title">${info.title}</div>
                      <div class="item">
                        <span class="item-label">店铺名称:</span>
                        <span class="item-value">${info.name}</span>
                      </div> 
                      <div class="item">
                        <span class="item-label">信息:</span>
                        <span class="item-value">${info.msg}</span>
                      </div>
                    </div>`,
        }).catch(error => {
            console.error("邮箱发送错误",error);
        })
    }

    private static getInstance() {
        if (!_instance) {
            _instance = createTransport({
                service: "qq", // 邮箱类型 例如service:'163'
                secure: true, // 是否使用安全连接，对https协议的
                // host: 'smtp.163.com',
                // port: 587, //qq邮件服务所占用的端口
                auth: {
                    user: "123@qq.com",// 开启SMTP的邮箱，发件人
                    pass: "1233"// qq授权码
                }
            })
        }
        return _instance;
    }

}
