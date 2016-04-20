package TLPageCollection;
    my $Collection;
    sub new {
        my $class = shift;
        my $self = {
            "Collection" => $Collection
        };
        $self->{Collection} = Array->new();
        return bless $self, $class;
    }
    sub get_Count {
        my $self = shift;
        return $self->{Collection}->{length};
    }
    sub Last {
        my $self = shift;
        return $self->{Collection}[$self->{Collection}->{length} - 1];
    }
    sub RemoveAt {
        my $self = shift;
        my ($index) = @_;
        $self->{Collection}->splice($index, 1);
    }
    sub Insert {
        my $self = shift;
        my ($index, $page) = @_;
        $self->{Collection}->splice($index, 0, $page);
    }
    sub Add {
        my $self = shift;
        my ($page) = @_;
        $self->{Collection}->push($page);
    }
    sub Clear {
        my $self = shift;
        $self->{Collection} = Array->new();
    }
1;
package TLPage;
    sub new {
        my $class = shift;
        my ($title, $text, $root, $Settings) = @_;
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
        };
        $self->{title} = $title;
        $self->{text} = $text;
        $self->{root} = $root;
        $self->{SubPages} = TLPageCollection->new();
        $self->{loaded} = true;
        $self->{filename} = "";
        $self->{pagePath} = "";
        return bless $self, $class;
    }
    my $loaded;
    my $filename;
    my $root;
    my $SubPages;
    sub UnselectAll {
        my $self = shift;
        $self->{IsSelected} = false;
        for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
            $self->{SubPages}->{Collection}[$i]->UnselectAll();
        }
    }
    sub getLine {
        my $self = shift;
        my ($text) = @_;
        my $r = $text->indexOf("\r");
        my $n = $text->indexOf("\n");
        if ( $r >= 0 ) {
            if ( $n >= 0 ) {
                return $text->substring(0, $Math->min($r, $n));
            } else {
                return $text->substring(0, $r);
            }
        } else {
            if ( $n >= 0 ) {
                return $text->substring(0, $n);
            } else {
                return $text;
            }
        }
    }
    my $title = "";
    sub getTitle {
        my $self = shift;
        my ($text) = @_;
        if ( $self->{Settings}->{NoTitle} ) {
            my $line = $self->getLine($text);
            if ( $line->{length} <= $self->{Settings}->{TitleLength} ) {
                return $line;
            } else {
                return $line->substring(0, $self->{Settings}->{TitleLength});
            }
        } else {
            return $self->{title};
        }
    }
    sub get_Title {
        my $self = shift;
        my $title = $self->getTitle($self->{text});
        if ( $title == "" ) {
            if ( $self->{title} != "" ) {
                return $self->{title};
            }
            return "タイトルなし";
        } else {
            return $title;
        }
    }
    sub set_Title {
        my $self = shift;
        my ($title) = @_;
        $self->{title} = $title;
    }
    my $text = "";
    sub get_Text {
        my $self = shift;
        $self->loadPageFile();
        return $self->{text};
    }
    sub set_Text {
        my $self = shift;
        my ($value) = @_;
        $self->{text} = $value;
    }
    my $isSelected = false;
    my $isExpanded = false;
    sub get_IsSelected {
        my $self = shift;
        return $self->{isSelected};
    }
    sub set_IsSelected {
        my $self = shift;
        my ($value) = @_;
        $self->{isSelected} = $value;
    }
    sub get_IsExpanded {
        my $self = shift;
        return $self->{isExpanded};
    }
    sub set_IsExpanded {
        my $self = shift;
        my ($value) = @_;
        if ( $value ) {
            $self->loadPageFile();
        }
        $self->{isExpanded} = $value;
    }
    sub CanExpand {
        my $self = shift;
        return !$self->{IsExpanded} && !$self->{loaded} || $self->{SubPages}->{Count} > 0;
    }
    sub get_SelectedPage_ {
        my $self = shift;
        if ( $self->{IsSelected} ) {
            return $self;
        } else {
            foreach my $page ( $self->{SubPages}->{Collection} ) {
                my $selectedPage = $page->{SelectedPage_};
                if ( $selectedPage != null ) {
                    return $selectedPage;
                }
            }
        }
        return null;
    }
    sub validIndex {
        my $self = shift;
        my ($index, $count) = @_;
    }
    sub validIndex {
        my $self = shift;
        my ($index) = @_;
    }
    sub validIndex {
        my $self = shift;
        my ($index, $count ?) = @_;
        if ( $count != null ) {
            return $index >= 0 && $index < $count;
        } else {
            return $index >= 0;
        }
    }
    sub MoveLeft {
        my $self = shift;
        my ($parent, $myIndex, $parentparent, $parentIndex, $dest) = @_;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) && $self->validIndex($parentIndex) ) {
                $parent->{SubPages}->RemoveAt($myIndex);
                $parentparent->{SubPages}->Insert($parentIndex + $dest, $self);
                return true;
            }
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->MoveLeft($self, $i, $parent, $myIndex, $dest) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub MoveRight {
        my $self = shift;
        my ($parent, $myIndex, $destBefore, $destAfter, $destTop) = @_;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) && $self->validIndex($myIndex + $destBefore, $parent->{SubPages}->{Count}) ) {
                $parent->{SubPages}->RemoveAt($myIndex);
                if ( $destTop ) {
                    $parent->{SubPages}->{Collection}[$myIndex + $destAfter]->{SubPages}->Insert(0, $self);
                } else {
                    $parent->{SubPages}->{Collection}[$myIndex + $destAfter]->{SubPages}->Add($self);
                }
                if ( !$parent->{SubPages}->{Collection}[$myIndex + $destAfter]->{IsExpanded} ) {
                    $parent->{SubPages}->{Collection}[$myIndex + $destAfter]->{IsExpanded} = true;
                }
                return true;
            }
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->MoveRight($self, $i, $destBefore, $destAfter, $destTop) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub Move {
        my $self = shift;
        my ($parent, $myIndex, $dest) = @_;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) && $self->validIndex($myIndex + $dest, $parent->{SubPages}->{Count}) ) {
                $parent->{SubPages}->RemoveAt($myIndex);
                $parent->{SubPages}->Insert($myIndex + $dest, $self);
                return true;
            }
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->Move($self, $i, $dest) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub SelectedMove {
        my $self = shift;
        my ($parent, $myIndex, $dest) = @_;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) && $myIndex + $dest == - 1 ) {
                $parent->{IsSelected} = true;
            } elsif ( $self->validIndex($myIndex) && $myIndex + $dest == $parent->{SubPages}->{Count} ) {
                $parent->{IsSelected} = true;
                $self->{root}->SelectedDownOver(null, - 1);
            } elsif ( $self->{IsExpanded} && $dest == 1 ) {
                if ( $self->{SubPages}->{Count} > 0 ) {
                    $self->{SubPages}->{Collection}[0]->{IsSelected} = true;
                }
            } elsif ( $self->validIndex($myIndex) && $self->validIndex($myIndex + $dest, $parent->{SubPages}->{Count}) ) {
                if ( $dest == - 1 ) {
                    $parent->{SubPages}->{Collection}[$myIndex + $dest]->SelectLastExpandedItem();
                } else {
                    $parent->{SubPages}->{Collection}[$myIndex + $dest]->{IsSelected} = true;
                }
            }
            return true;
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->SelectedMove($self, $i, $dest) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub SelectLastExpandedItem {
        my $self = shift;
        if ( $self->{IsExpanded} && $self->{SubPages}->{Count} > 0 ) {
            $self->{SubPages}->Last()->SelectLastExpandedItem();
        } else {
            $self->{IsSelected} = true;
        }
    }
    sub SelectedDownOver {
        my $self = shift;
        my ($parent, $myIndex) = @_;
        my $dest = 1;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) && $myIndex + $dest == $parent->{SubPages}->{Count} ) {
                $parent->{IsSelected} = true;
                $self->{root}->SelectedDownOver(null, - 1);
            } elsif ( $self->validIndex($myIndex) && $self->validIndex($myIndex + $dest, $parent->{SubPages}->{Count}) ) {
                $parent->{SubPages}->{Collection}[$myIndex + $dest]->{IsSelected} = true;
            }
            return true;
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->SelectedDownOver($self, $i) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub ExpandedChange {
        my $self = shift;
        my ($parent, $myIndex, $expanded) = @_;
        if ( $self->{IsSelected} ) {
            if ( !$self->{IsExpanded} ) {
                if ( !$expanded ) {
                    if ( $self->validIndex($myIndex) ) {
                        $parent->{IsSelected} = true;
                    }
                } else {
                    $self->{IsExpanded} = $expanded;
                }
            } else {
                if ( !$expanded ) {
                    $self->{IsExpanded} = $expanded;
                } else {
                    if ( $self->{SubPages}->{Count} > 0 ) {
                        $self->{SubPages}->{Collection}[0]->{IsSelected} = true;
                    }
                }
            }
            return true;
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->ExpandedChange($self, $i, $expanded) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub Create {
        my $self = shift;
        my ($parent, $myIndex, $dest) = @_;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) ) {
                my $page = TLPage->new("", "", $self->{root}, $self->{Settings});
                $parent->{SubPages}->Insert($myIndex + $dest, $page);
                $page->{IsSelected} = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->Create($self, $i, $dest) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub CreateRight {
        my $self = shift;
        my ($parent, $myIndex, $destTop) = @_;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) ) {
                my $page = TLPage->new("", "", $self->{root}, $self->{Settings});
                if ( $destTop ) {
                    $self->{SubPages}->Insert(0, $page);
                } else {
                    $self->{SubPages}->Add($page);
                }
                $self->{IsExpanded} = true;
                $page->{IsSelected} = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->CreateRight($self, $i, $destTop) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub Delete {
        my $self = shift;
        my ($parent, $myIndex) = @_;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) ) {
                $parent->{SubPages}->RemoveAt($myIndex);
                if ( $self->validIndex($myIndex, $self->{SubPages}->{Count}) ) {
                    $parent->{SubPages}->{Collection}[$myIndex]->{IsSelected} = true;
                } else {
                    if ( $self->validIndex($myIndex - 1) ) {
                        $parent->{SubPages}->{Collection}[$myIndex - 1]->{IsSelected} = true;
                    } else {                    }
                }
                return true;
            }
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->Delete($self, $i) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub Clone {
        my $self = shift;
        my $page = TLPage->new($self->{Title}, $self->{Text}, $self->{root}, $self->{Settings});
        for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
            my $subpage = $self->{SubPages}->{Collection}[$i]->Clone();
            $page->{SubPages}->Add($subpage);
        }
        return $page;
    }
    sub Duplicate {
        my $self = shift;
        my ($parent, $myIndex, $dest) = @_;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) ) {
                my $page = $self->Clone();
                $parent->{SubPages}->Insert($myIndex + $dest, $page);
                $page->{IsSelected} = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->Duplicate($self, $i, $dest) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub DuplicateRight {
        my $self = shift;
        my ($parent, $myIndex, $destTop) = @_;
        if ( $self->{IsSelected} ) {
            if ( $self->validIndex($myIndex) ) {
                my $page = $self->Clone();
                if ( $destTop ) {
                    $self->{SubPages}->Insert(0, $page);
                } else {
                    $self->{SubPages}->Add($page);
                }
                $self->{IsExpanded} = true;
                $page->{IsSelected} = true;
                return true;
            }
        } else {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                if ( $subpage->DuplicateRight($self, $i, $destTop) ) {
                    return true;
                }
            }
        }
        return false;
    }
    sub create_text {
        my $self = shift;
        my ($doc, $name, $text) = @_;
        my $element = $doc->createElement($name);
        my $content = $doc->createTextNode($text);
        $element->appendChild($content);
        return $element;
    }
    sub ToXml {
        my $self = shift;
        my ($doc) = @_;
        my $page = $doc->createElement("page");
        $page->appendChild($self->create_text($doc, "title", $self->{Title}));
        $page->appendChild($self->create_text($doc, "text", $self->{text}));
        my $subpages = $doc->createElement("subpages");
        $page->appendChild($subpages);
        foreach my $p ( $self->{SubPages}->{Collection} ) {
            if ( $self->{Settings}->{PageLoad} ) {
                my $subpage = $doc->createElement("page");
                $subpage->appendChild($self->create_text($doc, "title", $p->{Title}));
                $subpages->appendChild($subpage);
            } else {
                $subpages->appendChild($p->ToXml($doc));
            }
        }
        return $page;
    }
    sub ToJSON {
        my $self = shift;
        my $subpages = Array->new();
        foreach my $p ( $self->{SubPages}->{Collection} ) {
            if ( $self->{Settings}->{PageLoad} ) {
                $subpages->push({"Title" => $p->{Title}});
            } else {
                $subpages->push($p->ToJSON());
            }
        }
        return {"Title" => $self->{Title}, "Text" => $self->{Text}, "SubPages" => $subpages};
    }
    sub find_element {
        my $self = shift;
        my ($parent, $name) = @_;
        if ( $parent->{hasChildNodes} ) {
            for ( my $i = 0; $i < $parent->{childNodes}->{length}; $i++ ) {
                my $child = $parent->{childNodes}[$i];
                if ( $child->{nodeType} == $Node->{ELEMENT_NODE} && $child->{nodeName} == $name ) {
                    return $child;
                }
            }
        }
        return null;
    }
    sub get_text {
        my $self = shift;
        my ($parent, $name) = @_;
        my $element = $self->find_element($parent, $name);
        return $element->{textContent};
    }
    sub FromXml {
        my $self = shift;
        my ($element) = @_;
        $self->{Title} = $self->get_text($element, "title");
        my $fileelement = $self->find_element($element, "file");
        if ( $fileelement != null ) {
            $self->{loaded} = false;
            $self->{filename} = $fileelement->{textContent};
        } else {
            my $subpages = $self->find_element($element, "subpages");
            if ( $subpages != null ) {
                $self->{loaded} = true;
                $self->{filename} = "";
                $self->{Text} = $self->get_text($element, "text");
                for ( my $i = 0; $i < $subpages->{childNodes}->{length}; $i++ ) {
                    my $child = $subpages->{childNodes}[$i];
                    if ( $child->{nodeType} == $Node->{ELEMENT_NODE} ) {
                        my $page = TLPage->new("", "", $self->{root}, $self->{Settings});
                        $page->FromXml($child);
                        $self->{SubPages}->Add($page);
                    }
                }
            } else {
                $self->{loaded} = false;
                $self->{filename} = "";
            }
        }
    }
    sub FromJSON {
        my $self = shift;
        my ($obj) = @_;
        $self->{Title} = $obj["Title"];
        my $file = $obj["File"];
        if ( $file != null ) {
            $self->{loaded} = false;
            $self->{filename} = $file;
        } else {
            my $subpages = $obj["SubPages"];
            if ( $subpages != null ) {
                $self->{loaded} = true;
                $self->{filename} = "";
                $self->{Text} = $obj["Text"];
                for ( my $i = 0; $i < $subpages->{length}; $i++ ) {
                    my $child = $subpages[$i];
                    my $page = TLPage->new("", "", $self->{root}, $self->{Settings});
                    $page->FromJSON($child);
                    $self->{SubPages}->Add($page);
                }
            } else {
                $self->{loaded} = false;
                $self->{filename} = "";
            }
        }
    }
    my $pagePath;
    sub getPagePath {
        my $self = shift;
        return $self->{pagePath};
    }
    sub getPageByPath {
        my $self = shift;
        my ($path) = @_;
        if ( $path->{length} == 0 ) {
            return $self;
        } else {
            my $index = &Number($path[0]);
            if ( $index >= 0 && $index < $self->{SubPages}->{Count} ) {
                return $self->{SubPages}->{Collection}[$index]->getPageByPath($path->slice(1));
            }
        }
        return null;
    }
    sub getPageByPathString {
        my $self = shift;
        my ($path) = @_;
        return $self->getPageByPath($path->split("/")->slice(1));
    }
    sub setPath {
        my $self = shift;
        my ($path) = @_;
        $self->{pagePath} = $path;
        if ( $self->{loaded} ) {
            for ( my $i = 0; $i < $self->{SubPages}->{Count}; $i++ ) {
                my $subpage = $self->{SubPages}->{Collection}[$i];
                $subpage->setPath($path + "/" + &String($i));
            }
        }
    }
    sub loadPageFile {
        my $self = shift;
        if ( !$self->{loaded} ) {
            if ( $self->{filename} != "" ) {
                $self->Load($self->{filename});
            } else {
                $self->{root}->setPath("0");
                $self->Load("tlcom.command?name=getpage&path=" + $self->{pagePath});
            }
            $self->{loaded} = true;
            $self->{filename} = "";
        }
    }
    sub get_ext {
        my $self = shift;
        my ($file) = @_;
        my $index = $file->lastIndexOf(".");
        if ( $index >= 0 ) {
            return $file->substring($index + 1);
        }
        return "";
    }
    sub Load {
        my $self = shift;
        my ($path) = @_;
        if ( $self->get_ext($path) == "xml" ) {
            $self->LoadXML($path);
        } else {
            $self->LoadJSON($path);
        }
    }
    sub LoadXML {
        my $self = shift;
        my ($path) = @_;
        my $request = XMLHttpRequest->new();
        $request->open("GET", $path, false);
        $request->send(null);
        my $doc = $request->{responseXML};
        $self->FromXml($doc->{documentElement});
    }
    sub LoadJSON {
        my $self = shift;
        my ($path) = @_;
        my $request = XMLHttpRequest->new();
        $request->open("GET", $path, false);
        $request->send(null);
        $self->FromJSON($JSON->parse($request->{responseText}));
    }
    sub Save {
        my $self = shift;
        my ($path) = @_;
    }
    sub StartsWith {
        my $self = shift;
        my ($str, $header) = @_;
        return $str->{length} >= $header->{length} && $str->substr(0, $header->{length}) == $header;
    }
    sub splitSections {
        my $self = shift;
        my ($sections, $header) = @_;
        my $result = Array->new();
        my $chapter = null;
        foreach my $section ( $sections ) {
            if ( $self->StartsWith($section, $header) ) {
                if ( $chapter == null ) {
                    $chapter = Array->new();
                }
                $chapter->push($section->substring(1));
            } else {
                if ( $chapter != null ) {
                    $result->push($chapter);
                }
                $chapter = Array->new();
                $chapter->push($section);
            }
        }
        if ( $chapter != null ) {
            $result->push($chapter);
        }
        return $result;
    }
    sub FromText {
        my $self = shift;
        my ($sections, $header) = @_;
        if ( $sections->{length} > 0 ) {
            $self->{Text} = $sections[0];
            my $sections2 = $sections->slice(1);
            foreach my $chapter ( $self->splitSections($sections2, $header) ) {
                my $page = TLPage->new("", "", $self->{root}, $self->{Settings});
                $page->FromText($chapter, $header);
                $self->{SubPages}->Add($page);
            }
        }
    }
1;
