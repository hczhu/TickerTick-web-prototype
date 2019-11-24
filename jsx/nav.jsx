Navbar = ReactBootstrap.Navbar
Nav = ReactBootstrap.Nav
NavDropdown = ReactBootstrap.NavDropdown
Form = ReactBootstrap.Form
FormControl = ReactBootstrap.FormControl

class FeedNav extends React.Component {
  constructor(props) {
    super(props);
    this.feed_render_callback = props.feed_render_callback;
  }

  componentDidMount() {
    this.onParameterChange()
  }

  componentWillUnmount() {
  }

  // Will be called after every re-rendering. The initial rendering doesn't count.
  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  onParameterChange() {
    console.log("Paramters have changed: ", this.lang.value, this.relevance.value, this.ticker.value);
    url = getFeedUrlFromForms(this.ticker.value, this.relevance.value, this.lang.value);
    this.feed_render_callback(url);
  }

  render() {
    return (
      <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="">Stock News Feed</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Form onChange={this.onParameterChange.bind(this)}>
        <Form.Row>
          <Form.Group as={Col} controlId="lang">
          <Form.Label>Language</Form.Label>
          <Form.Control as="select"
            placeholder="en,cn"
            ref={ (el) => this.lang=el }>
              <option value="en,cn">English & Chinese</option>
              <option value="en">English</option>
              <option value="cn">Chinese</option>
          </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="relevance">
          <Form.Label>Relevance Level</Form.Label>
          <Form.Control as="select"
            placeholder="3"
            ref={ (el) => this.relevance=el }>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
          </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="ticker">
          <Form.Label>Ticker</Form.Label>
          <Form.Control type="text" 
            placeholder="fb" className="mr-sm-2"
            ref={ (el) => this.ticker=el }
          />
          </Form.Group>

    </Form.Row>

          </Form>
        </Navbar.Collapse>
      </Navbar>
      </Container>
    );
  }
}

function renderNav(dom_node_id, feed_render_callback) {
  ReactDOM.render(
    <FeedNav feed_render_callback={feed_render_callback} />,
    document.getElementById(dom_node_id)
  );
}
