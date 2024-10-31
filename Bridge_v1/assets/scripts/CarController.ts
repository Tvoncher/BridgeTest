import {_decorator, Component, Slider, v3, RigidBody, CCFloat, BoxCollider, Node, systemEvent} from 'cc';
import Events from './Enums/Events';

const {ccclass, property} = _decorator;

/*
    car controls and movement
*/

@ccclass('CarController')
export class CarController extends Component {
    @property(Slider) controlLeverSlider: Slider = null;
    @property(CCFloat) maxSpeed: number = 50;
    @property(CCFloat) dyingDepth: number = -5;
    
    @property(RigidBody) rb:RigidBody = null;

    @property([Node]) nodesToSplit: Node[] = [];

    private controlLeverValue:number = 0;

    private initialPosY: number = 0;
    private isGrounded:boolean = false;
    private isDead:boolean = false;
    
    protected onLoad(): void {
        this.controlLeverSlider.node.on('slide', this.onSlide, this);

        this.initialPosY = this.node.position.y;
    }

    protected update(): void {
        if (this.isDead) return;

        this.checkIsGrounded();
        this.checkFailConditions();
    }

    private onSlide() {
        if (this.isDead) return;

        const newValue = this.controlLeverSlider.progress;

        if (this.controlLeverValue !== newValue) {
            this.controlLeverValue = newValue;
            
            this.setSpeed();
        }
    }

    private setSpeed() {
        if (!this.isGrounded) return;

        const speed = this.controlLeverValue * this.maxSpeed;
        this.rb.setLinearVelocity((v3(speed, 0, 0)));
    }

    private destroyCar(){
        this.rb.node.getComponent(BoxCollider).enabled = false;
        
        this.nodesToSplit.forEach((node)=>{
            node.addComponent(RigidBody);
            node.addComponent(BoxCollider);
        });
    }

    private checkFailConditions(){
        if (this.node.position.y < this.dyingDepth) {
            this.isDead = true;
            this.destroyCar();
            systemEvent.emit(Events.FAIL);
        }
    }

    private checkIsGrounded(){
        const maxHeightOffset = 0.5;
        this.isGrounded = this.node.position.y < this.initialPosY + maxHeightOffset && this.node.position.y > this.initialPosY - maxHeightOffset;
    }
}
