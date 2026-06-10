import { _decorator, Color, Component, instantiate, Node, Prefab } from 'cc';
import { Block } from './Block';

const { ccclass, property } = _decorator;

@ccclass('BlockManager')
export class BlockManager extends Component {
    @property({ type: Prefab })
    blockPrefab: Prefab | null = null;

    /** 预设颜色 */
    private static readonly COLORS = {
        RED: new Color(255, 0, 0),     // 红色
        GREEN: new Color(0, 255, 0),   // 绿色
        BLUE: new Color(0, 0, 255),   // 蓝色
        YELLOW: new Color(255, 255, 0), // 黄色
        ORANGE: new Color(255, 165, 0), // 橙色
        PURPLE: new Color(128, 0, 128), // 紫色
        PINK: new Color(255, 192, 203), // 粉色
        CYAN: new Color(0, 255, 255),  // 青色
    };

    start() {
        // 示例：创建一个红色方块
        this.createBlock(0, 0, BlockManager.COLORS.RED);
        
        // 示例：创建一个蓝色方块
        this.createBlock(1, 0, BlockManager.COLORS.BLUE);
        
        // 示例：创建一个黄色方块
        this.createBlock(2, 0, BlockManager.COLORS.YELLOW);
    }

    /** 创建方块 */
    createBlock(col: number, row: number, color: Color) {
        if (!this.blockPrefab) {
            console.warn('Block prefab is not assigned!');
            return null;
        }

        // 实例化预制体
        const blockNode = instantiate(this.blockPrefab);
        const block = blockNode.getComponent(Block)!;
        
        // 设置颜色
        block.setColor(color);
        
        // 设置位置
        block.setGridPos(col, row);
        
        // 添加到场景
        blockNode.parent = this.node;
        
        return block;
    }
}
