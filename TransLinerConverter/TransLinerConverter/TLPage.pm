package TLPageCollection;
    my $Collection;
    sub new {
        $Collection = Array->new();
    }
    sub get_Count {
        return $Collection.length;
    }
    sub Last {
        return $Collection[$Collection.length - 1];
    }
    sub RemoveAt {
        my ($index) = @_;
        &Collection.splice($index, 1);
    }
    sub Insert {
        my ($index, $page) = @_;
        &Collection.splice($index, 0, $page);
    }
    sub Add {
        my ($page) = @_;
        &Collection.push($page);
    }
    sub Clear {
        $Collection = Array->new();
    }
1;
package TLPage;
    sub new {
        my ($title, $text, $root, $Settings) = @_;
        $title = $title;
        $text = $text;
        $root = $root;
        $SubPages = TLPageCollection->new();
        $loaded = true;
        $filename = "";
        $pagePath = "";
    }
    my $loaded;
    my $filename;
    my $root;
    my $SubPages;
    sub UnselectAll {
        $IsSelected = false;
        for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
            &SubPages.Collection[$i].UnselectAll();
        }
    }
    sub getLine {
        my ($text) = @_;
        my $r = &text.indexOf("\r");
        my $n = &text.indexOf("\n");
        if ( $r >= 0 ) then {
            if ( $n >= 0 ) then {
                return &text.substring(0, &Math.min($r, $n));
            } else {
                return &text.substring(0, $r);
            }
        } else {
            if ( $n >= 0 ) then {
                return &text.substring(0, $n);
            } else {
                return $text;
            }
        }
    }
    my $title = "";
    sub getTitle {
        my ($text) = @_;
        if ( $Settings.NoTitle ) then {
            my $line = &getLine($text);
            if ( $line.length <= $Settings.TitleLength ) then {
                return $line;
            } else {
                return &line.substring(0, $Settings.TitleLength);
            }
        } else {
            return $title;
        }
    }
    sub get_Title {
        my $title = &getTitle($text);
        if ( $title == "" ) then {
            if ( $title != "" ) then {
                return $title;
            }
            return "タイトルなし";
        } else {
            return $title;
        }
    }
    sub set_Title {
        my ($title) = @_;
        $title = $title;
    }
    my $text = "";
    sub get_Text {
        &loadPageFile();
        return $text;
    }
    sub set_Text {
        my ($value) = @_;
        $text = $value;
    }
    my $isSelected = false;
    my $isExpanded = false;
    sub get_IsSelected {
        return $isSelected;
    }
    sub set_IsSelected {
        my ($value) = @_;
        $isSelected = $value;
    }
    sub get_IsExpanded {
        return $isExpanded;
    }
    sub set_IsExpanded {
        my ($value) = @_;
        if ( $value ) then {
            &loadPageFile();
        }
        $isExpanded = $value;
    }
    sub CanExpand {
        return !$IsExpanded && !$loaded || $SubPages.Count > 0;
    }
    sub get_SelectedPage_ {
        if ( $IsSelected ) then {
            return this;
        } else {
            for ( my $page of $SubPages.Collection ) {
                my $selectedPage = $page.SelectedPage_;
                if ( $selectedPage != null ) then {
                    return $selectedPage;
                }
            }
        }
        return null;
    }
    sub validIndex {
        my ($index, $count) = @_;
    }
    sub validIndex {
        my ($index) = @_;
    }
    sub validIndex {
        my ($index, $count ?) = @_;
        if ( $count != null ) then {
            return $index >= 0 && $index < $count;
        } else {
            return $index >= 0;
        }
    }
    sub MoveLeft {
        my ($parent, $myIndex, $parentparent, $parentIndex, $dest) = @_;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) && &validIndex($parentIndex) ) then {
                &parent.SubPages.RemoveAt($myIndex);
                &parentparent.SubPages.Insert($parentIndex + $dest, this);
                return true;
            }
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.MoveLeft(this, $i, $parent, $myIndex, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub MoveRight {
        my ($parent, $myIndex, $destBefore, $destAfter, $destTop) = @_;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) && &validIndex($myIndex + $destBefore, $parent.SubPages.Count) ) then {
                &parent.SubPages.RemoveAt($myIndex);
                if ( $destTop ) then {
                    &parent.SubPages.Collection[$myIndex + $destAfter].SubPages.Insert(0, this);
                } else {
                    &parent.SubPages.Collection[$myIndex + $destAfter].SubPages.Add(this);
                }
                if ( !$parent.SubPages.Collection[$myIndex + $destAfter].IsExpanded ) then {
                    $parent.SubPages.Collection[$myIndex + $destAfter].IsExpanded = true;
                }
                return true;
            }
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.MoveRight(this, $i, $destBefore, $destAfter, $destTop) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub Move {
        my ($parent, $myIndex, $dest) = @_;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) && &validIndex($myIndex + $dest, $parent.SubPages.Count) ) then {
                &parent.SubPages.RemoveAt($myIndex);
                &parent.SubPages.Insert($myIndex + $dest, this);
                return true;
            }
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.Move(this, $i, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub SelectedMove {
        my ($parent, $myIndex, $dest) = @_;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) && $myIndex + $dest == - 1 ) then {
                $parent.IsSelected = true;
            } else if ( &validIndex($myIndex) && $myIndex + $dest == $parent.SubPages.Count ) then {
                $parent.IsSelected = true;
                &root.SelectedDownOver(null, - 1);
            } else if ( $IsExpanded && $dest == 1 ) then {
                if ( $SubPages.Count > 0 ) then {
                    $SubPages.Collection[0].IsSelected = true;
                }
            } else if ( &validIndex($myIndex) && &validIndex($myIndex + $dest, $parent.SubPages.Count) ) then {
                if ( $dest == - 1 ) then {
                    &parent.SubPages.Collection[$myIndex + $dest].SelectLastExpandedItem();
                } else {
                    $parent.SubPages.Collection[$myIndex + $dest].IsSelected = true;
                }
            }
            return true;
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.SelectedMove(this, $i, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub SelectLastExpandedItem {
        if ( $IsExpanded && $SubPages.Count > 0 ) then {
            &SubPages.Last().SelectLastExpandedItem();
        } else {
            $IsSelected = true;
        }
    }
    sub SelectedDownOver {
        my ($parent, $myIndex) = @_;
        my $dest = 1;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) && $myIndex + $dest == $parent.SubPages.Count ) then {
                $parent.IsSelected = true;
                &root.SelectedDownOver(null, - 1);
            } else if ( &validIndex($myIndex) && &validIndex($myIndex + $dest, $parent.SubPages.Count) ) then {
                $parent.SubPages.Collection[$myIndex + $dest].IsSelected = true;
            }
            return true;
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.SelectedDownOver(this, $i) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub ExpandedChange {
        my ($parent, $myIndex, $expanded) = @_;
        if ( $IsSelected ) then {
            if ( !$IsExpanded ) then {
                if ( !$expanded ) then {
                    if ( &validIndex($myIndex) ) then {
                        $parent.IsSelected = true;
                    }
                } else {
                    $IsExpanded = $expanded;
                }
            } else {
                if ( !$expanded ) then {
                    $IsExpanded = $expanded;
                } else {
                    if ( $SubPages.Count > 0 ) then {
                        $SubPages.Collection[0].IsSelected = true;
                    }
                }
            }
            return true;
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.ExpandedChange(this, $i, $expanded) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub Create {
        my ($parent, $myIndex, $dest) = @_;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) ) then {
                my $page = TLPage->new("", "", $root, $Settings);
                &parent.SubPages.Insert($myIndex + $dest, $page);
                $page.IsSelected = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.Create(this, $i, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub CreateRight {
        my ($parent, $myIndex, $destTop) = @_;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) ) then {
                my $page = TLPage->new("", "", $root, $Settings);
                if ( $destTop ) then {
                    &SubPages.Insert(0, $page);
                } else {
                    &SubPages.Add($page);
                }
                $IsExpanded = true;
                $page.IsSelected = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.CreateRight(this, $i, $destTop) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub Delete {
        my ($parent, $myIndex) = @_;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) ) then {
                &parent.SubPages.RemoveAt($myIndex);
                if ( &validIndex($myIndex, $SubPages.Count) ) then {
                    $parent.SubPages.Collection[$myIndex].IsSelected = true;
                } else {
                    if ( &validIndex($myIndex - 1) ) then {
                        $parent.SubPages.Collection[$myIndex - 1].IsSelected = true;
                    } else {                    }
                }
                return true;
            }
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.Delete(this, $i) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub Clone {
        my $page = TLPage->new($Title, $Text, $root, $Settings);
        for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
            my $subpage = &SubPages.Collection[$i].Clone();
            &page.SubPages.Add($subpage);
        }
        return $page;
    }
    sub Duplicate {
        my ($parent, $myIndex, $dest) = @_;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) ) then {
                my $page = &Clone();
                &parent.SubPages.Insert($myIndex + $dest, $page);
                $page.IsSelected = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.Duplicate(this, $i, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub DuplicateRight {
        my ($parent, $myIndex, $destTop) = @_;
        if ( $IsSelected ) then {
            if ( &validIndex($myIndex) ) then {
                my $page = &Clone();
                if ( $destTop ) then {
                    &SubPages.Insert(0, $page);
                } else {
                    &SubPages.Add($page);
                }
                $IsExpanded = true;
                $page.IsSelected = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                if ( &subpage.DuplicateRight(this, $i, $destTop) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub create_text {
        my ($doc, $name, $text) = @_;
        my $element = &doc.createElement($name);
        my $content = &doc.createTextNode($text);
        &element.appendChild($content);
        return $element;
    }
    sub ToXml {
        my ($doc) = @_;
        my $page = &doc.createElement("page");
        &page.appendChild(&create_text($doc, "title", $Title));
        &page.appendChild(&create_text($doc, "text", $text));
        my $subpages = &doc.createElement("subpages");
        &page.appendChild($subpages);
        for ( my $p of $SubPages.Collection ) {
            if ( $Settings.PageLoad ) then {
                my $subpage = &doc.createElement("page");
                &subpage.appendChild(&create_text($doc, "title", $p.Title));
                &subpages.appendChild($subpage);
            } else {
                &subpages.appendChild(&p.ToXml($doc));
            }
        }
        return $page;
    }
    sub ToJSON {
        my $subpages = Array->new();
        for ( my $p of $SubPages.Collection ) {
            if ( $Settings.PageLoad ) then {
                &subpages.push({my "Title" = $p.Title});
            } else {
                &subpages.push(&p.ToJSON());
            }
        }
        return {my "Title" = $Title, my "Text" = $Text, my "SubPages" = $subpages}
    }
    sub find_element {
        my ($parent, $name) = @_;
        if ( $parent.hasChildNodes ) then {
            for ( my $i = 0; $i < $parent.childNodes.length; $i++ ) {
                my $child = $parent.childNodes[$i];
                if ( $child.nodeType == $Node.ELEMENT_NODE && $child.nodeName == $name ) then {
                    return $Element $child;
                }
            }
        }
        return null;
    }
    sub get_text {
        my ($parent, $name) = @_;
        my $element = &find_element($parent, $name);
        return $element.textContent;
    }
    sub FromXml {
        my ($element) = @_;
        $Title = &get_text($element, "title");
        my $fileelement = &find_element($element, "file");
        if ( $fileelement != null ) then {
            $loaded = false;
            $filename = $fileelement.textContent;
        } else {
            my $subpages = &find_element($element, "subpages");
            if ( $subpages != null ) then {
                $loaded = true;
                $filename = "";
                $Text = &get_text($element, "text");
                for ( my $i = 0; $i < $subpages.childNodes.length; $i++ ) {
                    my $child = $subpages.childNodes[$i];
                    if ( $child.nodeType == $Node.ELEMENT_NODE ) then {
                        my $page = TLPage->new("", "", $root, $Settings);
                        &page.FromXml($Element $child);
                        &SubPages.Add($page);
                    }
                }
            } else {
                $loaded = false;
                $filename = "";
            }
        }
    }
    sub FromJSON {
        my ($obj) = @_;
        $Title = $obj["Title"];
        my $file = $obj["File"];
        if ( $file != null ) then {
            $loaded = false;
            $filename = $file;
        } else {
            my $subpages = $obj["SubPages"];
            if ( $subpages != null ) then {
                $loaded = true;
                $filename = "";
                $Text = $obj["Text"];
                for ( my $i = 0; $i < $subpages.length; $i++ ) {
                    my $child = $subpages[$i];
                    my $page = TLPage->new("", "", $root, $Settings);
                    &page.FromJSON($child);
                    &SubPages.Add($page);
                }
            } else {
                $loaded = false;
                $filename = "";
            }
        }
    }
    my $pagePath;
    sub getPagePath {
        return $pagePath;
    }
    sub getPageByPath {
        my ($path) = @_;
        if ( $path.length == 0 ) then {
            return this;
        } else {
            my $index = &Number($path[0]);
            if ( $index >= 0 && $index < $SubPages.Count ) then {
                return &SubPages.Collection[$index].getPageByPath(&path.slice(1));
            }
        }
        return null;
    }
    sub getPageByPathString {
        my ($path) = @_;
        return &getPageByPath(&path.split("/").slice(1));
    }
    sub setPath {
        my ($path) = @_;
        $pagePath = $path;
        if ( $loaded ) then {
            for ( my $i = 0; $i < $SubPages.Count; $i++ ) {
                my $subpage = $SubPages.Collection[$i];
                &subpage.setPath($path + "/" + &String($i));
            }
        }
    }
    sub loadPageFile {
        if ( !$loaded ) then {
            if ( $filename != "" ) then {
                &Load($filename);
            } else {
                &root.setPath("0");
                &Load("tlcom.command?name=getpage&path=" + $pagePath);
            }
            $loaded = true;
            $filename = "";
        }
    }
    sub get_ext {
        my ($file) = @_;
        my $index = &file.lastIndexOf(".");
        if ( $index >= 0 ) then {
            return &file.substring($index + 1);
        }
        return "";
    }
    sub Load {
        my ($path) = @_;
        if ( &get_ext($path) == "xml" ) then {
            &LoadXML($path);
        } else {
            &LoadJSON($path);
        }
    }
    sub LoadXML {
        my ($path) = @_;
        my $request = XMLHttpRequest->new();
        &request.open("GET", $path, false);
        &request.send(null);
        my $doc = $request.responseXML;
        &FromXml($doc.documentElement);
    }
    sub LoadJSON {
        my ($path) = @_;
        my $request = XMLHttpRequest->new();
        &request.open("GET", $path, false);
        &request.send(null);
        &FromJSON(&JSON.parse($request.responseText));
    }
    sub Save {
        my ($path) = @_;
    }
    sub StartsWith {
        my ($str, $header) = @_;
        return $str.length >= $header.length && &str.substr(0, $header.length) == $header;
    }
    sub splitSections {
        my ($sections, $header) = @_;
        my $result = Array->new();
        my $chapter = null;
        for ( my $section of $sections ) {
            if ( &StartsWith($section, $header) ) then {
                if ( $chapter == null ) then {
                    $chapter = Array->new();
                }
                &chapter.push(&section.substring(1));
            } else {
                if ( $chapter != null ) then {
                    &result.push($chapter);
                }
                $chapter = Array->new();
                &chapter.push($section);
            }
        }
        if ( $chapter != null ) then {
            &result.push($chapter);
        }
        return $result;
    }
    sub FromText {
        my ($sections, $header) = @_;
        if ( $sections.length > 0 ) then {
            $Text = $sections[0];
            my $sections2 = &sections.slice(1);
            for ( my $chapter of &splitSections($sections2, $header) ) {
                my $page = TLPage->new("", "", $root, $Settings);
                &page.FromText($chapter, $header);
                &SubPages.Add($page);
            }
        }
    }
1;
