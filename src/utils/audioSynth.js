// Generador de audio de respaldo con Web Audio API
// Garantiza que el usuario SIEMPRE escuche música relajante incluso si está offline
// o si las URLs externas tardan en cargar.

class NovaSynthEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.gainNode = null;
    this.currentStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(vol * 0.2, this.ctx.currentTime);
    }
  }

  start() {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;

    // Escala pentatónica relajante (A minor pentatonic lofi chords)
    const notes = [220, 261.63, 293.66, 329.63, 392.00, 440, 523.25];
    const chords = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [130.81, 164.81, 196], // C
      [196, 246.94, 293.66], // G
    ];

    const playBeat = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chordIndex = Math.floor(this.currentStep / 4) % chords.length;
      const chord = chords[chordIndex];

      // Bass pad
      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.08 / (i + 1), now + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 1.0);
      });

      // Melodía suave
      if (this.currentStep % 2 === 0) {
        const melodyFreq = notes[Math.floor(Math.random() * notes.length)];
        const melOsc = this.ctx.createOscillator();
        const melGain = this.ctx.createGain();
        melOsc.type = 'sine';
        melOsc.frequency.setValueAtTime(melodyFreq, now);

        melGain.gain.setValueAtTime(0.001, now);
        melGain.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
        melGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        melOsc.connect(melGain);
        melGain.connect(this.gainNode);

        melOsc.start(now);
        melOsc.stop(now + 0.55);
      }

      this.currentStep++;
      this.timer = setTimeout(playBeat, 450);
    };

    playBeat();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const synthFallback = new NovaSynthEngine();
