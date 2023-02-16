# 一个简易的公众号后端，使用 chatgpt-api 实现问答服务

仓库的 openai key 已经失效了，可以使用自己的替换掉 :(

## Have a try

下面是我自己的网站，访问后会返回一首随机的古诗，然后这也是我公众号配置的 api 路径。
[http://47.99.199.187/wechat-api](http://47.99.199.187/wechat-api)。

**公众号示例**

<img height="400" src="https://raw.githubusercontent.com/PancakeDogLLL/imageBed/master/img/202302161639.PNG" />

## BadCase

微信公众号有 5 秒内回复的限制，所以会出现 ‘该公众号提供的服务出现故障。。。’

## Install

已经通过 docker 构建到阿里云的镜像服务上了

```shell
docker pull registry.cn-hangzhou.aliyuncs.com/jealh/jealh-docker:v1
```

## Thanks

[https://github.com/transitive-bullshit/chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)
