package TLPageCollection;
    my $Collection;
    sub new {
        my $class = shift;
        $this->Collection = Array->new();
        my $self = {
            "Collection" => $Collection
        }
        return bless $self, $class;
    }
    sub get_Count {
        my $this = shift;
        return $this->Collection->length;
    }
    sub Last {
        my $this = shift;
        return $this->Collection[$this->Collection->length - 1];
    }
    sub RemoveAt {
        my $this = shift;
        my ($index) = @_;
        $this->Collection->splice($index, 1);
    }
    sub Insert {
        my $this = shift;
        my ($index, $page) = @_;
        $this->Collection->splice($index, 0, $page);
    }
    sub Add {
        my $this = shift;
        my ($page) = @_;
        $this->Collection->push($page);
    }
    sub Clear {
        my $this = shift;
        $this->Collection = Array->new();
    }
1;
package TLPage;
    sub new {
        my $class = shift;
        my ($title, $text, $root, $Settings) = @_;
        $this->title = $title;
        $this->text = $text;
        $this->root = $root;
        $this->SubPages = TLPageCollection->new();
        $this->loaded = true;
        $this->filename = "";
        $this->pagePath = "";
        my $self = {
            "loaded" => $loaded, 
            "filename" => $filename, 
            "root" => $root, 
            "SubPages" => $SubPages, 
            "title" => $title, 
            "text" => $text, 
            "isSelected" => $isSelected, 
            "isExpanded" => $isExpanded, 
            "pagePath" => $pagePath
        }
        return bless $self, $class;
    }
    my $loaded;
    my $filename;
    my $root;
    my $SubPages;
    sub UnselectAll {
        my $this = shift;
        $this->IsSelected = false;
        for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
            $this->SubPages->Collection[$i]->UnselectAll();
        }
    }
    sub getLine {
        my $this = shift;
        my ($text) = @_;
        my $r = $text->indexOf("\r");
        my $n = $text->indexOf("\n");
        if ( $r >= 0 ) then {
            if ( $n >= 0 ) then {
                return $text->substring(0, $Math->min($r, $n));
            } else {
                return $text->substring(0, $r);
            }
        } else {
            if ( $n >= 0 ) then {
                return $text->substring(0, $n);
            } else {
                return $text;
            }
        }
    }
    my $title = "";
    sub getTitle {
        my $this = shift;
        my ($text) = @_;
        if ( $this->Settings->NoTitle ) then {
            my $line = $this->getLine($text);
            if ( $line->length <= $this->Settings->TitleLength ) then {
                return $line;
            } else {
                return $line->substring(0, $this->Settings->TitleLength);
            }
        } else {
            return $this->title;
        }
    }
    sub get_Title {
        my $this = shift;
        my $title = $this->getTitle($this->text);
        if ( $title == "" ) then {
            if ( $this->title != "" ) then {
                return $this->title;
            }
            return "タイトルなし";
        } else {
            return $title;
        }
    }
    sub set_Title {
        my $this = shift;
        my ($title) = @_;
        $this->title = $title;
    }
    my $text = "";
    sub get_Text {
        my $this = shift;
        $this->loadPageFile();
        return $this->text;
    }
    sub set_Text {
        my $this = shift;
        my ($value) = @_;
        $this->text = $value;
    }
    my $isSelected = false;
    my $isExpanded = false;
    sub get_IsSelected {
        my $this = shift;
        return $this->isSelected;
    }
    sub set_IsSelected {
        my $this = shift;
        my ($value) = @_;
        $this->isSelected = $value;
    }
    sub get_IsExpanded {
        my $this = shift;
        return $this->isExpanded;
    }
    sub set_IsExpanded {
        my $this = shift;
        my ($value) = @_;
        if ( $value ) then {
            $this->loadPageFile();
        }
        $this->isExpanded = $value;
    }
    sub CanExpand {
        my $this = shift;
        return !$this->IsExpanded && !$this->loaded || $this->SubPages->Count > 0;
    }
    sub get_SelectedPage_ {
        my $this = shift;
        if ( $this->IsSelected ) then {
            return $this;
        } else {
            for ( my $page of $this->SubPages->Collection ) {
                my $selectedPage = $page->SelectedPage_;
                if ( $selectedPage != null ) then {
                    return $selectedPage;
                }
            }
        }
        return null;
    }
    sub validIndex {
        my $this = shift;
        my ($index, $count) = @_;
    }
    sub validIndex {
        my $this = shift;
        my ($index) = @_;
    }
    sub validIndex {
        my $this = shift;
        my ($index, $count ?) = @_;
        if ( $count != null ) then {
            return $index >= 0 && $index < $count;
        } else {
            return $index >= 0;
        }
    }
    sub MoveLeft {
        my $this = shift;
        my ($parent, $myIndex, $parentparent, $parentIndex, $dest) = @_;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) && $this->validIndex($parentIndex) ) then {
                $parent->SubPages->RemoveAt($myIndex);
                $parentparent->SubPages->Insert($parentIndex + $dest, $this);
                return true;
            }
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->MoveLeft($this, $i, $parent, $myIndex, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub MoveRight {
        my $this = shift;
        my ($parent, $myIndex, $destBefore, $destAfter, $destTop) = @_;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) && $this->validIndex($myIndex + $destBefore, $parent->SubPages->Count) ) then {
                $parent->SubPages->RemoveAt($myIndex);
                if ( $destTop ) then {
                    $parent->SubPages->Collection[$myIndex + $destAfter]->SubPages->Insert(0, $this);
                } else {
                    $parent->SubPages->Collection[$myIndex + $destAfter]->SubPages->Add($this);
                }
                if ( !$parent->SubPages->Collection[$myIndex + $destAfter]->IsExpanded ) then {
                    $parent->SubPages->Collection[$myIndex + $destAfter]->IsExpanded = true;
                }
                return true;
            }
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->MoveRight($this, $i, $destBefore, $destAfter, $destTop) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub Move {
        my $this = shift;
        my ($parent, $myIndex, $dest) = @_;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) && $this->validIndex($myIndex + $dest, $parent->SubPages->Count) ) then {
                $parent->SubPages->RemoveAt($myIndex);
                $parent->SubPages->Insert($myIndex + $dest, $this);
                return true;
            }
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->Move($this, $i, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub SelectedMove {
        my $this = shift;
        my ($parent, $myIndex, $dest) = @_;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) && $myIndex + $dest == - 1 ) then {
                $parent->IsSelected = true;
            } else if ( $this->validIndex($myIndex) && $myIndex + $dest == $parent->SubPages->Count ) then {
                $parent->IsSelected = true;
                $this->root->SelectedDownOver(null, - 1);
            } else if ( $this->IsExpanded && $dest == 1 ) then {
                if ( $this->SubPages->Count > 0 ) then {
                    $this->SubPages->Collection[0]->IsSelected = true;
                }
            } else if ( $this->validIndex($myIndex) && $this->validIndex($myIndex + $dest, $parent->SubPages->Count) ) then {
                if ( $dest == - 1 ) then {
                    $parent->SubPages->Collection[$myIndex + $dest]->SelectLastExpandedItem();
                } else {
                    $parent->SubPages->Collection[$myIndex + $dest]->IsSelected = true;
                }
            }
            return true;
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->SelectedMove($this, $i, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub SelectLastExpandedItem {
        my $this = shift;
        if ( $this->IsExpanded && $this->SubPages->Count > 0 ) then {
            $this->SubPages->Last()->SelectLastExpandedItem();
        } else {
            $this->IsSelected = true;
        }
    }
    sub SelectedDownOver {
        my $this = shift;
        my ($parent, $myIndex) = @_;
        my $dest = 1;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) && $myIndex + $dest == $parent->SubPages->Count ) then {
                $parent->IsSelected = true;
                $this->root->SelectedDownOver(null, - 1);
            } else if ( $this->validIndex($myIndex) && $this->validIndex($myIndex + $dest, $parent->SubPages->Count) ) then {
                $parent->SubPages->Collection[$myIndex + $dest]->IsSelected = true;
            }
            return true;
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->SelectedDownOver($this, $i) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub ExpandedChange {
        my $this = shift;
        my ($parent, $myIndex, $expanded) = @_;
        if ( $this->IsSelected ) then {
            if ( !$this->IsExpanded ) then {
                if ( !$expanded ) then {
                    if ( $this->validIndex($myIndex) ) then {
                        $parent->IsSelected = true;
                    }
                } else {
                    $this->IsExpanded = $expanded;
                }
            } else {
                if ( !$expanded ) then {
                    $this->IsExpanded = $expanded;
                } else {
                    if ( $this->SubPages->Count > 0 ) then {
                        $this->SubPages->Collection[0]->IsSelected = true;
                    }
                }
            }
            return true;
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->ExpandedChange($this, $i, $expanded) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub Create {
        my $this = shift;
        my ($parent, $myIndex, $dest) = @_;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) ) then {
                my $page = TLPage->new("", "", $this->root, $this->Settings);
                $parent->SubPages->Insert($myIndex + $dest, $page);
                $page->IsSelected = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->Create($this, $i, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub CreateRight {
        my $this = shift;
        my ($parent, $myIndex, $destTop) = @_;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) ) then {
                my $page = TLPage->new("", "", $this->root, $this->Settings);
                if ( $destTop ) then {
                    $this->SubPages->Insert(0, $page);
                } else {
                    $this->SubPages->Add($page);
                }
                $this->IsExpanded = true;
                $page->IsSelected = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->CreateRight($this, $i, $destTop) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub Delete {
        my $this = shift;
        my ($parent, $myIndex) = @_;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) ) then {
                $parent->SubPages->RemoveAt($myIndex);
                if ( $this->validIndex($myIndex, $this->SubPages->Count) ) then {
                    $parent->SubPages->Collection[$myIndex]->IsSelected = true;
                } else {
                    if ( $this->validIndex($myIndex - 1) ) then {
                        $parent->SubPages->Collection[$myIndex - 1]->IsSelected = true;
                    } else {                    }
                }
                return true;
            }
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->Delete($this, $i) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub Clone {
        my $this = shift;
        my $page = TLPage->new($this->Title, $this->Text, $this->root, $this->Settings);
        for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
            my $subpage = $this->SubPages->Collection[$i]->Clone();
            $page->SubPages->Add($subpage);
        }
        return $page;
    }
    sub Duplicate {
        my $this = shift;
        my ($parent, $myIndex, $dest) = @_;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) ) then {
                my $page = $this->Clone();
                $parent->SubPages->Insert($myIndex + $dest, $page);
                $page->IsSelected = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->Duplicate($this, $i, $dest) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub DuplicateRight {
        my $this = shift;
        my ($parent, $myIndex, $destTop) = @_;
        if ( $this->IsSelected ) then {
            if ( $this->validIndex($myIndex) ) then {
                my $page = $this->Clone();
                if ( $destTop ) then {
                    $this->SubPages->Insert(0, $page);
                } else {
                    $this->SubPages->Add($page);
                }
                $this->IsExpanded = true;
                $page->IsSelected = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                if ( $subpage->DuplicateRight($this, $i, $destTop) ) then {
                    return true;
                }
            }
        }
        return false;
    }
    sub create_text {
        my $this = shift;
        my ($doc, $name, $text) = @_;
        my $element = $doc->createElement($name);
        my $content = $doc->createTextNode($text);
        $element->appendChild($content);
        return $element;
    }
    sub ToXml {
        my $this = shift;
        my ($doc) = @_;
        my $page = $doc->createElement("page");
        $page->appendChild($this->create_text($doc, "title", $this->Title));
        $page->appendChild($this->create_text($doc, "text", $this->text));
        my $subpages = $doc->createElement("subpages");
        $page->appendChild($subpages);
        for ( my $p of $this->SubPages->Collection ) {
            if ( $this->Settings->PageLoad ) then {
                my $subpage = $doc->createElement("page");
                $subpage->appendChild($this->create_text($doc, "title", $p->Title));
                $subpages->appendChild($subpage);
            } else {
                $subpages->appendChild($p->ToXml($doc));
            }
        }
        return $page;
    }
    sub ToJSON {
        my $this = shift;
        my $subpages = Array->new();
        for ( my $p of $this->SubPages->Collection ) {
            if ( $this->Settings->PageLoad ) then {
                $subpages->push({my "Title" = $p->Title});
            } else {
                $subpages->push($p->ToJSON());
            }
        }
        return {my "Title" = $this->Title, my "Text" = $this->Text, my "SubPages" = $subpages}
    }
    sub find_element {
        my $this = shift;
        my ($parent, $name) = @_;
        if ( $parent->hasChildNodes ) then {
            for ( my $i = 0; $i < $parent->childNodes->length; $i++ ) {
                my $child = $parent->childNodes[$i];
                if ( $child->nodeType == $Node->ELEMENT_NODE && $child->nodeName == $name ) then {
                    return $Element $child;
                }
            }
        }
        return null;
    }
    sub get_text {
        my $this = shift;
        my ($parent, $name) = @_;
        my $element = $this->find_element($parent, $name);
        return $element->textContent;
    }
    sub FromXml {
        my $this = shift;
        my ($element) = @_;
        $this->Title = $this->get_text($element, "title");
        my $fileelement = $this->find_element($element, "file");
        if ( $fileelement != null ) then {
            $this->loaded = false;
            $this->filename = $fileelement->textContent;
        } else {
            my $subpages = $this->find_element($element, "subpages");
            if ( $subpages != null ) then {
                $this->loaded = true;
                $this->filename = "";
                $this->Text = $this->get_text($element, "text");
                for ( my $i = 0; $i < $subpages->childNodes->length; $i++ ) {
                    my $child = $subpages->childNodes[$i];
                    if ( $child->nodeType == $Node->ELEMENT_NODE ) then {
                        my $page = TLPage->new("", "", $this->root, $this->Settings);
                        $page->FromXml($Element $child);
                        $this->SubPages->Add($page);
                    }
                }
            } else {
                $this->loaded = false;
                $this->filename = "";
            }
        }
    }
    sub FromJSON {
        my $this = shift;
        my ($obj) = @_;
        $this->Title = $obj["Title"];
        my $file = $obj["File"];
        if ( $file != null ) then {
            $this->loaded = false;
            $this->filename = $file;
        } else {
            my $subpages = $obj["SubPages"];
            if ( $subpages != null ) then {
                $this->loaded = true;
                $this->filename = "";
                $this->Text = $obj["Text"];
                for ( my $i = 0; $i < $subpages->length; $i++ ) {
                    my $child = $subpages[$i];
                    my $page = TLPage->new("", "", $this->root, $this->Settings);
                    $page->FromJSON($child);
                    $this->SubPages->Add($page);
                }
            } else {
                $this->loaded = false;
                $this->filename = "";
            }
        }
    }
    my $pagePath;
    sub getPagePath {
        my $this = shift;
        return $this->pagePath;
    }
    sub getPageByPath {
        my $this = shift;
        my ($path) = @_;
        if ( $path->length == 0 ) then {
            return $this;
        } else {
            my $index = &Number($path[0]);
            if ( $index >= 0 && $index < $this->SubPages->Count ) then {
                return $this->SubPages->Collection[$index]->getPageByPath($path->slice(1));
            }
        }
        return null;
    }
    sub getPageByPathString {
        my $this = shift;
        my ($path) = @_;
        return $this->getPageByPath($path->split("/")->slice(1));
    }
    sub setPath {
        my $this = shift;
        my ($path) = @_;
        $this->pagePath = $path;
        if ( $this->loaded ) then {
            for ( my $i = 0; $i < $this->SubPages->Count; $i++ ) {
                my $subpage = $this->SubPages->Collection[$i];
                $subpage->setPath($path + "/" + &String($i));
            }
        }
    }
    sub loadPageFile {
        my $this = shift;
        if ( !$this->loaded ) then {
            if ( $this->filename != "" ) then {
                $this->Load($this->filename);
            } else {
                $this->root->setPath("0");
                $this->Load("tlcom.command?name=getpage&path=" + $this->pagePath);
            }
            $this->loaded = true;
            $this->filename = "";
        }
    }
    sub get_ext {
        my $this = shift;
        my ($file) = @_;
        my $index = $file->lastIndexOf(".");
        if ( $index >= 0 ) then {
            return $file->substring($index + 1);
        }
        return "";
    }
    sub Load {
        my $this = shift;
        my ($path) = @_;
        if ( $this->get_ext($path) == "xml" ) then {
            $this->LoadXML($path);
        } else {
            $this->LoadJSON($path);
        }
    }
    sub LoadXML {
        my $this = shift;
        my ($path) = @_;
        my $request = XMLHttpRequest->new();
        $request->open("GET", $path, false);
        $request->send(null);
        my $doc = $request->responseXML;
        $this->FromXml($doc->documentElement);
    }
    sub LoadJSON {
        my $this = shift;
        my ($path) = @_;
        my $request = XMLHttpRequest->new();
        $request->open("GET", $path, false);
        $request->send(null);
        $this->FromJSON($JSON->parse($request->responseText));
    }
    sub Save {
        my $this = shift;
        my ($path) = @_;
    }
    sub StartsWith {
        my $this = shift;
        my ($str, $header) = @_;
        return $str->length >= $header->length && $str->substr(0, $header->length) == $header;
    }
    sub splitSections {
        my $this = shift;
        my ($sections, $header) = @_;
        my $result = Array->new();
        my $chapter = null;
        for ( my $section of $sections ) {
            if ( $this->StartsWith($section, $header) ) then {
                if ( $chapter == null ) then {
                    $chapter = Array->new();
                }
                $chapter->push($section->substring(1));
            } else {
                if ( $chapter != null ) then {
                    $result->push($chapter);
                }
                $chapter = Array->new();
                $chapter->push($section);
            }
        }
        if ( $chapter != null ) then {
            $result->push($chapter);
        }
        return $result;
    }
    sub FromText {
        my $this = shift;
        my ($sections, $header) = @_;
        if ( $sections->length > 0 ) then {
            $this->Text = $sections[0];
            my $sections2 = $sections->slice(1);
            for ( my $chapter of $this->splitSections($sections2, $header) ) {
                my $page = TLPage->new("", "", $this->root, $this->Settings);
                $page->FromText($chapter, $header);
                $this->SubPages->Add($page);
            }
        }
    }
1;
