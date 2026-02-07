
export class SoundPoolSFX {
    private static readonly audioPlayers: (HTMLAudioElement | null)[] = [];

    private static maxStreamsCount = 0;

    static async initialize(maxStreams: number) {
        this.maxStreamsCount = maxStreams;
    }

    static async loadFile(path: string): Promise<number> {
        return new Promise((resolve, reject) => {
            if (this.audioPlayers.length >= this.maxStreamsCount) {
                reject(`Sound was initialized with maximum of ${this.maxStreamsCount} streams`);

                return;
            }

            const audio = new Audio(path);
            const loadingDoneCallback = () => {
                // event "canplaythrough" can be fired multiple times for same audio file
                audio.removeEventListener('canplaythrough', loadingDoneCallback);

                // use non-zero as id
                resolve(this.audioPlayers.push(audio));
            };

            audio.addEventListener('canplaythrough', loadingDoneCallback);
        });
    }

    static async loadResource(name: string) {
        return this.loadFile(name);
    }

    static play(id: number, volume = 1) {
        const player = this.audioPlayers[id - 1];

        if (!player) {
            return;
        }

        player.volume = volume;
        player.currentTime = 0;
        player.play();
    }

    static unload(id: number) {
        if (!this.audioPlayers[id - 1]) {
            return;
        }

        // dont remove array element as indexes will shift for other ids
        this.audioPlayers[id - 1] = null;
    }

    static release() {
        this.audioPlayers.splice(0);
        this.maxStreamsCount = 0;
    }
}
