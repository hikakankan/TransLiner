window.onload = () => {
    var tv = <HTMLCanvasElement>document.getElementById("treeview");
    var settings: ViewSettings = new ViewSettings();
    document.body.style.backgroundColor = settings.BodyBackColor.getRGBColor();
    var root: TLRootPage = new TLRootPage("ルート", "ルートの内容", settings.NoTitle);
    var page1: TLPage = new TLPage("その1", "その1の内容", root, settings.NoTitle);
    root.SubPages.Add(page1);
    page1.SubPages.Add(new TLPage("その1のその1", "その1のその1の内容", root, settings.NoTitle));
    root.SubPages.Add(new TLPage("その2", "その2の内容", root, settings.NoTitle));
    root.SubPages.Add(new TLPage("その3", "その3の内容", root, settings.NoTitle));
    var treeview: TreeView = new TreeView(tv, root, settings);
    var headlineElement = <HTMLInputElement>document.getElementById("headlineTextBox");
    var contentElement = <HTMLTextAreaElement>document.getElementById("contentTextBox");
    treeview.HeadlineElement = headlineElement;
    treeview.ContentElement = contentElement;
    treeview.draw();
};