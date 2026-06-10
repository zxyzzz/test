import { _decorator, Button, Component, director, Node } from 'cc';
import { NodeHelper } from './NodeHelper';
const { ccclass, property } = _decorator;

@ccclass('Boot')
export class Boot extends Component {
    start() {
        const btn = NodeHelper.createButton('StartButton', '开始', this.node, this.onButtonClick.bind(this));
        NodeHelper.setPos(btn.node, 0, 0);
    }

    private onButtonClick() {
        console.log('Button clicked!');
        // 在这个里跳转到main场景
        director.loadScene('main');
        // 跳转完成后，销毁当前场景
        director.getScene().destroy();
    }


    update(deltaTime: number) {
        
    }
}


