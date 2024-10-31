import {_decorator, CCFloat, Component, Node, systemEvent, tween, UIOpacity, v3, Vec3} from 'cc';
import Events from './Enums/Events';

const {ccclass, property} = _decorator;

@ccclass('Result')
export class Result extends Component {
    @property(Node) shadow: Node = null;
    @property(Node) cross: Node = null;
    @property(Node) retryButton: Node = null;

    @property(CCFloat) shadowMaxOpacity: number = 180;
    @property(CCFloat) shadowRevealDuration: number = 0.4;
    @property(CCFloat) packshotRevealDuration: number = 0.3;
    

    protected onLoad(): void {
        systemEvent.on(Events.FAIL,this.onFail,this);
        this.shadow.active = false;
        this.cross.active = false;
        this.retryButton.active = false;
    }

    private onFail(){
        systemEvent.emit(Events.RESULT);

        this.shadow.active = true;
        this.cross.active = true;
        this.retryButton.active = true;

        this.cross.scale = v3();
        this.retryButton.scale = v3();

        tween(this.shadow.getComponent(UIOpacity))
            .to(this.shadowRevealDuration,{opacity:this.shadowMaxOpacity})
            .start();

        tween(this.cross).to(this.packshotRevealDuration,{scale:Vec3.ONE}).start();

        const newRotation = v3(this.retryButton.eulerAngles.x,this.retryButton.eulerAngles.y,this.retryButton.eulerAngles.z + 360);
        tween(this.retryButton)
            .to(this.packshotRevealDuration,{scale:Vec3.ONE , eulerAngles: newRotation})
            .start();
        tween(this.retryButton.getComponent(UIOpacity))
            .to(this.packshotRevealDuration,{opacity:255})
            .start();
    }
}
