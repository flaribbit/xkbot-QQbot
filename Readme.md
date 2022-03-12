# xkbot

为了方便自己而编写的机器人，缓慢更新中

## 使用说明
go-cqhttp 开启**反向ws，端口 5700**
```yaml
# ...
  - ws-reverse:
      disabled: false
      universal: ws://127.0.0.1:5700
# ...
```

在 `index.ts` 中导入要使用的插件，使用 `npm run start` 运行机器人。

但默认所有插件都是关闭的，还需要机器人管理员或者群管理员手动开启。

机器人管理命令和使用说明：
- `.bot plugins 查看已安装插件`
- `.bot status 查看插件状态`
- `.bot on <插件名称> 开启插件`
- `.bot off <插件名称> 关闭插件`
- `.bot help <插件名称> 查看插件说明`

## 插件说明
### baike.ts
萌娘百科查询
- `萌娘百科搜<搜索内容>`

### bililive.ts
直播间监控，还没重构完成

### bvinfo.ts
当消息中包含BV号或者B站视频链接时，解析视频封面和基本信息
- `BV1Tb4y1t7t4`
- `https://www.bilibili.com/video/BV1Mr4y1679f`
- `https://b23.tv/D3GD91g`

### dice.ts
简单的骰娘，还没重构完成（这就）
- `.dice`

### latex.ts
当消息中包含latex公式时，渲染成图片
- `\frac{\pi}{2}`

### setu.ts
随机色图，图库我自己建的
- `@<机器人> 来张色图`

### techmino.ts
俄罗斯方块场地转换工具
- `Techmino Field:eJwdy1EKAEEIAlCUghDB+9923O1DHmi7oK2Z24rVnQH8UpVEpGxMjoRadtOs+obvHjwlAYc=`

### throwit.ts
把群友的头像丢出去
- `/丢 <@xxx>`
- `/丢 <QQ号>`

### translate.ts
词典工具
- `.en <word>` 英中
- `.jp <word>` 日中

## 如何编写自己的插件

在 `plugins/myplugin.ts` 中编写

```ts
// plugins/myplugin.ts
import type { Handle } from "../bot"
export const name = "插件名"
export const handle: Handle = function (message, reply, info) {
    reply("你好")
}
```

然后在 `index.ts` 中添加

```ts
bot.use(require("./plugins/myplugin"))
```

无情的说“你好”机器就诞生啦！

如果需要异步的函数，那就这样

```ts
// plugins/myplugin.ts
import type { Handle } from "../bot"
export const name = "插件名"
export const handle: Handle = function (message, reply, info) {
    foo(message.message).then(reply).catch(e=>reply("炸了"))
}

async function foo(msg: string): Promise<string> {
    // 可以在这里用 await 啦
    return "bar"
}
```

或者干脆把 `reply` 也传过去！就不用 `then` 啦！

## 为什么命令前缀都不统一
其实我是喜欢用 `.` 的，色图功能为了防止复读刷屏要求手动艾特，丢人功能抄隔壁机器人用 `/` 我也就跟着用了。
