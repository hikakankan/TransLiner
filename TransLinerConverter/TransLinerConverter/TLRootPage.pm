package TLRootPage;
use base qw(TLPage);
    sub new {
        my $class = shift;
        my ($title, $text, $settings) = @_;
        my $self = {
            "serverSide" => $serverSide
        };
        super($title, $text, null, $settings);
        $self->{root} = $self;
        return bless $self, $class;
    }
    sub get_SelectedPage {
        my $self = shift;
        return $self->{SelectedPage_};
    }
    sub set_SelectedPage {
        my $self = shift;
        my ($page) = @_;
        $self->UnselectAll();
        $page->{IsSelected} = true;
    }
    sub get_SelectedText {
        my $self = shift;
        my $selectedPage = $self->{SelectedPage};
        if ( $selectedPage != null ) {
            return $selectedPage->{Text};
        }
        return "";
    }
    sub set_SelectedText {
        my $self = shift;
        my ($value) = @_;
        my $selectedPage = $self->{SelectedPage};
        if ( $selectedPage != null ) {
            $selectedPage->{Text} = $value;
        }
    }
    my $serverSide = false;
    sub execCommand {
        my $self = shift;
        my ($command, $actual_proc) = @_;
        if ( $self->{Settings}->{NoServer} || $self->{serverSide} ) {
            return &actual_proc();
        } else {
            $self->setPath("0");
            my $path = $self->{SelectedPage}->getPagePath();
            my $request = XMLHttpRequest->new();
            $request->open("GET", "tlcom.command?name=" + $command + "&path=" + $path, false);
            $request->send(null);
            return $request->{responseText} == "true" && &actual_proc();
        }
    }
    sub receiveCommand {
        my $self = shift;
        my ($command) = @_;
        if ( $command == "MoveLeftUp" ) {
            return $self->MoveLeftUp_();
        } elsif ( $command == "MoveLeftDown" ) {
            return $self->MoveLeftDown_();
        } elsif ( $command == "MoveUpRightTop" ) {
            return $self->MoveUpRightTop_();
        } elsif ( $command == "MoveUpRightBottom" ) {
            return $self->MoveUpRightBottom_();
        } elsif ( $command == "MoveDownRightTop" ) {
            return $self->MoveDownRightTop_();
        } elsif ( $command == "MoveDownRightBottom" ) {
            return $self->MoveDownRightBottom_();
        } elsif ( $command == "MoveUp" ) {
            return $self->MoveUp_();
        } elsif ( $command == "MoveDown" ) {
            return $self->MoveDown_();
        } elsif ( $command == "CreateUp" ) {
            return $self->CreateUp_();
        } elsif ( $command == "CreateDown" ) {
            return $self->CreateDown_();
        } elsif ( $command == "CreateRightTop" ) {
            return $self->CreateRightTop_();
        } elsif ( $command == "CreateRightBottom" ) {
            return $self->CreateRightBottom_();
        } elsif ( $command == "DuplicateUp" ) {
            return $self->DuplicateUp_();
        } elsif ( $command == "DuplicateDown" ) {
            return $self->DuplicateDown_();
        } elsif ( $command == "DuplicateRightTop" ) {
            return $self->DuplicateRightTop_();
        } elsif ( $command == "DuplicateRightBottom" ) {
            return $self->DuplicateRightBottom_();
        } elsif ( $command == "DeleteSelectedItem" ) {
            return $self->DeleteSelectedItem_();
        } elsif ( $command == "Expand" ) {
            return $self->Expand_();
        } elsif ( $command == "Unexpand" ) {
            return $self->Unexpand_();
        }
        return false;
    }
    sub MoveLeftUp_ {
        my $self = shift;
        return $self->MoveLeft(null, - 1, null, - 1, 0);
    }
    sub MoveLeftUp {
        my $self = shift;
        return $self->execCommand("MoveLeftUp", () => $self->MoveLeftUp_());
    }
    sub MoveLeftDown_ {
        my $self = shift;
        return $self->MoveLeft(null, - 1, null, - 1, 1);
    }
    sub MoveLeftDown {
        my $self = shift;
        return $self->execCommand("MoveLeftDown", () => $self->MoveLeftDown_());
    }
    sub MoveUpRightTop_ {
        my $self = shift;
        return $self->MoveRight(null, - 1, - 1, - 1, true);
    }
    sub MoveUpRightTop {
        my $self = shift;
        return $self->execCommand("MoveUpRightTop", () => $self->MoveUpRightTop_());
    }
    sub MoveUpRightBottom_ {
        my $self = shift;
        return $self->MoveRight(null, - 1, - 1, - 1, false);
    }
    sub MoveUpRightBottom {
        my $self = shift;
        return $self->execCommand("MoveUpRightBottom", () => $self->MoveUpRightBottom_());
    }
    sub MoveDownRightTop_ {
        my $self = shift;
        return $self->MoveRight(null, - 1, 1, 0, true);
    }
    sub MoveDownRightTop {
        my $self = shift;
        return $self->execCommand("MoveDownRightTop", () => $self->MoveDownRightTop_());
    }
    sub MoveDownRightBottom_ {
        my $self = shift;
        return $self->MoveRight(null, - 1, 1, 0, false);
    }
    sub MoveDownRightBottom {
        my $self = shift;
        return $self->execCommand("MoveDownRightBottom", () => $self->MoveDownRightBottom_());
    }
    sub MoveUp_ {
        my $self = shift;
        return $self->Move(null, - 1, - 1) || $self->MoveLeftUp_();
    }
    sub MoveUp {
        my $self = shift;
        return $self->execCommand("MoveUp", () => $self->MoveUp_());
    }
    sub MoveDown_ {
        my $self = shift;
        return $self->Move(null, - 1, 1) || $self->MoveLeftDown_();
    }
    sub MoveDown {
        my $self = shift;
        return $self->execCommand("MoveDown", () => $self->MoveDown_());
    }
    sub CreateUp_ {
        my $self = shift;
        return $self->Create(null, - 1, 0);
    }
    sub CreateUp {
        my $self = shift;
        return $self->execCommand("CreateUp", () => $self->CreateUp_());
    }
    sub CreateDown_ {
        my $self = shift;
        return $self->Create(null, - 1, 1);
    }
    sub CreateDown {
        my $self = shift;
        return $self->execCommand("CreateDown", () => $self->CreateDown_());
    }
    sub CreateRightTop_ {
        my $self = shift;
        return $self->CreateRight(null, - 1, true);
    }
    sub CreateRightTop {
        my $self = shift;
        return $self->execCommand("CreateRightTop", () => $self->CreateRightTop_());
    }
    sub CreateRightBottom_ {
        my $self = shift;
        return $self->CreateRight(null, - 1, false);
    }
    sub CreateRightBottom {
        my $self = shift;
        return $self->execCommand("CreateRightBottom", () => $self->CreateRightBottom_());
    }
    sub DuplicateUp_ {
        my $self = shift;
        return $self->Duplicate(null, - 1, 0);
    }
    sub DuplicateUp {
        my $self = shift;
        return $self->execCommand("DuplicateUp", () => $self->DuplicateUp_());
    }
    sub DuplicateDown_ {
        my $self = shift;
        return $self->Duplicate(null, - 1, 1);
    }
    sub DuplicateDown {
        my $self = shift;
        return $self->execCommand("DuplicateDown", () => $self->DuplicateDown_());
    }
    sub DuplicateRightTop_ {
        my $self = shift;
        return $self->DuplicateRight(null, - 1, true);
    }
    sub DuplicateRightTop {
        my $self = shift;
        return $self->execCommand("DuplicateRightTop", () => $self->DuplicateRightTop_());
    }
    sub DuplicateRightBottom_ {
        my $self = shift;
        return $self->DuplicateRight(null, - 1, false);
    }
    sub DuplicateRightBottom {
        my $self = shift;
        return $self->execCommand("DuplicateRightBottom", () => $self->DuplicateRightBottom_());
    }
    sub DeleteSelectedItem_ {
        my $self = shift;
        return $self->Delete(null, - 1);
    }
    sub DeleteSelectedItem {
        my $self = shift;
        return $self->execCommand("DeleteSelectedItem", () => $self->DeleteSelectedItem_());
    }
    sub SelectedUp {
        my $self = shift;
        return $self->SelectedMove(null, - 1, - 1);
    }
    sub SelectedDown {
        my $self = shift;
        return $self->SelectedMove(null, - 1, 1);
    }
    sub Expand_ {
        my $self = shift;
        return $self->ExpandedChange(null, - 1, true);
    }
    sub Expand {
        my $self = shift;
        return $self->Expand_();
    }
    sub Unexpand_ {
        my $self = shift;
        return $self->ExpandedChange(null, - 1, false);
    }
    sub Unexpand {
        my $self = shift;
        return $self->Unexpand_();
    }
    sub loadXML {
        my $self = shift;
        my ($xml) = @_;
        $self->{IsExpanded} = false;
        $self->{SubPages}->Clear();
        $self->FromXml($xml);
    }
    sub loadJSON {
        my $self = shift;
        my ($obj) = @_;
        $self->{IsExpanded} = false;
        $self->{SubPages}->Clear();
        $self->FromJSON($obj);
    }
    sub loadText {
        my $self = shift;
        my ($text, $path) = @_;
        $self->{IsExpanded} = false;
        $self->{SubPages}->Clear();
        $self->FromText2($text, ".", $path);
    }
    sub GetFileNameWithoutExtension {
        my $self = shift;
        my ($path) = @_;
        my $index_sep = $path->lastIndexOf("\\");
        if ( $index_sep >= 0 ) {
            $path = $path->substring($index_sep + 1);
        }
        my $index_ext = $path->lastIndexOf(".");
        if ( $index_ext >= 0 ) {
            $path = $path->substring(0, $index_ext);
        }
        return $path;
    }
    sub makeSections {
        my $self = shift;
        my ($text, $header, $path) = @_;
        my $result = Array->new();
        my $sections = $text->split("\r\n" + $header);
        my $first = true;
        foreach my $section ( $sections ) {
            if ( $first && $section->{length} > 0 ) {
                if ( $self->StartsWith($section, $header) ) {
                    $result->push($self->GetFileNameWithoutExtension($path));
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
        my $self = shift;
        my ($text, $header, $path) = @_;
        $self->FromText($self->makeSections($text, $header, $path), $header);
    }
1;
