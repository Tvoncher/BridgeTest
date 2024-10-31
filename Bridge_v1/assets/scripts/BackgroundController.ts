import { _decorator, Component, Node, Settings, systemEvent, v3, Vec3 } from 'cc';
import Events from './Enums/Events';
const { ccclass, property } = _decorator;

@ccclass('BackgroundController')
export class BackgroundController extends Component {
    @property(Node) background: Node = null;

    @property(Vec3) landscapeScale : Vec3 = v3();
    @property(Vec3) landscapePosition : Vec3 = v3();

    @property(Vec3) portraitScale : Vec3 = v3();
    @property(Vec3) portraitPosition : Vec3 = v3();

    protected onLoad(): void {
        systemEvent.on(Events.WINDOW_RESIZED,this.onWindowResized,this);
    }

    private onWindowResized(settings: Settings): void {
        if (settings.IS_LANDSCAPE){
            this.background.setScale(this.landscapeScale);
            this.background.setPosition(this.landscapePosition)
        } else {
            this.background.setScale(this.portraitScale);
            this.background.setPosition(this.portraitPosition)
        }
    }
}

