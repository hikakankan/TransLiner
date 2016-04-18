package TLRootPage;
use base qw(TLPage);
    sub new {
        my $class = shift;
        my ($title, $text, $settings) = @_;
        super($title, $text, null, $settings);
        $this->root = $this;
        my $self = {
            "serverSide" => $serverSide
        }
        return bless $self, $class;
    }
    sub get_SelectedPage {
        my $this = shift;
        return $this->SelectedPage_;
    }
    sub set_SelectedPage {
        my $this = shift;
        my ($page) = @_;
        $this->UnselectAll();
        $page->IsSelected = true;
    }
    sub get_SelectedText {
        my $this = shift;
        my $selectedPage = $this->SelectedPage;
        if ( $selectedPage != null ) then {
            return $selectedPage->Text;
        }
        return "";
    }
    sub set_SelectedText {
        my $this = shift;
        my ($value) = @_;
        my $selectedPage = $this->SelectedPage;
        if ( $selectedPage != null ) then {
            $selectedPage->Text = $value;
        }
    }
    my $serverSide = false;
    sub execCommand {
        my $this = shift;
        my ($command, $actual_proc) = @_;
        if ( $this->Settings->NoServer || $this->serverSide ) then {
            return &actual_proc();
        } else {
            $this->setPath("0");
            my $path = $this->SelectedPage->getPagePath();
            my $request = XMLHttpRequest->new();
            $request->open("GET", "tlcom.command?name=" + $command + "&path=" + $path, false);
            $request->send(null);
            return $request->responseText == "true" && &actual_proc();
        }
    }
    sub receiveCommand {
        my $this = shift;
        my ($command) = @_;
        if ( $command == "MoveLeftUp" ) then {
            return $this->MoveLeftUp_();
        } else if ( $command == "MoveLeftDown" ) then {
            return $this->MoveLeftDown_();
        } else if ( $command == "MoveUpRightTop" ) then {
            return $this->MoveUpRightTop_();
        } else if ( $command == "MoveUpRightBottom" ) then {
            return $this->MoveUpRightBottom_();
        } else if ( $command == "MoveDownRightTop" ) then {
            return $this->MoveDownRightTop_();
        } else if ( $command == "MoveDownRightBottom" ) then {
            return $this->MoveDownRightBottom_();
        } else if ( $command == "MoveUp" ) then {
            return $this->MoveUp_();
        } else if ( $command == "MoveDown" ) then {
            return $this->MoveDown_();
        } else if ( $command == "CreateUp" ) then {
            return $this->CreateUp_();
        } else if ( $command == "CreateDown" ) then {
            return $this->CreateDown_();
        } else if ( $command == "CreateRightTop" ) then {
            return $this->CreateRightTop_();
        } else if ( $command == "CreateRightBottom" ) then {
            return $this->CreateRightBottom_();
        } else if ( $command == "DuplicateUp" ) then {
            return $this->DuplicateUp_();
        } else if ( $command == "DuplicateDown" ) then {
            return $this->DuplicateDown_();
        } else if ( $command == "DuplicateRightTop" ) then {
            return $this->DuplicateRightTop_();
        } else if ( $command == "DuplicateRightBottom" ) then {
            return $this->DuplicateRightBottom_();
        } else if ( $command == "DeleteSelectedItem" ) then {
            return $this->DeleteSelectedItem_();
        } else if ( $command == "Expand" ) then {
            return $this->Expand_();
        } else if ( $command == "Unexpand" ) then {
            return $this->Unexpand_();
        }
        return false;
    }
    sub MoveLeftUp_ {
        my $this = shift;
        return $this->MoveLeft(null, - 1, null, - 1, 0);
    }
    sub MoveLeftUp {
        my $this = shift;
        return $this->execCommand("MoveLeftUp", () => $this->MoveLeftUp_());
    }
    sub MoveLeftDown_ {
        my $this = shift;
        return $this->MoveLeft(null, - 1, null, - 1, 1);
    }
    sub MoveLeftDown {
        my $this = shift;
        return $this->execCommand("MoveLeftDown", () => $this->MoveLeftDown_());
    }
    sub MoveUpRightTop_ {
        my $this = shift;
        return $this->MoveRight(null, - 1, - 1, - 1, true);
    }
    sub MoveUpRightTop {
        my $this = shift;
        return $this->execCommand("MoveUpRightTop", () => $this->MoveUpRightTop_());
    }
    sub MoveUpRightBottom_ {
        my $this = shift;
        return $this->MoveRight(null, - 1, - 1, - 1, false);
    }
    sub MoveUpRightBottom {
        my $this = shift;
        return $this->execCommand("MoveUpRightBottom", () => $this->MoveUpRightBottom_());
    }
    sub MoveDownRightTop_ {
        my $this = shift;
        return $this->MoveRight(null, - 1, 1, 0, true);
    }
    sub MoveDownRightTop {
        my $this = shift;
        return $this->execCommand("MoveDownRightTop", () => $this->MoveDownRightTop_());
    }
    sub MoveDownRightBottom_ {
        my $this = shift;
        return $this->MoveRight(null, - 1, 1, 0, false);
    }
    sub MoveDownRightBottom {
        my $this = shift;
        return $this->execCommand("MoveDownRightBottom", () => $this->MoveDownRightBottom_());
    }
    sub MoveUp_ {
        my $this = shift;
        return $this->Move(null, - 1, - 1) || $this->MoveLeftUp_();
    }
    sub MoveUp {
        my $this = shift;
        return $this->execCommand("MoveUp", () => $this->MoveUp_());
    }
    sub MoveDown_ {
        my $this = shift;
        return $this->Move(null, - 1, 1) || $this->MoveLeftDown_();
    }
    sub MoveDown {
        my $this = shift;
        return $this->execCommand("MoveDown", () => $this->MoveDown_());
    }
    sub CreateUp_ {
        my $this = shift;
        return $this->Create(null, - 1, 0);
    }
    sub CreateUp {
        my $this = shift;
        return $this->execCommand("CreateUp", () => $this->CreateUp_());
    }
    sub CreateDown_ {
        my $this = shift;
        return $this->Create(null, - 1, 1);
    }
    sub CreateDown {
        my $this = shift;
        return $this->execCommand("CreateDown", () => $this->CreateDown_());
    }
    sub CreateRightTop_ {
        my $this = shift;
        return $this->CreateRight(null, - 1, true);
    }
    sub CreateRightTop {
        my $this = shift;
        return $this->execCommand("CreateRightTop", () => $this->CreateRightTop_());
    }
    sub CreateRightBottom_ {
        my $this = shift;
        return $this->CreateRight(null, - 1, false);
    }
    sub CreateRightBottom {
        my $this = shift;
        return $this->execCommand("CreateRightBottom", () => $this->CreateRightBottom_());
    }
    sub DuplicateUp_ {
        my $this = shift;
        return $this->Duplicate(null, - 1, 0);
    }
    sub DuplicateUp {
        my $this = shift;
        return $this->execCommand("DuplicateUp", () => $this->DuplicateUp_());
    }
    sub DuplicateDown_ {
        my $this = shift;
        return $this->Duplicate(null, - 1, 1);
    }
    sub DuplicateDown {
        my $this = shift;
        return $this->execCommand("DuplicateDown", () => $this->DuplicateDown_());
    }
    sub DuplicateRightTop_ {
        my $this = shift;
        return $this->DuplicateRight(null, - 1, true);
    }
    sub DuplicateRightTop {
        my $this = shift;
        return $this->execCommand("DuplicateRightTop", () => $this->DuplicateRightTop_());
    }
    sub DuplicateRightBottom_ {
        my $this = shift;
        return $this->DuplicateRight(null, - 1, false);
    }
    sub DuplicateRightBottom {
        my $this = shift;
        return $this->execCommand("DuplicateRightBottom", () => $this->DuplicateRightBottom_());
    }
    sub DeleteSelectedItem_ {
        my $this = shift;
        return $this->Delete(null, - 1);
    }
    sub DeleteSelectedItem {
        my $this = shift;
        return $this->execCommand("DeleteSelectedItem", () => $this->DeleteSelectedItem_());
    }
    sub SelectedUp {
        my $this = shift;
        return $this->SelectedMove(null, - 1, - 1);
    }
    sub SelectedDown {
        my $this = shift;
        return $this->SelectedMove(null, - 1, 1);
    }
    sub Expand_ {
        my $this = shift;
        return $this->ExpandedChange(null, - 1, true);
    }
    sub Expand {
        my $this = shift;
        return $this->Expand_();
    }
    sub Unexpand_ {
        my $this = shift;
        return $this->ExpandedChange(null, - 1, false);
    }
    sub Unexpand {
        my $this = shift;
        return $this->Unexpand_();
    }
    sub loadXML {
        my $this = shift;
        my ($xml) = @_;
        $this->IsExpanded = false;
        $this->SubPages->Clear();
        $this->FromXml($xml);
    }
    sub loadJSON {
        my $this = shift;
        my ($obj) = @_;
        $this->IsExpanded = false;
        $this->SubPages->Clear();
        $this->FromJSON($obj);
    }
    sub loadText {
        my $this = shift;
        my ($text, $path) = @_;
        $this->IsExpanded = false;
        $this->SubPages->Clear();
        $this->FromText2($text, ".", $path);
    }
    sub GetFileNameWithoutExtension {
        my $this = shift;
        my ($path) = @_;
        my $index_sep = $path->lastIndexOf("\\");
        if ( $index_sep >= 0 ) then {
            $path = $path->substring($index_sep + 1);
        }
        my $index_ext = $path->lastIndexOf(".");
        if ( $index_ext >= 0 ) then {
            $path = $path->substring(0, $index_ext);
        }
        return $path;
    }
    sub makeSections {
        my $this = shift;
        my ($text, $header, $path) = @_;
        my $result = Array->new();
        my $sections = $text->split("\r\n" + $header);
        my $first = true;
        for ( my $section of $sections ) {
            if ( $first && $section->length > 0 ) then {
                if ( $this->StartsWith($section, $header) ) then {
                    $result->push($this->GetFileNameWithoutExtension($path));
                    $result->push($section->substring(1));
                } else {
                    $result->push($section);
                }
            } else {
                $result->push($section);
            }
            $first = false;
        }
        return $result;
    }
    sub FromText2 {
        my $this = shift;
        my ($text, $header, $path) = @_;
        $this->FromText($this->makeSections($text, $header, $path), $header);
    }
1;
