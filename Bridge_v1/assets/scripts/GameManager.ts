import {
    CCBoolean,
    CCString,
    Component,
    director,
    math,
    PhysicsSystem,
    PhysicsSystem2D,
    systemEvent,
    Vec2,
    Vec3,
    View,
    _decorator,
} from 'cc';

import Events from './Enums/Events';
import Settings from './Plugins/Settings';
import InputManager from './Plugins/Input/InputManager';
import InputTypes from './Plugins/Input/InputTypes';
import {InputManagerData} from './Plugins/Input/InputManagerData';
import InputSources from './Plugins/Input/InputSources';
import {AudioManager2} from './Audio/AudioManager';

const {ccclass, property} = _decorator;

@ccclass
export default class GameManager extends Component {
    public static playableName: string = '';
    public static androidUrl: string = '';
    public static iosUrl: string = '';
    public static isShortVersion: boolean = false;
    //#region editor properties

    @property(CCString) playableName: string =
        'playable-name-playable/endcard-version0-en';
    @property(CCString) androidUrl: string =
        'https://www.google.com/search?q=android';
    @property(CCString) iosUrl: string = 'https://www.google.com/search?q=ios';
    @property(CCBoolean) isShortVersion: boolean = false;

    @property(CCBoolean) isRedirectOnResultTap: boolean = true;
    @property({
        visible: function (this) {
            return this.isRedirectOnResultTap;
        },
    })
        isRestartOnResultTap: boolean = false;
    @property(CCBoolean) isRedirectByTaps: boolean = false;
    @property({
        visible: function (this) {
            return this.isRedirectByTaps;
        },
    })
        tapsToRedirect: number = 3;
    @property({
        visible: function (this) {
            return this.isRedirectByTaps;
        },
    })
        isNeedToRefreshTapsAfterRedirect: boolean = true;
    @property({
        visible: function (this) {
            return this.isRedirectByTaps;
        },
    })
        isResultAfterTapRedirect: boolean = false;

    //#endregion

    //#region private properties

    private isRedirectOnResult: boolean = true;

    private settings: Settings = new Settings();

    private isTjApiCalled: boolean = false;

    private isResult: boolean = false;

    private tapsCount: number = 0;

    //#endregion

    //#region lifecycle callbacks

    onLoad(): void {
        GameManager.playableName = this.playableName;
        GameManager.androidUrl = this.androidUrl;
        GameManager.iosUrl = this.iosUrl;
        GameManager.isShortVersion = this.isShortVersion;

        const local = this.playableName.substring(this.playableName.length - 2);

        this.subscribeEvents();
        // this.enablePhysics3d(math.v3(0, -10, 0), false);
        // this.enablePhysics();
        InputManager.getInstance();
    }

    start(): void {
        console.log(GameManager.playableName);

        this.windowResized();
        systemEvent.emit(Events.PLAYABLE_START.toString());
    }

    update(dt: number) {
        systemEvent.emit(Events.UPDATE_TICK.toString(), dt);
    }

    //#endregion

    //#region private methods

    private enablePhysics3d(
        gravity: Vec3 = math.v3(0, -10, 0),
        enableDebug: boolean = false
    ): void {
        const physicsManager = PhysicsSystem.instance;
        physicsManager.gravity = gravity;

        // if (enableDebug) {
        //     //@ts-ignore
        //     physicsManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;
        // }
    }

    private enablePhysics(
        gravity: Vec2 = math.v2(0, -320),
        enableDebug: boolean = false
    ): void {
        const physicsManager = PhysicsSystem2D.instance;
        physicsManager.gravity = gravity;

        // if (enableDebug) {
        //     //@ts-ignore
        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;
        // }
    }

    private setRedirectUrl(): void {
        //@ts-ignore
        window.ANDROID_URL = this.androidUrl;
        //@ts-ignore
        window.IOS_URL = this.iosUrl;
        //@ts-ignore
        window.REDIRECT_URL = Preferences.REDIRECT_URL = /android/i.test(
            navigator.userAgent
        )
            ? this.androidUrl
            : this.iosUrl;
    }

    private subscribeEvents(): void {
        View.instance.on('design-resolution-changed', this.windowResized, this);

        InputManager.getInstance().on(InputTypes.Down, this.onDown, this);

        systemEvent.on(
            Events.REDIRECT.toString() as any,
            this.onRedirect as any,
            this
        );
        systemEvent.on(
            Events.RESULT.toString() as any,
            this.onResult as any,
            this
        );
    }

    private windowResized(): void {
        this.settings.updateSettings();
        systemEvent.emit(Events.WINDOW_RESIZED.toString(), this.settings);
    }

    //#endregion

    //#region event handlers

    private onResult(isWin: boolean): void {
        this.isResult = true;
        this.isRestartOnResultTap = !isWin;

        systemEvent.emit(Events.RESULT_SHOW.toString());
    }

    private onDown(data: InputManagerData): void {
        if (this.tapsCount == 0) {
            AudioManager2.getInstance().playSound(0);
        }
        this.tapsCount += 1;

        if (data.touchSource === InputSources.RedirectButton) {
            if (this.isResult) {
                systemEvent.emit(Events.REDIRECT.toString(), 'result');
            } else {
                systemEvent.emit(Events.REDIRECT.toString(), 'ingame_button');
            }
        } else if (this.isRedirectOnResult) {
            if (this.isResult) {
                if (this.isRedirectOnResultTap) {
                    systemEvent.emit(Events.REDIRECT.toString(), 'result');

                    if (this.isRestartOnResultTap) {
                        this.isResult = false;

                        systemEvent.emit(Events.RESTART.toString());
                    }
                }
            } else if (
                this.isRedirectByTaps &&
                this.tapsCount >= this.tapsToRedirect
            ) {
                if (this.isNeedToRefreshTapsAfterRedirect) {
                    this.tapsCount = 0;
                }

                if (this.isResultAfterTapRedirect) {
                    systemEvent.emit(Events.RESULT.toString());
                }

                systemEvent.emit(Events.REDIRECT.toString(), 'ingame_button');
            }
        }
    }

    private onRedirect(source: string): void {
        director.pause();

        try {
            // @ts-ignore
            redirect();
        } catch (err) {
            console.log('SDK was not found');

            const redirectUrl =  /android/i.test(
                navigator.userAgent
            )
                ? this.androidUrl
                : this.iosUrl;

            window.open(redirectUrl);
        }

        director.resume();
    }

    //#endregion
}
