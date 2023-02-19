#!/usr/bin/python3

import smtplib
import datetime
from email.header import Header
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart


def sendEmail(sender: str, msg: str, receivers: str):
    # 第三方 SMTP 服务
    mail_host = "smtp.qq.com"  # 设置服务器
    mail_user = "379403404@qq.com"  # 用户名
    mail_pass = "wkbtixiqdpuvbhaj"  # 口令

    message = MIMEMultipart('related')
    message['From'] = Header("Feeling", 'utf-8')
    message['To'] = Header(receivers, 'utf-8')

    subject = '[Feeling] 邮件注册验证码'
    message['Subject'] = Header(subject, 'utf-8')

    msgAlternative = MIMEMultipart('alternative')
    message.attach(msgAlternative)

    html_msg = """
    <div style="display:flex;align-items: center;justify-content: center;background-color:rgba(241, 241, 241, 0.4);">
      <div style="max-width:600px;background-color:white;padding:20px;margin:20px;">
        <h3>Hi! <span style="color:#2c68ad">{user}</span></h3>

        <p>欢迎使用 Feeling，您的验证码是：</p>
        <h2 style="color:#FF1981">{code}</h2>
        <p>有效期 20 分钟，请勿告知他人，以防个人信息泄漏。</p>
        <p>如果你没有请求此代码，可放心忽略这封电子邮件。别人可能错误地键入了你的电子邮件地址。</p>
        <h4 align="right" style="color:#2c68ad">Feeling</h4>
        <p align="right">{time}</p>
      </div>
    </div>
    """

    # <p><img decoding="async" src="cid:image1"></p>
    msgAlternative.attach(
        MIMEText(html_msg.replace("{code}", msg).replace("{user}", receivers).replace("{time}", datetime.datetime.now().strftime("%Y年%m月%d日")), 'html', 'utf-8'))

    # 指定图片为当前目录
    # fp = open('test.jpg', 'rb')
    # msgImage = MIMEImage(fp.read())
    # fp.close()

    # 定义图片 ID，在 HTML 文本中引用
    # msgImage.add_header('Content-ID', '<image1>')
    # message.attach(msgImage)

    smtpObj = smtplib.SMTP_SSL(mail_host)
    smtpObj.connect(mail_host, 465)    # 465 为 SMTP 端口号
    smtpObj.login(mail_user, mail_pass)
    smtpObj.sendmail(sender, receivers, message.as_string())
