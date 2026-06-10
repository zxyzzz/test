import { _decorator, Color, Component, instantiate, Prefab } from 'cc';
import { Block } from './Block';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property({ type: Prefab })
    blockPrefab: Prefab | null = null;

    start() {
        console.log('Main scene loaded!');
        this.createBlock();
    }

    createBlock() {
        if (!this.blockPrefab) {
            console.warn('Block prefab is not assigned!');
            return;
        }

        // 实例化方块预制体
        const blockNode = instantiate(this.blockPrefab);
        const block = blockNode.getComponent(Block)!;

        // 设置方块颜色为红色
        block.setColor(new Color(172, 33, 255));

        // 设置方块位置（居中显示）
        blockNode.setPosition(0, 0);

        // 添加到当前节点下
        blockNode.parent = this.node;
    }

    update(deltaTime: number) {

    }
}
