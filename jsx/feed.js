Card = ReactBootstrap.Card;
CardColumns = ReactBootstrap.CardColumns;
ButtonToolbar = ReactBootstrap.ButtonToolbar;
ToggleButtonGroup = ReactBootstrap.ToggleButtonGroup;
ToggleButton = ReactBootstrap.ToggleButton;
Container = ReactBootstrap.Container;
Row = ReactBootstrap.Row;
Col = ReactBootstrap.Col;
Spinner = ReactBootstrap.Spinner;
Button = ReactBootstrap.Button;
Navbar = ReactBootstrap.Navbar
Nav = ReactBootstrap.Nav
NavDropdown = ReactBootstrap.NavDropdown
Form = ReactBootstrap.Form
FormControl = ReactBootstrap.FormControl
Image = ReactBootstrap.Image

class FeedbackPanel extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    if (!('id' in props)) {
      // "id" is the story id.
      console.log('Expecting "id" from the component properties: ' + JSON.stringify(props));
    }
    this.actionCallback = this.actionCallback.bind(this);

    selected_actions = [];
    if (this.props.action_bits != null) {
      selected_actions = bitsToActions(parseInt(this.props.action_bits));
    }
    this.selected_actions = selected_actions;
  }

  restoreActionsFromLocalStorage() {
  }

  componentDidMount() {
    // this.restoreActionsFromLocalStorage();
  }

  componentWillUnmount() {
  }

  actionCallback(actions, event) {
    console.log(JSON.stringify(actions) + ' on ' + this.props.id);
    for (var i in actions) {
      sendUserActions(actions[i], [this.props.id]);
    }
  }

  render() {
    // console.log(this.props.id + " actions: " + this.selected_actions);
    return (
      <ButtonToolbar>
        <ToggleButtonGroup type="checkbox" defaultValue={this.selected_actions} onChange={this.actionCallback}>
          <ToggleButton size="sm" value="like" variant="outline-success">Like</ToggleButton>
          <ToggleButton size="sm" value="dislike" variant="outline-danger">Dislike</ToggleButton>
          <ToggleButton size="sm" value="save" variant="outline-primary">Save</ToggleButton>
        </ToggleButtonGroup>
      </ButtonToolbar>
    );
  }
}

class StoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.id_str = this.props.storyInJson.id_str;
    this.anchorClickCallback = this.anchorClickCallback.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  anchorClickCallback() {
    // console.log("Clicked " + this.id_str);
    sendUserActions("click", [this.id_str]);
  }

  render() {
    storyInJson = this.props.storyInJson;
    // console.log("story card: " + storyInJson.id_str);
    return (
      <Card>
        <Card.Body>
          <Card.Title>
          <Image src={storyInJson.favicon_url} rounded width="32" /> 
              <a target="_blank" href={storyInJson.url}
              dangerouslySetInnerHTML={{__html: storyInJson.title}}
              onClick={ this.anchorClickCallback } /> 
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{storyInJson.site} - {storyInJson.date }({ storyInJson.days_ago } days ago)</Card.Subtitle>
          <FeedbackPanel id={storyInJson.id_str} />
        </Card.Body>
      </Card>
    );
  }
}

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      clicked: false,
    };
    this.dom_id = "page." + this.props.pagination;
  }

  handleClick() {
    this.setState({
      clicked: true,
    }); 
    // console.log(this.props);
    if (this.props.clickCallback != null) {
      this.props.clickCallback();
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    if (this.state.clicked) {
      return (
        <div>
          <hr className="page_divider" />
          <StoryPage id={this.dom_id} url={this.props.url} last={this.props.last} pagination={this.props.pagination}/>
        </div>
      );
    }

    return (
      <Row><Col> 
      <Button variant="primary" size="lg" onClick={this.handleClick} block>
        Load more stories
      </Button>
      <p className="text-center">...</p>
      <p className="text-center">...</p>
      <p className="text-center">...</p>
      </Col></Row>
    );
  }
}

class StoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      url: props.url,
      storiesInJson: [],
    };
    this.pagination = 1;
    if (this.props.pagination != null) {
      this.pagination = this.props.pagination;
    }
    console.log("StoryPage.props: ", this.props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
  }

  fetchStoriesAndSetState(url) {
    if (url == "" || url == null) {
      return;
    }
    // Trigger a render() call again.
    fetchStories(url, this.props.last).then(storiesInJson => {
        this.clickCallback = () => {
          console.log("Scorlled " + storiesInJson.length + " stories.");
          scrolled_stories = [];
          for (i in storiesInJson) {
            scrolled_stories.push(storiesInJson[i].id_str);
          }
          sendUserActions("view", scrolled_stories);
        };

        console.log("Got ", storiesInJson.length, " stories.");
        this.setState({
          loading: false,
          storiesInJson: storiesInJson,
          url: url,
        });
    });
  }

  componentWillUnmount() {
  }

  // Will be called after every re-rendering. The initial rendering doesn't count.
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("Calling componentDidUpdate() of StoryPage...");
    page_dom = this.myRef.current;
    if (page_dom != null) {
      console.log("Scrolling pagination #" + this.pagination + " to the view port.");
      page_dom.scrollIntoView(true);
      console.log("Scrolling by -25")
      page_dom.scrollBy(0, -25)
    }
  }

  render() {
    console.log("Rendering StoryPage with props: ", this.props);
    if (this.state.url != this.props.url) {
      this.state = {
        loading: true,
        url: this.props.url,
        storiesInJson: [],
      };
    }
    if (this.state.loading) {
      this.fetchStoriesAndSetState(this.props.url);
      return (
        <div>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      );
    }
    storiesInJson = this.state.storiesInJson;
    storiesInRows = storiesInJson.map(
        (storyInJson)=>{
          // console.log(storyInJson.id_str);
          return (
            <Row key={storyInJson.id_str}> <Col>
              <StoryCard storyInJson={storyInJson} />
            </Col> </Row>
          );
        }
    );
    load_more = ""
    if (storiesInJson.length > 0) {
      load_more = (
        <LoadMoreButton url={this.props.url} last={storiesInJson[storiesInJson.length - 1].id_str} 
          clickCallback={this.clickCallback}
          pagination={ parseInt(this.pagination) + 1} />
      );
    }
    return (
      <div ref={this.myRef}>
        {storiesInRows}
        {load_more}
     </div>
    );
  }
}

class FeedNav extends React.Component {
  constructor(props) {
    super(props);
    this.set_url_call_back = this.props.set_url_call_back;
    console.log("FeedNav props: ", props);

    this.state = {
      lang: this.props.lang,
      relevance: this.props.relevance,
      ticker: this.props.ticker,
    };
  }

  onParameterChange() {
    console.log("Paramters have changed: ", this.lang.value, this.relevance.value, this.ticker.value);
    if (this.ticker.value == "") {
      return
    }
    this.setState({
      lang: this.lang.value,
      relevance: this.relevance.value,
      ticker: this.ticker.value,
    });
    url = getFeedUrlFromForms(this.lang.value, this.relevance.value, this.ticker.value);
    this.set_url_call_back(url);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // Will be called after every re-rendering. The initial rendering doesn't count.
  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  render() {
    console.log("Rendering FeedNav.");
    return (
      <Container fluid="true" className="sticky-nav">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="">
        <h3>
            Ticker Tick 
          </h3> 
          <h6> <a target="_blank" href="https://github.com/hczhu/SNFaaS">stock news feed as-a-service</a></h6>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Form onChange={this.onParameterChange.bind(this)}>
        <Form.Row>
          <Row>
          <Col xs="auto">
            <Form.Group as={Col} controlId="lang">
          <Form.Label>Language</Form.Label>
          <Form.Control as="select"
            defaultValue={ this.state.lang }
            ref={ (el) => this.lang=el }>
              <option value="en,cn">English & Chinese</option>
              <option value="en">English</option>
              <option value="cn">Chinese</option>
          </Form.Control>
          </Form.Group>
          </Col>

          <Col xs="auto">
          <Form.Group as={Col} controlId="relevance">
          <Form.Label>Relevance Level</Form.Label>
          <Form.Control as="select"
            defaultValue={ this.state.relevance }
            ref={ (el) => this.relevance=el }>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
          </Form.Control>
          </Form.Group>
          </Col>

          <Col xs="auto">
          <Form.Group as={Col} controlId="ticker">
          <Form.Label>Ticker</Form.Label>
          <Form.Control type="text" 
            defaultValue={ this.state.ticker }
            className="mr-sm-2"
            ref={ (el) => this.ticker=el }
          />
          </Form.Group>
          </Col>
          </Row>

      </Form.Row>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      </Container>

    );
  }
}

class FeedWithNav extends React.Component {
  constructor(props) {
    super(props);
    this.setUrl = this.setUrl.bind(this);
    this.getUrl = this.getUrl.bind(this);
    [this.lang, this.relevance, this.ticker] = getFormValuesFromUrl()
    this.state = {
      url: getFeedUrlFromForms(
        this.lang,
        this.relevance,
        this.ticker,
        false
      )
    };
    console.log("Initial state: ", this.state);
  }

  setUrl(new_url) {
    console.log("Called setUrl() with url: ", new_url);
    this.setState({
      url: new_url,
    }); 
    this.url = url;
  }

  getUrl() {
    console.log("get url: ", this.url);
    return this.url;
  }

  componentDidMount() {
    console.log("FeedWithNav mounted.");
  }

  componentWillUnmount() {
  }

  // Will be called after every re-rendering. The initial rendering doesn't count.
  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  render() {
    console.log("Rendering FeedWithNav.");
    return (
      <Container>
      <FeedNav set_url_call_back={ this.setUrl } 
        lang={ this.lang }
        relevance={ this.relevance }
        ticker={ this.ticker }
      />

      <StoryPage url={this.state.url } />
      </Container>
    );
  }
}

function renderFeed(dom_node_id) {
  ReactDOM.render(
      <FeedWithNav />,
    document.getElementById(dom_node_id)
  );
}
