import { _decorator, Color, Component, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
    // 编辑器可配置：方块宽高，默认 40
    @property({ type: Number, tooltip: "方块宽度" })
    blockWidth: number = 40;

    @property({ type: Number, tooltip: "方块高度" })
    blockHeight: number = 40;

    onLoad() {
        // 初始化尺寸
        const trans = this.node.getComponent(UITransform)!;
        trans.setContentSize(this.blockWidth, this.blockHeight);
    }

    /** 设置方块颜色 */
    setColor(color: Color) {
        const sprite = this.node.getComponent(Sprite)!;
        sprite.color = color;
    }

    /** 根据网格行列计算坐标 */
    setGridPos(col: number, row: number) {
        const x = col * this.blockWidth;
        const y = -row * this.blockHeight;
        this.node.setPosition(x, y);
    }
}

