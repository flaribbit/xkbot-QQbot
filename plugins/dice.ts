import { Handle } from "../bot"
import { createCanvas, loadImage } from "node-canvas"

export const name = "dice"
export const handle: Handle = function (message, reply, info) {
    if (message.message == ".dice") {
        dice_mahjong().then(data => reply(`[CQ:image,file=base64://${data}]`))
    }
}

const mahjong_tiles = [
    30, 23, 36, 32, 10, 31, 4, 8, 12, 15,
    35, 24, 27, 37, 1, 20, 5, 9, 13, 16,
    21, 26, 28, 33, 2, 25, 6, 0, 14, 17,
    22, 19, 29, 34, 3, 7, 11,
]

async function dice_mahjong() {
    const mahjong = await loadImage("./assets/mahjong.png")
    const canvas = createCanvas(1120, 130)
    const ctx = canvas.getContext("2d")

    let cards = [
        0, 1, 2, 3, 4, 6, 7, 8, 9,
        0, 1, 2, 3, 4, 6, 7, 8, 9,
        0, 1, 2, 3, 4, 6, 7, 8, 9,
        0, 1, 2, 3, 5, 6, 7, 8, 9,//红5
        10, 11, 12, 13, 14, 16, 17, 18, 19,
        10, 11, 12, 13, 14, 16, 17, 18, 19,
        10, 11, 12, 13, 14, 16, 17, 18, 19,
        10, 11, 12, 13, 15, 16, 17, 18, 19,//红5
        20, 21, 22, 23, 24, 26, 27, 28, 29,
        20, 21, 22, 23, 24, 26, 27, 28, 29,
        20, 21, 22, 23, 24, 26, 27, 28, 29,
        20, 21, 22, 23, 25, 26, 27, 28, 29,//红5
        30, 31, 32, 33, 34, 35, 36,
        30, 31, 32, 33, 34, 35, 36,
        30, 31, 32, 33, 34, 35, 36,
        30, 31, 32, 33, 34, 35, 36,
    ]
    let hand: number[] = []
    for (let i = 0; i < 14; i++) {
        let index = Math.floor(Math.random() * cards.length);
        hand.push(cards.splice(index, 1)[0]);
    }
    hand.sort((a, b) => a - b)
    hand.forEach((c, i) => {
        const tile_id = mahjong_tiles[c]
        const [x, y] = [tile_id / 5 << 0, tile_id % 5]
        ctx.drawImage(mahjong, x * 81, y * 130, 80, 129, i * 80, 0, 80, 129)
    })
    return canvas.toBuffer().toString("base64");
}
