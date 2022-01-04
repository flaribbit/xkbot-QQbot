import { Handle } from "../bot"
import { createCanvas, loadImage } from "node-canvas"
import axios from "axios"

export const name = "latex"
export const handle: Handle = (message, reply, info) => {
    const res = message.message.match(/\$(.+?)\$/)
    if (res) {
        latex_codecogs(res[1])
            .then(data => reply(data))
            .catch(_ => reply("你好 炸了"))
    }
}

async function latex_zhihu(tex: string) {
    const image = await loadImage("https://www.zhihu.com/equation?tex=" + encodeURIComponent(tex.replace(/&amp;/g, "&")))
    if (image.width > 1000) return "[图片过大]"
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

async function latex_codecogs(tex: string) {
    const url = "https://latex.codecogs.com/png.image?\\dpi{200}" + encodeURIComponent(tex.replace(/&amp;/g, "&"))
    const image = await axios.get(url, { responseType: "arraybuffer" })
    const data = image.data.toString("base64")
    return `[CQ:image,file=base64://${data}]`
}
