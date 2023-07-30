import { map } from "./utils/math/index.js";
import { frequencyToIndex } from "./utils/sound/index.js";

let interval;

class Audio {
  constructor(file, refreshRate = 10) {
    this.file = file;
    this.ready = false;
    this.refreshRate = refreshRate;
    this.frequencyData;
    this.audio;
    this.audioContext;
    this.analyser;
    this.source;
  }

  start() {
    if (!this.audioContext) {
      this.createAudio();
      this.createSource();
      interval = setInterval(() => {
        this.analyser.getFloatFrequencyData(this.frequencyData);
      }, (1 / this.refreshRate) * 1000);
      this.ready = true;
    }
  }

  createAudio() {
    this.audioContext = new AudioContext();
    this.audio = document.createElement("audio");
    this.audio.src = this.file;
    this.audio.crossOrigin = "Anonymous";
    this.audio.loop = true;
    this.audio.play();
  }

  createSource() {
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048 * 2;
    this.analyser.minDecibels = -100;
    this.analyser.maxDecibels = -10;
    this.frequencyData = new Float32Array(this.analyser.fftSize);
    this.source.connect(this.analyser);
    this.source.connect(this.audioContext.destination);
  }

  addAudioSignal(minHz, maxHz) {
    if (!this.analyser) return 0;
    const sampleRate = this.analyser.context.sampleRate;
    const binCount = this.analyser.frequencyBinCount;
    let start = frequencyToIndex(minHz, sampleRate, binCount);
    const end = frequencyToIndex(maxHz, sampleRate, binCount);
    const count = end - start;
    let sum = 0;
    for (; start < end; start++) {
      sum += this.frequencyData[start];
    }

    const minDb = this.analyser.minDecibels;
    const maxDb = this.analyser.maxDecibels;
    const valueDb = count === 0 || !isFinite(sum) ? minDb : sum / count;
    return map(valueDb, minDb, maxDb, 0, 1, true);
  }
}

export { Audio };
