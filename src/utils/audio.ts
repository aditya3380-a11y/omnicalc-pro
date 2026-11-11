class SoundEffectEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playKeySound(type: 'number' | 'operator' | 'action' | 'equals') {
    if (!this.enabled) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      let frequency = 440;
      let duration = 0.04;
      let peakGain = 0.08;

      switch (type) {
        case 'number':
          frequency = 520;
          duration = 0.035;
          peakGain = 0.07;
          osc.type = 'triangle';
          break;
        case 'operator':
          frequency = 680;
          duration = 0.045;
          peakGain = 0.09;
          osc.type = 'sine';
          break;
        case 'action':
          frequency = 360;
          duration = 0.05;
          peakGain = 0.08;
          osc.type = 'sine';
          break;
        case 'equals':
          frequency = 880;
          duration = 0.07;
          peakGain = 0.12;
          osc.type = 'triangle';
          break;
      }

      osc.frequency.setValueAtTime(frequency, now);
      // Subtle pitch drop for soft mechanical click sensation
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.7, now + duration);

      gain.gain.setValueAtTime(peakGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio playback fails gracefully if blocked by autoplay policies
    }
  }
}

export const soundEngine = new SoundEffectEngine();
