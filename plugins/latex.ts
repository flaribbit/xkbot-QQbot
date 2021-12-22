import type { Handle } from "../bot"
import { createCanvas, loadImage } from "node-canvas"

export const name = "latex"
export const handle: Handle = (message, reply, info) => {
    const res = message.message.match(/\$(.+?)\$/)
    if (res) {
        latex(res[1]).then(data => reply(data))
    }
}

async function latex(tex: string) {
    const image = await loadImage("https://www.zhihu.com/equation?tex=" + encodeURIComponent(tex))
    if (image.width > 1000) return "[图片过大]";
    // enlarge the svg image
    image.width *= 2
    image.height *= 2
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, image.width, image.height)
    ctx.drawImage(image, 0, 0)
    const data = canvas.toBuffer("image/png").toString("base64")
    return `[CQ:image,file=base64://${data}]`
}
