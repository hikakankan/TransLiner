"use strict";
var TLPageSettings = (function () {
    function TLPageSettings() {
        this.NoTitle = true; // テキストとは別に見出しを設定するかどうか(trueのときテキストの先頭部分が見出しになる)
        this.TitleLength = 20; // テキストの先頭部分が見出しになるときの見出しの長さ
        this.PageLoad = false; // ページごとのロードをするかどうか
        this.NoServer = false; // サーバーを使うかどうか
    }
    // サーバーなしで使う時の設定
    TLPageSettings.prototype.SetNoServerMode = function () {
        this.PageLoad = false; // ページごとのロードをするかどうか
        this.NoServer = true; // サーバーを使うかどうか
    };
    return TLPageSettings;
}());
module.exports = TLPageSettings;
//# sourceMappingURL=TLPageSettingsServer.js.map