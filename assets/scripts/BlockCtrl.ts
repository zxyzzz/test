import { _decorator, Component, Prefab, instantiate, Node, Vec2, input, Input, KeyCode } from 'cc';
import { TetrisMap } from './TetrisMap';
const { ccclass, property } = _decorator;

// 俄罗斯方块7种形状：每个格子为【相对坐标】
const SHAPE_LIST: number[][][] = [
    [[0, 0], [1, 0], [0, 1], [1, 1]], // O 方块
    [[0, 0], [0, 1], [0, 2], [0, 3]], // I 长条
    [[0, 0], [1, 0], [2, 0], [1, 1]], // T 型
    [[0, 0], [0, 1], [1, 1], [2, 1]], // L 型
    [[2, 0], [0, 1], [1, 1], [2, 1]], // 反L
    [[1, 0], [2, 0], [0, 1], [1, 1]], // Z 型
    [[0, 0], [1, 0], [1, 1], [2, 1]]  // 反Z
];

@ccclass('BlockCtrl')
export class BlockCtrl extends Component {
    // 绑定单个方块预制体
    @property(Prefab)
    blockPrefab: Prefab = null!;
    // 绑定地图管理脚本
    @property(TetrisMap)
    mapCtrl: TetrisMap = null!;

    private blockNodes: Node[] = [];    // 当前组合的所有方块节点
    private shapePoints: Vec2[] = [];   // 当前形状相对坐标
    private curGridPos = new Vec2(4, 0);// 方块出生位置（横向居中）
    private dropTimer = 0;
    private readonly DROP_TIME = 1;    // 自动下落间隔（秒）

    onLoad() {
        // 监听键盘按键
        input.on(Input.EventType.KEY_DOWN, this.onKeyPress, this);
        // 游戏启动，生成第一个方块
        this.createNewShape();
    }

    update(deltaTime: number) {
        // 自动下落计时
        this.dropTimer += deltaTime;
        if (this.dropTimer >= this.DROP_TIME) {
            this.moveBlock(0, 1);
            this.dropTimer = 0;
        }
    }

    // 生成新的方块组合
    createNewShape() {
        // 随机选一种形状
        const randIdx = Math.floor(Math.random() * SHAPE_LIST.length);
        const shape = SHAPE_LIST[randIdx];
        this.shapePoints = shape.map(item => new Vec2(item[0], item[1]));

        // 销毁上一组方块
        this.destroyAllBlocks();
        this.blockNodes = [];

        // 实例化预制体，生成整组方块
        for (const p of this.shapePoints) {
            const block = instantiate(this.blockPrefab);
            block.setParent(this.mapCtrl.blockRoot);
            this.blockNodes.push(block);
        }

        // 更新方块位置
        this.refreshPos();
    }

    // 刷新所有方块的世界坐标
    refreshPos() {
        for (let i = 0; i < this.blockNodes.length; i++) {
            const p = this.shapePoints[i];
            const gx = this.curGridPos.x + p.x;
            const gy = this.curGridPos.y + p.y;
            const worldPos = this.mapCtrl.grid2World(gx, gy);
            this.blockNodes[i].setPosition(worldPos.x, worldPos.y, 0);
        }
    }

    // 移动方块（offsetX左右，offsetY上下）
    moveBlock(offsetX: number, offsetY: number) {
        // 碰撞检测
        if (this.mapCtrl.isCollision(this.shapePoints, this.curGridPos.x + offsetX, this.curGridPos.y + offsetY)) {
            // 向下移动碰撞 = 触底落地
            if (offsetY > 0) {
                this.landBlock();
            }
            return;
        }
        // 移动生效
        this.curGridPos.x += offsetX;
        this.curGridPos.y += offsetY;
        this.refreshPos();
    }

    // 方块旋转（顺时针）
    rotateBlock() {
        const temp = this.shapePoints.map(v => new Vec2(v.x, v.y));
        // 旋转算法
        for (const p of temp) {
            const x = p.x;
            p.x = -p.y;
            p.y = x;
        }
        // 旋转后不碰撞才生效
        if (!this.mapCtrl.isCollision(temp, this.curGridPos.x, this.curGridPos.y)) {
            this.shapePoints = temp;
            this.refreshPos();
        }
    }

    // 方块落地：写入地图 + 消行 + 生成下一组
    landBlock() {
        // 1. 将当前方块位置标记为固定瓦片
        for (let i = 0; i < this.shapePoints.length; i++) {
            const p = this.shapePoints[i];
            const gx = this.curGridPos.x + p.x;
            const gy = this.curGridPos.y + p.y;
            this.mapCtrl.setTileID(gx, gy, 1);
        }
        // 2. 检测并消除满行
        this.mapCtrl.clearFullLines();
        // 3. 生成新方块
        this.createNewShape();
    }

    // 销毁当前所有动态方块预制体
    destroyAllBlocks() {
        for (const node of this.blockNodes) {
            if (node.isValid) node.destroy();
        }
    }

    // 键盘事件监听
    onKeyPress(event: any) {
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:  // 左方向键
                this.moveBlock(-1, 0);
                break;
            case KeyCode.ARROW_RIGHT: // 右方向键
                this.moveBlock(1, 0);
                break;
            case KeyCode.ARROW_DOWN:  // 下方向键
                this.moveBlock(0, 1);
                break;
            case KeyCode.ARROW_UP:    // 上方向键 = 旋转
                this.rotateBlock();
                break;
        }
    }

    onDestroy() {
        // 移除监听，防止内存泄漏
        input.off(Input.EventType.KEY_DOWN, this.onKeyPress, this);
    }
}