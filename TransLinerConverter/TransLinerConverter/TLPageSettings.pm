package TLPageSettings;
    my $NoTitle = true;
    my $TitleLength = 20;
    my $PageLoad = false;
    my $NoServer = false;
    sub SetNoServerMode {
        my $self = shift;
        $self->{PageLoad} = false;
        $self->{NoServer} = true;
    }
1;
