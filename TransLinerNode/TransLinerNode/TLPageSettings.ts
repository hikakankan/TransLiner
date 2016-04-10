class TLPageSettings {
    public NoTitle: boolean = true; // テキストとは別に見出しを設定するかどうか(trueのときテキストの先頭部分が見出しになる)
    public TitleLength: number = 20; // テキストの先頭部分が見出しになるときの見出しの長さ

    public PageLoad: boolean = false; // ページごとのロードをするかどうか
    public NoServer: boolean = false; // サーバーを使うかどうか

    // サーバーなしで使う時の設定
    public SetNoServerMode() {
        this.PageLoad = false; // ページごとのロードをするかどうか
        this.NoServer = true; // サーバーを使うかどうか
    }
}
//<server>module.exports = TLPageSettings; // サーバー用
