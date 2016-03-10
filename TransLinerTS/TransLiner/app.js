window.onload = function () {
    var tv = document.getElementById("treeview");
    var settings = new ViewSettings();
    var pageSettings = new TLPageSettings();
    document.body.style.backgroundColor = settings.BodyBackColor.getRGBColor();
    var root = new TLRootPage("ルート", "ルートの内容", pageSettings);
    var page1 = new TLPage("その1", "その1の内容", root, pageSettings);
    root.SubPages.Add(page1);
    page1.SubPages.Add(new TLPage("その1のその1", "その1のその1の内容", root, pageSettings));
    root.SubPages.Add(new TLPage("その2", "その2の内容", root, pageSettings));
    root.SubPages.Add(new TLPage("その3", "その3の内容", root, pageSettings));
    var treeview = new TreeView(tv, root, settings);
    var headlineElement = document.getElementById("headlineTextBox");
    var contentElement = document.getElementById("contentTextBox");
    treeview.HeadlineElement = headlineElement;
    treeview.ContentElement = contentElement;
    var inputFileElement = document.getElementById("file");
    treeview.InputFileElement = inputFileElement;
    treeview.draw();
    main_treeview = treeview;
};
var main_treeview;
function loadXML() {
    main_treeview.loadXML("sample.xml");
}
function loadXMLbyFile() {
    main_treeview.loadXMLbyFile("sample0.xml");
}
function loadJSON() {
    main_treeview.loadJSON("sample.json");
}
function loadJSONbyFile() {
    main_treeview.loadJSONbyFile("sample0.json");
}
function JSONtest() {
    main_treeview.JSONtest();
}
//# sourceMappingURL=app.js.map