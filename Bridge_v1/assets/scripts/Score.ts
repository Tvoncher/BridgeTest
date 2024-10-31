import {_decorator, Component, Label} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('Score')
export class Score extends Component {
    @property(Label) counter: Label = null;

    private static instance: Score = null;

    private currentCoins: number = 0;

    protected onLoad(): void {
        if (Score.instance !== null) {
            return;
        }

        Score.instance = this;
    }

    public static getInstance(): Score {
        return this.instance;
    }

    public add(){
        this.currentCoins += 1;
        this.counter.string = this.currentCoins.toString();
    }
}
