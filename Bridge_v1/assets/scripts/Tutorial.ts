import {_decorator, CCFloat, Component, Node, systemEvent, Tween, tween, UIOpacity} from 'cc';
import Events from './Enums/Events';

const {ccclass, property} = _decorator;

/*
    pls don't look here
*/

@ccclass('Tutorial')
export class Tutorial extends Component {
    @property(Node) hand: Node = null;
    @property(Node) controlLeverHandle: Node = null;
    @property(Node) highestPos: Node = null;
    @property(Node) lowestPos: Node = null;
    @property(CCFloat) timeToReveal: number = 3;
    @property(Node) slider: Node = null;

    private timer:number = 0;

    private handOpacity: UIOpacity = null;

    private isShowing: boolean = false;
    private isTouching: boolean = false;

    protected onLoad(): void {
        systemEvent.on(Events.FAIL,this.onFail,this);

        this.handOpacity = this.hand.getComponent(UIOpacity);

        this.slider.on('slide', this.onSlide, this);
    }

    protected update(dt: number): void {
        if (this.isTouching) return;

        this.timer += dt;

        if (this.timer >= this.timeToReveal) {
            this.show();
        }
    }

    private onSlide() {
        this.isTouching = true;
        this.hide();
    }

    private onFail(){
        this.hand.active =false;
        this.enabled = false;
    }

    private show(){
        if (this.isShowing) return;

        this.isShowing = true;

        //TODO: animations
        tween(this.handOpacity).to(0.2,{opacity:255})
            .call(()=>{
                tween(this.controlLeverHandle).to(0.4,{position:this.highestPos.position})
                    .call(()=>{
                        tween(this.controlLeverHandle).to(0.4,{position:this.lowestPos.position})
                            .call(()=>{
                                tween(this.handOpacity).to(0.3,{opacity:0})
                                    .call(()=>this.hide())
                                    .start();
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

    private hide(){
        this.isShowing = false;
        this.timer = 0;

        Tween.stopAllByTarget(this.handOpacity);
        Tween.stopAllByTarget(this.controlLeverHandle);

        this.handOpacity.opacity = 0;
    }
}


