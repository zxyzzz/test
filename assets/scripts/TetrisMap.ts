import { _decorator, Component, TiledMap, TiledLayer, Vec2, Node } from 'cc';
const { ccclass, property } = _decorator;

// 瓦片常量，和Tiled里一一对应
const TILE_EMPTY = 0;    // 空格子
const TILE_FIXED = 1;    // 已落地的固定方块

@ccclass('TetrisMap')
export class TetrisMap extends Component {
    // 绑定动态方块父节点
    @property(Node)
    blockRoot: Node = null!;

    private _map: TiledMap = null!;
    private _layer: TiledLayer = null!;
    public readonly MAP_WIDTH = 10;
    public readonly MAP_HEIGHT = 20;
    public tileSize: number = 32;

    onLoad() {
        // 获取TiledMap组件
        this._map = this.getComponent(TiledMap)!;
                        console.log("_map", this._map);

        // 获取地图图层 【名称必须和Tiled里一致：gridLayer】
        this._layer = this._map.getLayer("gridLayer")!;
                console.log("_layer", this._layer);

        if (!this._layer) {
            console.error("错误：找不到图层 gridLayer，请检查Tiled图层名称！");
            return;
        }
        // 获取单格瓦片尺寸
        this.tileSize = this._map.getTileSize().width;

        console.log("tileSize", this.tileSize);
    }

    // 格子坐标 → 引擎世界坐标（解决Tiled与Cocos Y轴反向问题）
    grid2World(gx: number, gy: number): Vec2 {
        const half = this.tileSize / 2;
        const x = gx * this.tileSize + half;
        const y = -(gy * this.tileSize + half);
        return new Vec2(x, y);
    }

    // 获取指定格子的瓦片ID
    getTileID(gx: number, gy: number): number {
        if (gx < 0 || gx >= this.MAP_WIDTH) return TILE_FIXED;
        if (gy < 0 || gy >= this.MAP_HEIGHT) return TILE_FIXED;
        return this._layer.getTileGIDAt(gx, gy);
    }

    // 设置指定格子瓦片（落地时标记为固定方块）
    setTileID(gx: number, gy: number, gid: number) {
        if (gx < 0 || gx >= this.MAP_WIDTH) return;
        if (gy < 0 || gy >= this.MAP_HEIGHT) return;
        this._layer.setTileGIDAt(gid, gx, gy);
    }

    // 碰撞检测：判断方块是否撞墙/撞已落地方块
    isCollision(points: Vec2[], offsetX: number, offsetY: number): boolean {
        for (const p of points) {
            const x = p.x + offsetX;
            const y = p.y + offsetY;
            // 左右边界、底部边界判定
            if (x < 0 || x >= this.MAP_WIDTH || y >= this.MAP_HEIGHT) {
                return true;
            }
            // 顶部超出屏幕不判定碰撞
            if (y < 0) continue;
            // 该位置已有固定方块
            if (this.getTileID(x, y) === TILE_FIXED) {
                return true;
            }
        }
        return false;
    }

    // 消行逻辑：从下往上检测满行并消除
    clearFullLines() {
        for (let y = this.MAP_HEIGHT - 1; y >= 0; y--) {
            let isFull = true;
            // 判断当前行是否填满
            for (let x = 0; x < this.MAP_WIDTH; x++) {
                if (this.getTileID(x, y) !== TILE_FIXED) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) {
                // 清空当前满行
                for (let x = 0; x < this.MAP_WIDTH; x++) {
                    this.setTileID(x, y, TILE_EMPTY);
                }
                // 上方所有行整体向下移动一格
                for (let moveY = y - 1; moveY >= 0; moveY--) {
                    for (let x = 0; x < this.MAP_WIDTH; x++) {
                        const id = this.getTileID(x, moveY);
                        this.setTileID(x, moveY + 1, id);
                        this.setTileID(x, moveY, TILE_EMPTY);
                    }
                }
                y++; // 重新检测下落之后的行
            }
        }
    }
}
