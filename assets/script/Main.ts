import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        console.log('Main scene loaded!');
    }

    update(deltaTime: number) {
        
    }
}


