import type { Handle } from "../bot"
import { createCanvas, loadImage } from "canvas"

export const name = "丢人"
export const help = "/丢 <@xxx>\n/丢 <QQ号>"
export const handle: Handle = (message, reply, info) => {
    const res = message.message.match(/^\/丢 ?(?:\[CQ:at,qq=(\d+)\]|(\d+))/)
    if (res) {
        const user_id = res[1] || res[2]
        throw_it(user_id).then(reply).catch(e => reply("错误: " + e.message))
    }
}

async function throw_it(user_id: string) {
    const template = await loadImage("./assets/throwit.png")
    const avatar = await loadImage("https://q4.qlogo.cn/g?b=qq&s=5&nk=" + user_id)
    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext("2d")
    // draw avatar
    ctx.save()
    ctx.translate(87, 249)
    ctx.rotate(-160 * Math.PI / 180)
    ctx.scale(138 / avatar.width, 138 / avatar.height)
    ctx.drawImage(avatar, -avatar.width / 2, -avatar.height / 2)
    ctx.restore()
    // circle mask
    ctx.globalCompositeOperation = "destination-in"
    ctx.beginPath()
    ctx.arc(87, 249, 69, 0, Math.PI * 2)
    ctx.fill()
    // draw template image
    ctx.globalCompositeOperation = "destination-over"
    ctx.drawImage(template, 0, 0)
    return `[CQ:image,file=base64://${canvas.toBuffer().toString("base64")}]`
}
