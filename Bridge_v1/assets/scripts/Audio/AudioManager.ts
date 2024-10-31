import {
    _decorator,
    AudioClip,
    AudioSource,
    CCBoolean,
    CCFloat,
    Component,
} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('SoundOptions')
export class SoundOptions {
    @property(CCFloat) volume: number = 1;
    @property(CCBoolean) isLoop: boolean = false;
}

@ccclass('SoundConfig')
export class SoundConfig {
    @property(AudioClip) clip: AudioClip = null;
    @property(SoundOptions) options: SoundOptions = new SoundOptions();
}

@ccclass('AudioManager2')
export class AudioManager2 extends Component {
    private static instance: AudioManager2 = null;
    public isMuted: boolean = true;

    @property(SoundConfig) sounds: SoundConfig[] = [];

    private audioSources: AudioSource[] = [];
    private isMuteWeb: boolean = true;
    private isMuteGameButton: boolean = true;

    protected onLoad(): void {
        if (AudioManager2.instance !== null) {
            return;
        }

        AudioManager2.instance = this;

        window.setAudioManagerVolume = (volume: number) => {
            this.isMuteWeb = volume ? true : false;
            this.updateVolume();
        };
    }

    start() {
        for (let index = 0; index < this.sounds.length; index++) {
            const audiosurce = this.node.addComponent(AudioSource);
            audiosurce.clip = this.sounds[index].clip;
            audiosurce.loop = this.sounds[index].options.isLoop;
            audiosurce.volume = this.sounds[index].options.volume;
            this.audioSources.push(audiosurce);
            audiosurce.stop();
        }

        if (this.isMuted) {
            this.muteAll();
        }
    }

    updateVolume() {
        if (this.isMuteWeb || this.isMuteGameButton) {
            this.muteAll();
        } else {
            this.unMuteAll();
        }
    }

    playSound(index: number) {
        if (this.audioSources?.[index]) {
            this.audioSources[index].play();
        }
    }

    getActiveClips(): AudioSource[] {
        const activeAudioSource = [];
        for (let i = 0; i < this.audioSources.length; i++) {
            if (this.audioSources[i].playing) {
                // log(this.audioSources[i].playing);
                activeAudioSource.push(this.audioSources[i]);
            }
        }

        return activeAudioSource;
    }

    muteAll() {
        for (let index = 0; index < this.audioSources.length; index++) {
            this.audioSources[index].volume = 0;
        }
    }

    muteAllActive() {
        const activeClips = this.getActiveClips();
        for (let index = 0; index < activeClips.length; index++) {
            activeClips[index].volume = 0;
        }
    }

    unMuteAllActive() {
        const activeClips = this.getActiveClips();
        for (let index = 0; index < activeClips.length; index++) {
            activeClips[index].volume = 1;
        }
    }

    unMuteAll() {
        for (let index = 0; index < this.audioSources.length; index++) {
            if (index === 0) {
                this.audioSources[index].volume = 0.7;
            } else this.audioSources[index].volume = 1;
        }
    }

    public static getInstance(): AudioManager2 {
        return this.instance;
    }
    // mutePhysicButton(){

    // }
}
