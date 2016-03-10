class TLPageSettings {
    public NoTitle: boolean = true; // テキストとは別に見出しを設定するかどうか(trueのときテキストの先頭部分が見出しになる)
    public PageLoad: boolean = false; // ページごとのロードをするかどうか
    public NoServer: boolean = false; // サーバーを使うかどうか
}
//module.exports = TLPageSettings; // サーバー用
