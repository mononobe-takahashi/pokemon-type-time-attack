export class GameConfig{
  public static readonly modes = [
    'super', // 効果抜群
    'normal', // 等倍
    'not_very_to', // 相手に対して効果今ひとつ
    'not_very_from', // 相手から効果抜群
    'no', // 効果なし
    'multi', // 上記全てからランダム
  ];

  // ゲームモードをランダムにした時に１つ取得する
  public static get_random_mode() {
    return this.modes[Math.floor(Math.random() * this.modes.length)];
  }

  // マルチモードの時にモードをランダムに取得
  public static get_multi_mode() {
    const exclude_multi_modes = this.modes.filter(mode => mode !== 'multi');
    return exclude_multi_modes[Math.floor(Math.random() * exclude_multi_modes.length)];
  }

  // マルチモードの時にモードをランダムに複数取得
  public static get_multi_modes(count: number = 10) {
    return Array.from({ length: count }, () => this.get_multi_mode());
  }

}