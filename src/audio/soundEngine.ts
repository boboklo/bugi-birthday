/**
 * Web Audio API Sound Engine
 * Provides synthesized musical tunes, sound effects, audio visualizer,
 * and reliable speech/subtitles fallback for Persian text.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private currentSongTimer: number | null = null;
  private activeSongStop: (() => void) | null = null;

  constructor() {
    try {
      const stored = localStorage.getItem('gift_sfx_muted');
      if (stored === 'true') this.isMuted = true;
    } catch {
      // ignore
    }
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.85;

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.isMuted ? 0 : 0.65;
        this.sfxGain.connect(this.ctx.destination);

        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('gift_sfx_muted', String(this.isMuted));
    } catch {}

    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
    }
    if (this.isMuted) {
      this.stopSong();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playSfx(name: 'pop' | 'boing' | 'ding' | 'sad' | 'tada' | 'whoosh' | 'blow') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime + 0.01;

    switch (name) {
      case 'pop': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(760, t);
        osc.frequency.exponentialRampToValueAtTime(260, t + 0.09);

        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.5, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      }
      case 'boing': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(560, t + 0.14);
        osc.frequency.exponentialRampToValueAtTime(240, t + 0.32);

        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.45, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.36);
        break;
      }
      case 'ding': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1320, t + 0.08);

        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.4, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.5);
        break;
      }
      case 'sad': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392, t);
        osc.frequency.exponentialRampToValueAtTime(260, t + 0.38);

        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.4, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.42);
        break;
      }
      case 'tada': {
        const chord = [523.25, 659.25, 783.99, 1046.5];
        chord.forEach((freq, i) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          const noteTime = t + i * 0.07;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);

          g.gain.setValueAtTime(0.001, noteTime);
          g.gain.linearRampToValueAtTime(0.28, noteTime + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

          osc.connect(g);
          g.connect(this.sfxGain);
          osc.start(noteTime);
          osc.stop(noteTime + 0.65);
        });
        break;
      }
      case 'whoosh': {
        try {
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
          const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = this.ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.Q.value = 1.2;
          filter.frequency.setValueAtTime(400, t);
          filter.frequency.exponentialRampToValueAtTime(2800, t + 0.22);

          const g = this.ctx.createGain();
          g.gain.setValueAtTime(0.001, t);
          g.gain.linearRampToValueAtTime(0.25, t + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

          whiteNoise.connect(filter);
          filter.connect(g);
          g.connect(this.sfxGain);
          whiteNoise.start(t);
          whiteNoise.stop(t + 0.26);
        } catch {}
        break;
      }
      case 'blow': {
        try {
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
          const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
          }
          const whiteNoise = this.ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, t);
          filter.frequency.exponentialRampToValueAtTime(150, t + 0.3);

          const g = this.ctx.createGain();
          g.gain.setValueAtTime(0.001, t);
          g.gain.linearRampToValueAtTime(0.4, t + 0.04);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

          whiteNoise.connect(filter);
          filter.connect(g);
          g.connect(this.sfxGain);
          whiteNoise.start(t);
          whiteNoise.stop(t + 0.35);
        } catch {}
        break;
      }
    }
  }

  public playHappyBirthdaySong(onLyricLine?: (lineIndex: number) => void): () => void {
    if (this.isMuted) return () => {};
    this.stopSong();
    this.init();
    if (!this.ctx || !this.masterGain) return () => {};

    const notes: [number, number][] = [
      [392.0, 0.75],  // G4
      [392.0, 0.25],  // G4
      [440.0, 1.0],   // A4
      [392.0, 1.0],   // G4
      [523.25, 1.0],  // C5
      [493.88, 2.0],  // B4

      [392.0, 0.75],  // G4
      [392.0, 0.25],  // G4
      [440.0, 1.0],   // A4
      [392.0, 1.0],   // G4
      [587.33, 1.0],  // D5
      [523.25, 2.0],  // C5

      [392.0, 0.75],  // G4
      [392.0, 0.25],  // G4
      [783.99, 1.0],  // G5
      [659.25, 1.0],  // E5
      [523.25, 1.0],  // C5
      [493.88, 1.0],  // B4
      [440.0, 1.0],   // A4

      [698.46, 0.75], // F5
      [698.46, 0.25], // F5
      [659.25, 1.0],  // E5
      [523.25, 1.0],  // C5
      [587.33, 1.0],  // D5
      [523.25, 2.8],  // C5
    ];

    const BEAT = 0.48;
    const t0 = this.ctx.currentTime + 0.1;
    let t = t0;

    const bus = this.ctx.createGain();
    bus.gain.value = 0.55;
    bus.connect(this.masterGain);

    const activeNodes: OscillatorNode[] = [];

    notes.forEach(([freq, duration]) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, t);

      const noteDur = Math.max(duration * BEAT * 1.5, 0.35);

      noteGain.gain.setValueAtTime(0.001, t);
      noteGain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + noteDur);

      osc.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(bus);

      osc.start(t);
      osc.stop(t + noteDur + 0.05);
      osc2.start(t);
      osc2.stop(t + noteDur + 0.05);

      activeNodes.push(osc, osc2);
      t += duration * BEAT;
    });

    // Schedule lyrics
    const lyricBeats = [0, 6, 12, 18];
    const timers: number[] = [];
    if (onLyricLine) {
      lyricBeats.forEach((b, idx) => {
        const delay = (t0 - this.ctx!.currentTime + b * BEAT) * 1000;
        const tm = window.setTimeout(() => onLyricLine(idx), Math.max(0, delay));
        timers.push(tm);
      });
      // All done highlight
      const endDelay = (t0 - this.ctx.currentTime + 25 * BEAT) * 1000;
      const tm = window.setTimeout(() => onLyricLine(-1), Math.max(0, endDelay));
      timers.push(tm);
    }

    const stopFn = () => {
      timers.forEach((tm) => clearTimeout(tm));
      try {
        activeNodes.forEach((n) => {
          try {
            n.stop();
            n.disconnect();
          } catch {}
        });
        bus.disconnect();
      } catch {}
    };

    this.activeSongStop = stopFn;
    return stopFn;
  }

  public stopSong() {
    if (this.currentSongTimer) {
      clearTimeout(this.currentSongTimer);
      this.currentSongTimer = null;
    }
    if (this.activeSongStop) {
      this.activeSongStop();
      this.activeSongStop = null;
    }
  }
}

export const soundEngine = new SoundEngine();
