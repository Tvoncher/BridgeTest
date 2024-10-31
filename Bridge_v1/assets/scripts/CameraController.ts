import {_decorator, Camera, CCFloat, Component, log, Node, Settings, systemEvent, v3, Vec3} from 'cc';
import Events from './Enums/Events';

const {ccclass, property} = _decorator;

/*
    smoother movement and adjusting camera.fov to aspect ratio
*/

@ccclass('CameraController')
export class CameraController extends Component {
    @property(CCFloat) landscapeFov: number = 50;
    @property(CCFloat) portraitFov: number = 50;

    @property(CCFloat) smoothSpeed: number = 0.05;
    @property(Node) car: Node = null;

    private camera: Camera = null;
    private offset: Vec3 = v3(0);

    protected onLoad(): void {
        this.camera = this.node.getComponent(Camera);
        this.offset = this.offset = this.node.position.clone().subtract(this.car.position);

        systemEvent.on(Events.FAIL,this.onFail,this);
        systemEvent.on(Events.WINDOW_RESIZED,this.onWindowResized,this);
    }

    protected lateUpdate(): void {
        const targetPosition = this.car.position.clone().add(this.offset);
        const smoothedPosition = v3();
        Vec3.lerp(smoothedPosition,this.node.position,targetPosition,this.smoothSpeed);
        this.node.position = smoothedPosition;
    }

    private onFail(){
        const delay = 1;
        
        this.scheduleOnce(()=>{
            this.destroy();
        },delay);
    }

    private onWindowResized(settings: Settings): void {
        if (settings.IS_LANDSCAPE){
            this.camera.fov = this.landscapeFov;
        } else {
            this.camera.fov = this.portraitFov;
        }
    }
}
