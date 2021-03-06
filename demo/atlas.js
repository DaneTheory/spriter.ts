System.register([], function(exports_1) {
    "use strict";
    var Page, Site, Data;
    function trim(s) {
        return s.replace(/^\s+|\s+$/g, '');
    }
    return {
        setters:[],
        execute: function() {
            Page = (function () {
                function Page() {
                    this.name = "";
                    this.w = 0;
                    this.h = 0;
                    this.format = 'RGBA8888';
                    this.min_filter = 'linear';
                    this.mag_filter = 'linear';
                    this.wrap_s = 'clamp-to-edge';
                    this.wrap_t = 'clamp-to-edge';
                }
                return Page;
            }());
            exports_1("Page", Page);
            Site = (function () {
                function Site() {
                    this.page = null;
                    this.x = 0;
                    this.y = 0;
                    this.w = 0;
                    this.h = 0;
                    this.rotate = 0;
                    this.offset_x = 0;
                    this.offset_y = 0;
                    this.original_w = 0;
                    this.original_h = 0;
                    this.index = -1;
                }
                return Site;
            }());
            exports_1("Site", Site);
            Data = (function () {
                function Data() {
                    this.pages = [];
                    this.sites = {};
                }
                Data.prototype.drop = function () {
                    var data = this;
                    data.pages = [];
                    data.sites = {};
                    return this;
                };
                Data.prototype.import = function (text) {
                    return this.importAtlasText(text);
                };
                Data.prototype.export = function (text) {
                    if (text === void 0) { text = ""; }
                    return this.exportAtlasText(text);
                };
                Data.prototype.importAtlasText = function (text) {
                    var lines = text.split(/\n|\r\n/);
                    return this.importAtlasTextLines(lines);
                };
                Data.prototype.exportAtlasText = function (text) {
                    if (text === void 0) { text = ""; }
                    var lines = this.exportAtlasTextLines([]);
                    return text + lines.join('\n');
                };
                Data.prototype.importAtlasTextLines = function (lines) {
                    var data = this;
                    data.pages = [];
                    data.sites = {};
                    var page = null;
                    var site = null;
                    var match = null;
                    lines.forEach(function (line) {
                        if (trim(line).length === 0) {
                            page = null;
                            site = null;
                        }
                        else if ((match = line.match(/^size: (.*),(.*)$/))) {
                            page.w = parseInt(match[1], 10);
                            page.h = parseInt(match[2], 10);
                        }
                        else if ((match = line.match(/^format: (.*)$/))) {
                            page.format = match[1];
                        }
                        else if ((match = line.match(/^filter: (.*),(.*)$/))) {
                            page.min_filter = match[1];
                            page.mag_filter = match[2];
                        }
                        else if ((match = line.match(/^repeat: (.*)$/))) {
                            var repeat = match[1];
                            page.wrap_s = ((repeat === 'x') || (repeat === 'xy')) ? ('Repeat') : ('ClampToEdge');
                            page.wrap_t = ((repeat === 'y') || (repeat === 'xy')) ? ('Repeat') : ('ClampToEdge');
                        }
                        else if ((match = line.match(/^orig: (.*)[,| x] (.*)$/))) {
                            var original_w = parseInt(match[1], 10);
                            var original_h = parseInt(match[2], 10);
                            console.log('page:orig', original_w, original_h);
                        }
                        else if (page === null) {
                            page = new Page();
                            page.name = line;
                            data.pages.push(page);
                        }
                        else {
                            if ((match = line.match(/^ {2}rotate: (.*)$/))) {
                                site.rotate = (match[1] === 'true') ? -1 : 0;
                            }
                            else if ((match = line.match(/^ {2}xy: (.*), (.*)$/))) {
                                site.x = parseInt(match[1], 10);
                                site.y = parseInt(match[2], 10);
                            }
                            else if ((match = line.match(/^ {2}size: (.*), (.*)$/))) {
                                site.w = parseInt(match[1], 10);
                                site.h = parseInt(match[2], 10);
                            }
                            else if ((match = line.match(/^ {2}orig: (.*), (.*)$/))) {
                                site.original_w = parseInt(match[1], 10);
                                site.original_h = parseInt(match[2], 10);
                            }
                            else if ((match = line.match(/^ {2}offset: (.*), (.*)$/))) {
                                site.offset_x = parseInt(match[1], 10);
                                site.offset_y = parseInt(match[2], 10);
                            }
                            else if ((match = line.match(/^ {2}index: (.*)$/))) {
                                site.index = parseInt(match[1], 10);
                            }
                            else {
                                if (site) {
                                    site.original_w = site.original_w || site.w;
                                    site.original_h = site.original_h || site.h;
                                }
                                site = new Site();
                                site.page = page;
                                data.sites[line] = site;
                            }
                        }
                    });
                    return data;
                };
                Data.prototype.exportAtlasTextLines = function (lines) {
                    if (lines === void 0) { lines = []; }
                    var data = this;
                    data.pages.forEach(function (page) {
                        lines.push("");
                        lines.push(page.name);
                        lines.push("size: " + page.w + "," + page.h);
                        lines.push("format: " + page.format);
                        lines.push("filter: " + page.min_filter + "," + page.mag_filter);
                        var repeat = 'none';
                        if ((page.wrap_s === 'Repeat') && (page.wrap_t === 'Repeat')) {
                            repeat = "xy";
                        }
                        else if (page.wrap_s === 'Repeat') {
                            repeat = 'x';
                        }
                        else if (page.wrap_t === 'Repeat') {
                            repeat = 'y';
                        }
                        lines.push("repeat: " + repeat);
                        Object.keys(data.sites).forEach(function (site_key) {
                            var site = data.sites[site_key];
                            if (site.page !== page) {
                                return;
                            }
                            lines.push(site_key);
                            lines.push("  rotate: " + (site.rotate === 0 ? "false" : "true"));
                            lines.push("  xy: " + site.x + ", " + site.y);
                            lines.push("  size: " + site.w + ", " + site.h);
                            lines.push("  orig: " + site.original_w + ", " + site.original_h);
                            lines.push("  offset: " + site.offset_x + ", " + site.offset_y);
                            lines.push("  index: " + site.index);
                        });
                    });
                    return lines;
                };
                Data.prototype.importTpsText = function (tps_text) {
                    var data = this;
                    data.pages = [];
                    data.sites = {};
                    return data.importTpsTextPage(tps_text, 0);
                };
                Data.prototype.importTpsTextPage = function (tps_text, page_index) {
                    if (page_index === void 0) { page_index = 0; }
                    var data = this;
                    var tps_json = JSON.parse(tps_text);
                    var page = data.pages[page_index] = new Page();
                    if (tps_json.meta) {
                        page.w = tps_json.meta.size.w;
                        page.h = tps_json.meta.size.h;
                        page.name = tps_json.meta.image;
                    }
                    Object.keys(tps_json.frames || {}).forEach(function (key) {
                        var frame = tps_json.frames[key];
                        var site = data.sites[key] = new Site();
                        site.page = page;
                        site.x = frame.frame.x;
                        site.y = frame.frame.y;
                        site.w = frame.frame.w;
                        site.h = frame.frame.h;
                        site.rotate = frame.rotated ? 1 : 0;
                        site.offset_x = (frame.spriteSourceSize && frame.spriteSourceSize.x) || 0;
                        site.offset_y = (frame.spriteSourceSize && frame.spriteSourceSize.y) || 0;
                        site.original_w = (frame.sourceSize && frame.sourceSize.w) || site.w;
                        site.original_h = (frame.sourceSize && frame.sourceSize.h) || site.h;
                    });
                    return data;
                };
                return Data;
            }());
            exports_1("Data", Data);
        }
    }
});
