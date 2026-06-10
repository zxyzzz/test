import {
    Node, Component, UITransform, Label, Button, Sprite, Color, Widget, Layout,
 SpriteFrame, Animation, RigidBody2D, BoxCollider2D, PolygonCollider2D,
    Camera, MeshRenderer, DirectionalLight, PointLight, SphereCollider, CapsuleCollider,
    RigidBody, Tween, tween, Vec3, Vec2, Size, ParticleSystem2D, EditBox, ScrollView
} from "cc";

/**
 * 全场景节点工具类
 * 覆盖：通用节点 / UI / 2D 精灵 / 3D 对象 / 物理 / 动画 / 布局
 */
export class NodeHelper {
    //#region 基础通用方法（所有节点通用）
    /** 创建空节点 */
    static createNode(name: string, parent?: Node): Node {
        const node = new Node(name);
        if (parent) node.parent = parent;
        return node;
    }

    /** 泛型添加组件（自动推断类型） */
    static addComp<T extends Component>(node: Node, comp: new () => T): T {
        return node.addComponent(comp);
    }

    /** 设置坐标 */
    static setPos(node: Node, x: number, y: number, z = 0): void {
        node.setPosition(x, y, z);
    }

    /** 设置缩放 */
    static setScale(node: Node, x: number, y: number, z = 1): void {
        node.setScale(x, y, z);
    }

    /** 设置旋转（欧拉角） */
    static setRotation(node: Node, x: number, y: number, z = 0): void {
        node.eulerAngles = new Vec3(x, y, z);
    }
    //#endregion

    //#region UI 通用基础（UITransform 尺寸、对齐）
    /** 给节点添加 UITransform 并设置尺寸 */
    static setUISize(node: Node, width: number, height: number): UITransform {
        const trans = this.addComp(node, UITransform);
        trans.setContentSize(width, height);
        return trans;
    }

    /** 节点整体居中（屏幕/父节点居中） */
    static setCenterAlign(node: Node): Widget {
        const widget = this.addComp(node, Widget);
        widget.isAlignHorizontalCenter = true;
        widget.isAlignVerticalCenter = true;
        widget.updateAlignment();
        return widget;
    }
    //#endregion

    //#region UI 控件
    /** 创建文本 Label */
    static createLabel(
        name: string,
        text: string,
        parent?: Node,
        fontSize = 24,
        fontColor = Color.WHITE
    ): Label {
        const node = this.createNode(name, parent);
        this.setUISize(node, 200, 60);
        const label = this.addComp(node, Label);
        label.string = text;
        label.fontSize = fontSize;
        label.color = fontColor;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        return label;
    }

    /** 创建图片精灵（UI 层 Sprite） */
    static createUISprite(
        name: string,
        parent?: Node,
        frame?: SpriteFrame,
        width = 100,
        height = 100
    ): Sprite {
        const node = this.createNode(name, parent);
        this.setUISize(node, width, height);
        const sprite = this.addComp(node, Sprite);
        if (frame) sprite.spriteFrame = frame;
        return sprite;
    }

    /** 创建按钮 Button */
    static createButton(
        name: string,
        text: string,
        parent?: Node,
        onClick?: () => void,
        width = 200,
        height = 80
    ): Button {
        const node = this.createNode(name, parent);
        this.setUISize(node, width, height);

        // 按钮背景
        const sprite = this.addComp(node, Sprite);
        sprite.color = new Color(40, 120, 240);

        // 按钮交互
        const btn = this.addComp(node, Button);
        if (onClick) {
            btn.node.on(Button.EventType.CLICK, onClick, node);
        }

        // 按钮文字
        this.createLabel("BtnLabel", text, node, 26);
        return btn;
    }

    /** 创建输入框 EditBox */
    static createEditBox(
        name: string,
        parent?: Node,
        placeholder = "请输入内容",
        width = 300,
        height = 60
    ): EditBox {
        const node = this.createNode(name, parent);
        this.setUISize(node, width, height);
        const edit = this.addComp(node, EditBox);
        edit.placeholder = placeholder;
        return edit;
    }

    /** 垂直布局容器 */
    static createVLayout(name: string, parent?: Node): Layout {
        const node = this.createNode(name, parent);
        this.setUISize(node, 400, 600);
        const layout = this.addComp(node, Layout);
        layout.type = Layout.Type.VERTICAL;
        layout.spacingY = 10;
        return layout;
    }

    /** 水平布局容器 */
    static createHLayout(name: string, parent?: Node): Layout {
        const node = this.createNode(name, parent);
        this.setUISize(node, 400, 100);
        const layout = this.addComp(node, Layout);
        layout.type = Layout.Type.HORIZONTAL;
        layout.spacingX = 10;
        return layout;
    }
    //#endregion

    // //#region 2D 场景节点（非UI）
    // /** 创建2D精灵 Sprite2D */
    // static createSprite2D(
    //     name: string,
    //     parent?: Node,
    //     frame?: SpriteFrame
    // ): Sprite2D {
    //     const node = this.createNode(name, parent);
    //     const sprite = this.addComp(node, Sprite2D);
    //     if (frame) sprite.spriteFrame = frame;
    //     return sprite;
    // }

    /** 给节点添加2D刚体 */
    static addRigidBody2D(node: Node): RigidBody2D {
        return this.addComp(node, RigidBody2D);
    }

    /** 给节点添加矩形2D碰撞体 */
    static addBoxCollider2D(node: Node): BoxCollider2D {
        return this.addComp(node, BoxCollider2D);
    }

    /** 创建2D粒子 */
    static createParticle2D(name: string, parent?: Node): ParticleSystem2D {
        const node = this.createNode(name, parent);
        return this.addComp(node, ParticleSystem2D);
    }
    //#endregion

    //#region 3D 场景节点
    /** 创建3D模型节点（自带网格渲染） */
    static create3DModel(name: string, parent?: Node): MeshRenderer {
        const node = this.createNode(name, parent);
        return this.addComp(node, MeshRenderer);
    }

    /** 创建3D相机 */
    static createCamera(name: string, parent?: Node): Camera {
        const node = this.createNode(name, parent);
        return this.addComp(node, Camera);
    }

    /** 创建平行光 */
    static createDirLight(name: string, parent?: Node): DirectionalLight {
        const node = this.createNode(name, parent);
        return this.addComp(node, DirectionalLight);
    }

    /** 添加3D刚体 */
    static addRigidBody3D(node: Node): RigidBody {
        return this.addComp(node, RigidBody);
    }

    /** 添加球体碰撞体3D */
    static addSphereCollider(node: Node): SphereCollider {
        return this.addComp(node, SphereCollider);
    }
    //#endregion

    //#region 通用动画/缓动
    /** 节点添加动画组件 */
    static addAnimation(node: Node): Animation {
        return this.addComp(node, Animation);
    }

    /** 简易位移动画 */
    static moveTween(node: Node, targetPos: Vec3, duration = 1): Tween<Node> {
        return tween(node).to(duration, { position: targetPos }).start();
    }
    //#endregion
}