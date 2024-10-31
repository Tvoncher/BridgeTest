import {_decorator, BoxCollider, Component, ITriggerEvent, tween, v3} from 'cc';
import {Score} from './Score';

const {ccclass, property} = _decorator;

@ccclass('CoinCollector')
export class CoinCollector extends Component {
    @property(BoxCollider) carCollider: BoxCollider = null;

    private score: Score = null;

    protected onLoad(): void {
        this.carCollider.on('onTriggerEnter', this.onTriggerEnter, this);

        this.score = Score.getInstance();
    }

    private onTriggerEnter(event: ITriggerEvent){
        const coin = event.otherCollider.node;
        
        tween(coin)
            .to(0.5,{position:coin.position.clone().add(v3(3,3.5,0))},{easing:'cubicOut'})
            .call(()=>{
                tween(coin)
                    .to(0.3,{scale:v3()},{easing:'bounceOut'})
                    .call(()=>{
                        coin.destroy();
                        this.score.add();
                    })
                    .start();
            })
            .start();
    }
}

