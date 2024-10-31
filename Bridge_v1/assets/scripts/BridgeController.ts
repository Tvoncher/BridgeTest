import {_decorator, CCFloat, Component, Node, RigidBody} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('BridgeController')
export class BridgeController extends Component {
    @property(CCFloat) destroyingSpeed: number = 19;

    @property(Node) frontAxel: Node = null;

    private bricksArr: Node[] = [];

    private firstBrick: Node = null;

    private hasStarted: boolean = false;

    protected onLoad(): void {
        this.node.children.forEach((woodenBrick)=>{
            this.bricksArr.push(woodenBrick);
        });

        this.firstBrick = this.bricksArr[0];
    }

    private startDestroying(){
        this.hasStarted = true;

        for (let i = 0; i < this.bricksArr.length; i++) {
            const brick = this.bricksArr[i];

            this.scheduleOnce(()=>{
                brick.addComponent(RigidBody);
            }, i / this.destroyingSpeed);
        }
    }

    protected update(): void {
        if (this.hasStarted) return;

        if (this.frontAxel.worldPosition.x > this.firstBrick.worldPosition.x) {
            this.startDestroying();
        }
    }
}

