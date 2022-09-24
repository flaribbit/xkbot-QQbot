import type { Handle } from "../bot"
import { inflateSync } from "zlib"
import { createCanvas, CanvasRenderingContext2D } from "canvas"

export const name = "techmino"
export const help = "把Techmino场地代码转换成图片"
export const handle: Handle = (message, reply, info) => {
    if (message.message.startsWith(header)) {
        reply(draw(message.message.trimEnd()))
    }
}

type Piece = "T" | "I" | "O" | "L" | "J" | "S" | "Z" | "X" | "_"
const header = "Techmino Field:"
const pieceid = { 0x0f: "T", 0x0a: "I", 0x05: "O", 0x04: "L", 0x0c: "J", 0x08: "S", 0x02: "Z", 0x01: "_" }

export class Field {
    readonly height: number
    readonly data: Buffer
    constructor(str: string) {
        if (!str.startsWith(header)) return
        this.data = inflateSync(Buffer.from(str.substring(header.length), "base64"))
        this.height = this.data.length / 10
    }
    at(i: number, j: number): Piece {
        if (i >= this.height) return "_"
        const piece = this.data[i * 10 + j]
        return pieceid[piece] || "X"
    }
}

const colors = {
    "T": ["#b451ac", "#e56add"],
    "I": ["#41afde", "#43d3ff"],
    "O": ["#f7d33e", "#fff952"],
    "L": ["#ef9535", "#ffbf60"],
    "J": ["#1983bf", "#1ba6f9"],
    "S": ["#66c65c", "#88ee86"],
    "Z": ["#ef624d", "#ff9484"],
    "X": ["#686868", "#949494"],
    "_": ["#686868", "#949494"],
}

function drawField(ctx: CanvasRenderingContext2D, field: Field, drawheight: number) {
    const height = drawheight - 1
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
            var piece = field.at(i, j)
            if (piece != "_") {
                ctx.fillStyle = colors[piece][0]
                ctx.fillRect(j * 20, (height - i) * 20, 20, 20)
                ctx.fillStyle = colors[piece][1]
                ctx.fillRect(j * 20, (height - i) * 20, 20, -4)
            }
        }
    }
}

function draw(str: string) {
    const field = new Field(str)
    const drawheight = 20
    const canvas = createCanvas(20 * 10, 20 * drawheight)
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#f3f3ed"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawField(ctx, field, drawheight)
    return `[CQ:image,file=base64://${canvas.toBuffer().toString("base64")}]`
}
