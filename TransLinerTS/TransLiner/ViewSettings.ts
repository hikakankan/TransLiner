class ViewSettings {
    public BodyBackColor: WYColor;
    public BodyTextColor: WYColor;
    public ButtonBackColor: WYColor;
    public ButtonTextColor: WYColor;
    public TextBackColor: WYColor;
    public TextTextColor: WYColor;
    public CalcAreaBackColor: WYColor;
    public CalcAreaFrameBackColor: WYColor;
    public CalcAreaFrameColor: WYColor;
    public CalcAreaTextColor: WYColor;
    public CalcAreaUnderlineColor: WYColor;
    public CalcAreaSourceBackColor: WYColor;
    public CalcAreaDestinationBackColor: WYColor;
    public CalcAreaUpdatingBackColor: WYColor;
    public MainFont: GCDefaultFont;
    public ImageSettings: ImageSettings;
    public UseImage: boolean;
    public NoEdit: boolean;
    public NoFocus: boolean;

    public constructor() {
        // 制御領域
        this.BodyBackColor = new WYColor(220, 240, 255);	// 背景色
        this.BodyTextColor = new WYColor(0, 0, 0);		// テキストの色
        this.ButtonBackColor = new WYColor(200, 220, 255);	// ボタンの色
        this.ButtonTextColor = new WYColor(0, 0, 0);		// ボタンのテキストの色
        this.TextBackColor = new WYColor(255, 240, 240);	// テキストボックスの色
        this.TextTextColor = new WYColor(0, 0, 0);		// テキストボックスのテキストの色

        // 計算領域
        this.CalcAreaTextColor = new WYColor(0, 200, 200);		// 計算領域の文字の色
        this.CalcAreaBackColor = new WYColor(255, 245, 245);		// 計算領域の背景色
        this.CalcAreaFrameColor = new WYColor(0, 0, 0);			// 計算領域の枠の色
        this.CalcAreaFrameBackColor = new WYColor(255, 240, 240);	// 計算領域の枠の中の色
        this.CalcAreaUnderlineColor = new WYColor(0, 0, 0);		// 計算領域の下線の色
        this.CalcAreaSourceBackColor = new WYColor(255, 235, 235);	// 計算領域の計算中の元の桁の色
        this.CalcAreaDestinationBackColor = new WYColor(255, 235, 235);	// 計算領域の計算中の結果の桁の色
        this.CalcAreaUpdatingBackColor = new WYColor(255, 230, 230);	// 計算領域の計算中の結果の桁の中で書き込む桁の色

        this.MainFont = new GCDefaultFont();

        this.ImageSettings = new ImageSettings();			// イメージの設定
        this.UseImage = false;						// イメージを使うかどうか

        this.NoEdit = false;  // 編集可能かどうか(trueのとき編集不可)
        this.NoFocus = false;  // テキストを編集するときフォーカスをテキストに移動するかどうか(trueのときフォーカスは移動しない)
    }
}

class ImageSettings {
    public GetWidth(str: string): number {
        return 0; // 実装していません
    }
    public GetHeight(): number {
        return 0; // 実装していません
    }
    public DrawString(str: string, x: number, y: number, graph: CanvasRenderingContext2D): void {
        // 実装していません
    }
}
