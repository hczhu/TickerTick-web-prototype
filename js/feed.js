var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
Navbar = ReactBootstrap.Navbar;
Nav = ReactBootstrap.Nav;
NavDropdown = ReactBootstrap.NavDropdown;
Form = ReactBootstrap.Form;
FormControl = ReactBootstrap.FormControl;
Image = ReactBootstrap.Image;

var FeedbackPanel = function (_React$Component) {
  _inherits(FeedbackPanel, _React$Component);

  function FeedbackPanel(props) {
    _classCallCheck(this, FeedbackPanel);

    // console.log(props);
    var _this = _possibleConstructorReturn(this, (FeedbackPanel.__proto__ || Object.getPrototypeOf(FeedbackPanel)).call(this, props));

    if (!('id' in props)) {
      // "id" is the story id.
      console.log('Expecting "id" from the component properties: ' + JSON.stringify(props));
    }
    _this.actionCallback = _this.actionCallback.bind(_this);

    selected_actions = [];
    if (_this.props.action_bits != null) {
      selected_actions = bitsToActions(parseInt(_this.props.action_bits));
    }
    _this.selected_actions = selected_actions;
    return _this;
  }

  _createClass(FeedbackPanel, [{
    key: 'restoreActionsFromLocalStorage',
    value: function restoreActionsFromLocalStorage() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // this.restoreActionsFromLocalStorage();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'actionCallback',
    value: function actionCallback(actions, event) {
      console.log(JSON.stringify(actions) + ' on ' + this.props.id);
      for (var i in actions) {
        sendUserActions(actions[i], [this.props.id]);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      // console.log(this.props.id + " actions: " + this.selected_actions);
      return React.createElement(
        ButtonToolbar,
        null,
        React.createElement(
          ToggleButtonGroup,
          { type: 'checkbox', defaultValue: this.selected_actions, onChange: this.actionCallback },
          React.createElement(
            ToggleButton,
            { size: 'sm', value: 'like', variant: 'outline-success' },
            'Like'
          ),
          React.createElement(
            ToggleButton,
            { size: 'sm', value: 'dislike', variant: 'outline-danger' },
            'Dislike'
          ),
          React.createElement(
            ToggleButton,
            { size: 'sm', value: 'save', variant: 'outline-primary' },
            'Save'
          )
        )
      );
    }
  }]);

  return FeedbackPanel;
}(React.Component);

var StoryCard = function (_React$Component2) {
  _inherits(StoryCard, _React$Component2);

  function StoryCard(props) {
    _classCallCheck(this, StoryCard);

    var _this2 = _possibleConstructorReturn(this, (StoryCard.__proto__ || Object.getPrototypeOf(StoryCard)).call(this, props));

    _this2.id_str = _this2.props.storyInJson.id_str;
    _this2.anchorClickCallback = _this2.anchorClickCallback.bind(_this2);
    return _this2;
  }

  _createClass(StoryCard, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'anchorClickCallback',
    value: function anchorClickCallback() {
      // console.log("Clicked " + this.id_str);
      sendUserActions("click", [this.id_str]);
    }
  }, {
    key: 'render',
    value: function render() {
      storyInJson = this.props.storyInJson;
      // console.log("story card: " + storyInJson.id_str);
      return React.createElement(
        Card,
        null,
        React.createElement(
          Card.Body,
          null,
          React.createElement(
            Card.Title,
            null,
            React.createElement(Image, { src: storyInJson.favicon_url, rounded: true, width: '32' }),
            React.createElement('a', { target: '_blank', href: storyInJson.url, id: storyInJson.id_str,
              dangerouslySetInnerHTML: { __html: storyInJson.title },
              onClick: this.anchorClickCallback })
          ),
          React.createElement(
            Card.Subtitle,
            { className: 'mb-2 text-muted' },
            storyInJson.site,
            ' - ',
            storyInJson.date,
            '(',
            storyInJson.days_ago,
            ' days ago)'
          ),
          React.createElement(FeedbackPanel, { id: storyInJson.id_str })
        )
      );
    }
  }]);

  return StoryCard;
}(React.Component);

