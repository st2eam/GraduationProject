## 📖项目简介

本项目是一个基于Bert的个性化文本推荐的信息流社交应用，代号 `Feeling`。使用 `create-react-app` 脚手架创建工程，使用前后端分离的开发模式。它的前端基于`React`和`TypeScript`实现，服务端基于`Python` + `MongoDB` + `Flask` + `Bert` 编写。

除了完善项目主要功能，还需要在从用户的层面出发，为用户考虑，遵循UI/UX设计原则，在用户的感知以及用户反馈的体验上尽量做到最佳。用户在足够清晰的界面环境中能够轻松操作，产品逻辑清晰，用户体验良好。

### 前端

主要技术栈：

- React 18+
- react-router-dom v6
- Typescript
- Scss

主要工具库：

- axios
- dayjs
- ali-oss
- [ahooks](https://github.com/alibaba/hooks) - React Hooks 库

UI库：

- [Ant Design Mobile](https://mobile.ant.design/)
- [Ant Motion](https://motion.ant.design/) - 设计动效

### 服务端

主要技术栈：

- ali-oss
- Bert
- Flask
- gensim
- keybert
- PyMongo
- Word2Vec

## 🛠️核心功能

### 主页

个性化推送文章，被关注用户以及自己的帖子、转发、回复内容也会出现在自己的信息流中。

### 帖子

用户可以发布独立的帖子，删除自己的帖子，也可以评论、转发、喜欢别人的帖子。

### 查询

用户可以查询帖子以及用户。

### 通知

用户之间可以互相关注，用户被关注、点赞评论或者转发了帖子，会收到通知。

### 个人中心

用户可以修改自己的个人信息，可以查看自己的帖子以及喜欢的帖子

## 📝核心难题清单

- ✅数据库数据结构设计
- ✅注册登录短信/邮箱认证
- ✅阿里oss对象存储服务
- ✅bert模型训练
- ✅文章前后端业务逻辑
- ✅推荐算法实际应用
