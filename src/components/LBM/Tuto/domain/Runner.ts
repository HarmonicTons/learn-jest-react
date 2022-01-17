export class Runner {
  public isRunning = false;
  private lastTimeSteps: number[] = [];
  private lastUpdateTimestamp = 0;
  private maxUps: number;
  private callback: () => void;

  constructor(callback: () => void, maxUps = 1000) {
    this.callback = callback;
    this.maxUps = maxUps;
  }

  get ups(): number {
    return Math.round(
      1000 /
        (this.lastTimeSteps.reduce((acc, curr) => acc + curr, 0) /
          this.lastTimeSteps.length),
    );
  }

  start(): void {
    if (this.maxUps === 0) {
      return;
    }
    this.isRunning = true;
    this.lastUpdateTimestamp = Date.now();
    this.loop();
  }

  stop(): void {
    this.isRunning = false;
  }

  loop(): void {
    this.callback();

    const timestamp = Date.now();
    this.lastTimeSteps.push(timestamp - this.lastUpdateTimestamp);
    if (this.lastTimeSteps.length > 100) {
      this.lastTimeSteps = this.lastTimeSteps.slice(1);
    }
    this.lastUpdateTimestamp = timestamp;
    if (this.isRunning) {
      if (this.maxUps >= 200) {
        setImmediate(() => this.loop());
      } else {
        setTimeout(() => this.loop(), 1000 / this.maxUps);
      }
    }
  }
}