var LoadMoreButton = function (_React$Component3) {
  _inherits(LoadMoreButton, _React$Component3);

  function LoadMoreButton(props) {
    _classCallCheck(this, LoadMoreButton);

    var _this3 = _possibleConstructorReturn(this, (LoadMoreButton.__proto__ || Object.getPrototypeOf(LoadMoreButton)).call(this, props));

    _this3.handleClick = _this3.handleClick.bind(_this3);
    _this3.state = {
      clicked: false
    };
    _this3.dom_id = "page." + _this3.props.pagination;
    return _this3;
  }

  _createClass(LoadMoreButton, [{
    key: 'handleClick',
    value: function handleClick() {
      this.setState({
        clicked: true
      });
      // console.log(this.props);
      if (this.props.clickCallback != null) {
        this.props.clickCallback();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'render',
    value: function render() {
      if (this.state.clicked) {
        return React.createElement(
          'div',
          null,
          React.createElement('hr', { className: 'page_divider' }),
          React.createElement(StoryPage, { id: this.dom_id, url: this.props.url, last: this.props.last, pagination: this.props.pagination })
        );
      }

      return React.createElement(
        Row,
        null,
        React.createElement(
          Col,
          null,
          React.createElement(
            Button,
            { variant: 'primary', size: 'lg', onClick: this.handleClick, block: true },
            'Load more stories'
          ),
          React.createElement(
            'p',
            { className: 'text-center' },
            '...'
          ),
          React.createElement(
            'p',
            { className: 'text-center' },
            '...'
          ),
          React.createElement(
            'p',
            { className: 'text-center' },
            '...'
          )
        )
      );
    }
  }]);

  return LoadMoreButton;
}(React.Component);

var StoryPage = function (_React$Component4) {
  _inherits(StoryPage, _React$Component4);

  function StoryPage(props) {
    _classCallCheck(this, StoryPage);

    var _this4 = _possibleConstructorReturn(this, (StoryPage.__proto__ || Object.getPrototypeOf(StoryPage)).call(this, props));

    _this4.state = {
      loading: true,
      url: props.url,
      storiesInJson: []
    };
    _this4.pagination = 1;
    if (_this4.props.pagination != null) {
      _this4.pagination = _this4.props.pagination;
    }
    console.log("StoryPage.props: ", _this4.props);
    _this4.myRef = React.createRef();
    return _this4;
  }

  _createClass(StoryPage, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'fetchStoriesAndSetState',
    value: function fetchStoriesAndSetState(url) {
      var _this5 = this;

      if (url == "" || url == null) {
        return;
      }
      // Trigger a render() call again.
      fetchStories(url, this.props.last).then(function (storiesInJson) {
        _this5.clickCallback = function () {
          console.log("Scorlled " + storiesInJson.length + " stories.");
          scrolled_stories = [];
          for (i in storiesInJson) {
            scrolled_stories.push(storiesInJson[i].id_str);
          }
          sendUserActions("view", scrolled_stories);
        };

        console.log("Got ", storiesInJson.length, " stories.");
        _this5.setState({
          loading: false,
          storiesInJson: storiesInJson,
          url: url
        });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}

    // Will be called after every re-rendering. The initial rendering doesn't count.

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      console.log("Calling componentDidUpdate() of StoryPage...");
      page_dom = this.myRef.current;
      if (page_dom != null) {
        console.log("Scrolling pagination #" + this.pagination + " to the view port.");
        page_dom.scrollIntoView(true);
        console.log("Scrolling by -25");
        page_dom.scrollBy(0, -25);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      console.log("Rendering StoryPage with props: ", this.props);
      if (this.state.url != this.props.url) {
        this.state = {
          loading: true,
          url: this.props.url,
          storiesInJson: []
        };
      }
      if (this.state.loading) {
        this.fetchStoriesAndSetState(this.props.url);
        return React.createElement(
          'div',
          null,
          React.createElement(
            Spinner,
            { animation: 'border', role: 'status' },
            React.createElement(
              'span',
              { className: 'sr-only' },
              'Loading...'
            )
          )
        );
      }
      storiesInJson = this.state.storiesInJson;
      storiesInRows = storiesInJson.map(function (storyInJson) {
        // console.log(storyInJson.id_str);
        return React.createElement(
          Row,
          { key: storyInJson.id_str },
          ' ',
          React.createElement(
            Col,
            null,
            React.createElement(StoryCard, { storyInJson: storyInJson })
          ),
          ' '
        );
      });
      load_more = "";
      if (storiesInJson.length > 0) {
        load_more = React.createElement(LoadMoreButton, { url: this.props.url, last: storiesInJson[storiesInJson.length - 1].id_str,
          clickCallback: this.clickCallback,
          pagination: parseInt(this.pagination) + 1 });
      }
      return React.createElement(
        'div',
        { ref: this.myRef },
        storiesInRows,
        load_more
      );
    }
  }]);

  return StoryPage;
}(React.Component);

var FeedNav = function (_React$Component5) {
  _inherits(FeedNav, _React$Component5);

  function FeedNav(props) {
    _classCallCheck(this, FeedNav);

    var _this6 = _possibleConstructorReturn(this, (FeedNav.__proto__ || Object.getPrototypeOf(FeedNav)).call(this, props));

    _this6.set_url_call_back = _this6.props.set_url_call_back;
    console.log("FeedNav props: ", props);

    _this6.state = {
      lang: _this6.props.lang,
      relevance: _this6.props.relevance,
      ticker: _this6.props.ticker
    };
    return _this6;
  }

  _createClass(FeedNav, [{
    key: 'onParameterChange',
    value: function onParameterChange() {
      console.log("Paramters have changed: ", this.lang.value, this.relevance.value, this.ticker.value);
      if (this.ticker.value == "") {
        return;
      }
      this.setState({
        lang: this.lang.value,
        relevance: this.relevance.value,
        ticker: this.ticker.value
      });
      url = getFeedUrlFromForms(this.lang.value, this.relevance.value, this.ticker.value);
      this.set_url_call_back(url);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}

    // Will be called after every re-rendering. The initial rendering doesn't count.

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState, snapshot) {}
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      console.log("Rendering FeedNav.");
      return React.createElement(
        Container,
        { fluid: 'true', className: 'sticky-nav' },
        React.createElement(
          Navbar,
          { bg: 'light', expand: 'lg' },
          React.createElement(
            Navbar.Brand,
            { href: '' },
            React.createElement(
              'h3',
              null,
              'TickerTick'
            ),
            React.createElement(
              'h6',
              null,
              ' ',
              React.createElement(
                'a',
                { target: '_blank', href: 'https://github.com/hczhu/SNFaaS' },
                'powered by: TickerTick API'
              )
            )
          ),
          React.createElement(Navbar.Toggle, { 'aria-controls': 'basic-navbar-nav' }),
          React.createElement(
            Navbar.Collapse,
            { id: 'basic-navbar-nav' },
            React.createElement(
              Form,
              { onChange: this.onParameterChange.bind(this) },
              React.createElement(
                Form.Row,
                null,
                React.createElement(
                  Row,
                  null,
                  React.createElement(
                    Col,
                    { xs: 'auto' },
                    React.createElement(
                      Form.Group,
                      { as: Col, controlId: 'lang' },
                      React.createElement(
                        Form.Label,
                        null,
                        'Language'
                      ),
                      React.createElement(
                        Form.Control,
                        { as: 'select',
                          defaultValue: this.state.lang,
                          ref: function ref(el) {
                            return _this7.lang = el;
                          } },
                        React.createElement(
                          'option',
                          { value: 'en,cn' },
                          'English & Chinese'
                        ),
                        React.createElement(
                          'option',
                          { value: 'en' },
                          'English'
                        ),
                        React.createElement(
                          'option',
                          { value: 'cn' },
                          'Chinese'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    Col,
                    { xs: 'auto' },
                    React.createElement(
                      Form.Group,
                      { as: Col, controlId: 'relevance' },
                      React.createElement(
                        Form.Label,
                        null,
                        'Relevance Level'
                      ),
                      React.createElement(
                        Form.Control,
                        { as: 'select',
                          defaultValue: this.state.relevance,
                          ref: function ref(el) {
                            return _this7.relevance = el;
                          } },
                        React.createElement(
                          'option',
                          { value: '0' },
                          '0'
                        ),
                        React.createElement(
                          'option',
                          { value: '1' },
                          '1'
                        ),
                        React.createElement(
                          'option',
                          { value: '2' },
                          '2'
                        ),
                        React.createElement(
                          'option',
                          { value: '3' },
                          '3'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    Col,
                    { xs: 'auto' },
                    React.createElement(
                      Form.Group,
                      { as: Col, controlId: 'ticker' },
                      React.createElement(
                        Form.Label,
                        null,
                        'Ticker'
                      ),
                      React.createElement(Form.Control, { type: 'text',
                        defaultValue: this.state.ticker,
                        className: 'mr-sm-2',
                        ref: function ref(el) {
                          return _this7.ticker = el;
                        }
                      })
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return FeedNav;
}(React.Component);

var FeedWithNav = function (_React$Component6) {
  _inherits(FeedWithNav, _React$Component6);

  function FeedWithNav(props) {
    _classCallCheck(this, FeedWithNav);

    var _this8 = _possibleConstructorReturn(this, (FeedWithNav.__proto__ || Object.getPrototypeOf(FeedWithNav)).call(this, props));

    _this8.setUrl = _this8.setUrl.bind(_this8);
    _this8.getUrl = _this8.getUrl.bind(_this8);

    var _getFormValuesFromUrl = getFormValuesFromUrl();

    var _getFormValuesFromUrl2 = _slicedToArray(_getFormValuesFromUrl, 3);

    _this8.lang = _getFormValuesFromUrl2[0];
    _this8.relevance = _getFormValuesFromUrl2[1];
    _this8.ticker = _getFormValuesFromUrl2[2];

    _this8.state = {
      url: getFeedUrlFromForms(_this8.lang, _this8.relevance, _this8.ticker, false)
    };
    console.log("Initial state: ", _this8.state);
    return _this8;
  }

  _createClass(FeedWithNav, [{
    key: 'setUrl',
    value: function setUrl(new_url) {
      console.log("Called setUrl() with url: ", new_url);
      this.setState({
        url: new_url
      });
      this.url = url;
    }
  }, {
    key: 'getUrl',
    value: function getUrl() {
      console.log("get url: ", this.url);
      return this.url;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log("FeedWithNav mounted.");
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}

    // Will be called after every re-rendering. The initial rendering doesn't count.

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState, snapshot) {}
  }, {
    key: 'render',
    value: function render() {
      console.log("Rendering FeedWithNav.");
      return React.createElement(
        Container,
        null,
        React.createElement(FeedNav, { set_url_call_back: this.setUrl,
          lang: this.lang,
          relevance: this.relevance,
          ticker: this.ticker
        }),
        React.createElement(StoryPage, { url: this.state.url })
      );
    }
  }]);

  return FeedWithNav;
}(React.Component);

function renderFeed(dom_node_id) {
  ReactDOM.render(React.createElement(FeedWithNav, null), document.getElementById(dom_node_id));
}