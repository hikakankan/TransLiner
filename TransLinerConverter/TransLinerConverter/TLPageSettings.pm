package TLPageSettings;
    my $NoTitle = true;
    my $TitleLength = 20;
    my $PageLoad = false;
    my $NoServer = false;
    sub SetNoServerMode {
        my $this = shift;
        $this->PageLoad = false;
        $this->NoServer = true;
    }
1;
