var ViewSettings = (function () {
    function ViewSettings() {
        // 制御領域
        this.BodyBackColor = new WYColor(220, 240, 255); // 背景色
        this.BodyTextColor = new WYColor(0, 0, 0); // テキストの色
        this.ButtonBackColor = new WYColor(200, 220, 255); // ボタンの色
        this.ButtonTextColor = new WYColor(0, 0, 0); // ボタンのテキストの色
        this.TextBackColor = new WYColor(255, 240, 240); // テキストボックスの色
        this.TextTextColor = new WYColor(0, 0, 0); // テキストボックスのテキストの色
        // 計算領域
        this.CalcAreaTextColor = new WYColor(0, 200, 200); // 計算領域の文字の色
        this.CalcAreaBackColor = new WYColor(255, 245, 245); // 計算領域の背景色
        this.CalcAreaFrameColor = new WYColor(0, 0, 0); // 計算領域の枠の色
        this.CalcAreaFrameBackColor = new WYColor(255, 240, 240); // 計算領域の枠の中の色
        this.CalcAreaUnderlineColor = new WYColor(0, 0, 0); // 計算領域の下線の色
        this.CalcAreaSourceBackColor = new WYColor(255, 235, 235); // 計算領域の計算中の元の桁の色
        this.CalcAreaDestinationBackColor = new WYColor(255, 235, 235); // 計算領域の計算中の結果の桁の色
        this.CalcAreaUpdatingBackColor = new WYColor(255, 230, 230); // 計算領域の計算中の結果の桁の中で書き込む桁の色
        this.MainFont = new GCDefaultFont();
        this.ImageSettings = new ImageSettings(); // イメージの設定
        this.UseImage = false; // イメージを使うかどうか
        //this.NoTitle = true; // テキストとは別に見出しを設定するかどうか(trueのときテキストの先頭部分が見出しになる)
        this.NoEdit = false; // 編集可能かどうか(trueのとき編集不可)
    }
    return ViewSettings;
})();
var ImageSettings = (function () {
    function ImageSettings() {
    }
    ImageSettings.prototype.GetWidth = function (str) {
        return 0; // 実装していません
    };
    ImageSettings.prototype.GetHeight = function () {
        return 0; // 実装していません
    };
    ImageSettings.prototype.DrawString = function (str, x, y, graph) {
        // 実装していません
    };
    return ImageSettings;
})();
//# sourceMappingURL=ViewSettings.js.map