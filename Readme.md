# xkbot

为了方便自己而编写的机器人，缓慢更新中

## ~~目前功能~~ 正在重构

| 指令                 | 描述                   |
| -------------------- | ---------------------- |
| .r                   | 6面骰                  |
| .r dn                | n面骰子(最大200)       |
| .draw x              | 抽牌(x=地主/农民/麻将) |
| .jrrp                | 今日人品值(娱乐)       |
| .pcr                 | 公主连结模拟抽卡(十连) |
| .weibo 昵称 id       | 添加博主               |
| .weibo 昵称          | 获取最新一条微博       |
| .en apple            | 查英文单词 apple       |
| .jp ほしぞら         | 查日语单词 ほしぞら    |
| .zhihu               | 获取知乎热榜           |
| .bililive add 用户名 | 关注直播间             |
| .bililive del 用户名 | 取消关注直播间         |
| .bililive start      | 开始直播间监控         |
| .bililive stop       | 停止直播间监控         |

## 如何增加功能

参考下面的代码

```ts
// plugins/myplugin.ts
import type { Handle } from "../bot";
export const name = "插件名";
export const handle: Handle = function (message, reply, info) {
    reply("你好");
}
```

然后在 `index.ts` 中添加

```ts
bot.use(require("./plugins/myplugin"));
```
