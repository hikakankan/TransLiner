function def_mouse_event(element, obj) {
    element.onmousedown = function (e) {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        obj.mousePressed(x, y);
    };
    element.onmouseup = function (e) {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        obj.mouseReleased(x, y);
    };
    element.onmousemove = function (e) {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        obj.mouseMoved(x, y);
    };
    if (typeof element.ontouchstart !== "undefined") {
        element.ontouchstart = function (event) {
            for (var i = 0; i < event.touches.length; i++) {
                var e = event.touches[i];
                var rect = e.target.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                obj.touchStart(x, y);
            }
        };
        element.ontouchend = function (event) {
            var ids = new Array();
            for (var i = 0; i < event.touches.length; i++) {
                var e = event.touches[i];
                ids.push(e.identifier);
            }
            obj.touchEnd(ids);
        };
        element.ontouchmove = function (event) {
            for (var i = 0; i < event.touches.length; i++) {
                var e = event.touches[i];
                var rect = e.target.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                obj.touchMove(x, y);
            }
        };
    }
}
function def_mouse_event_in_obj(obj) {
    def_mouse_event(obj.canvas, obj);
}
//# sourceMappingURL=defevent.js.map