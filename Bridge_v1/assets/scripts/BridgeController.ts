import {_decorator, CCFloat, Component, Node, PlaneCollider, RigidBody} from 'cc';

const {ccclass, property} = _decorator;

/*
    only for bridge destroying
*/

@ccclass('BridgeController')
export class BridgeController extends Component {
    @property(Node) woodenBridge: Node = null;
    @property(Node) frontAxel: Node = null;

    @property(CCFloat) destroyingSpeed: number = 19;

    @property(PlaneCollider) startCollider: PlaneCollider = null;
    @property(PlaneCollider) failCollider: PlaneCollider = null;

    private bricksArr: Node[] = [];

    private hasStarted: boolean = false;

    protected onLoad(): void {
        this.woodenBridge.children.forEach((woodenBrick)=>{
            this.bricksArr.push(woodenBrick);
        });

        this.startCollider.on('onTriggerEnter', this.onStartTriggerEnter, this);
        this.failCollider.on('onTriggerEnter', this.onFailTriggerEnter, this);
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

    private onStartTriggerEnter() {
        if (this.hasStarted) return;
        
        this.startDestroying();

        this.startCollider.off('onTriggerEnter', this.onStartTriggerEnter, this);
    }

    private onFailTriggerEnter(){
        const lastNBricks = 6;

        for (let i =  this.bricksArr.length - lastNBricks; i < this.bricksArr.length; i++) {
            const brick = this.bricksArr[i];
        
            this.scheduleOnce(()=>{
                brick.addComponent(RigidBody);
            },i/10)
        }
    }
}