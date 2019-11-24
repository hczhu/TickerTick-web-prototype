var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Navbar = ReactBootstrap.Navbar;
Nav = ReactBootstrap.Nav;
NavDropdown = ReactBootstrap.NavDropdown;
Form = ReactBootstrap.Form;
FormControl = ReactBootstrap.FormControl;

var FeedNav = function (_React$Component) {
  _inherits(FeedNav, _React$Component);

  function FeedNav(props) {
    _classCallCheck(this, FeedNav);

    var _this = _possibleConstructorReturn(this, (FeedNav.__proto__ || Object.getPrototypeOf(FeedNav)).call(this, props));

    _this.feed_render_callback = props.feed_render_callback;
    return _this;
  }

  _createClass(FeedNav, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.onParameterChange();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}

    // Will be called after every re-rendering. The initial rendering doesn't count.

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {}
  }, {
    key: "onParameterChange",
    value: function onParameterChange() {
      console.log("Paramters have changed: ", this.lang.value, this.relevance.value, this.ticker.value);
      url = getFeedUrlFromForms(this.ticker.value, this.relevance.value, this.lang.value);
      this.feed_render_callback(url);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        Container,
        null,
        React.createElement(
          Navbar,
          { bg: "light", expand: "lg" },
          React.createElement(
            Navbar.Brand,
            { href: "" },
            "Stock News Feed"
          ),
          React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
          React.createElement(
            Navbar.Collapse,
            { id: "basic-navbar-nav" },
            React.createElement(
              Form,
              { onChange: this.onParameterChange.bind(this) },
              React.createElement(
                Form.Row,
                null,
                React.createElement(
                  Form.Group,
                  { as: Col, controlId: "lang" },
                  React.createElement(
                    Form.Label,
                    null,
                    "Language"
                  ),
                  React.createElement(
                    Form.Control,
                    { as: "select",
                      placeholder: "en,cn",
                      ref: function ref(el) {
                        return _this2.lang = el;
                      } },
                    React.createElement(
                      "option",
                      { value: "en,cn" },
                      "English & Chinese"
                    ),
                    React.createElement(
                      "option",
                      { value: "en" },
                      "English"
                    ),
                    React.createElement(
                      "option",
                      { value: "cn" },
                      "Chinese"
                    )
                  )
                ),
                React.createElement(
                  Form.Group,
                  { as: Col, controlId: "relevance" },
                  React.createElement(
                    Form.Label,
                    null,
                    "Relevance Level"
                  ),
                  React.createElement(
                    Form.Control,
                    { as: "select",
                      placeholder: "3",
                      ref: function ref(el) {
                        return _this2.relevance = el;
                      } },
                    React.createElement(
                      "option",
                      { value: "0" },
                      "0"
                    ),
                    React.createElement(
                      "option",
                      { value: "1" },
                      "1"
                    ),
                    React.createElement(
                      "option",
                      { value: "2" },
                      "2"
                    ),
                    React.createElement(
                      "option",
                      { value: "3" },
                      "3"
                    )
                  )
                ),
                React.createElement(
                  Form.Group,
                  { as: Col, controlId: "ticker" },
                  React.createElement(
                    Form.Label,
                    null,
                    "Ticker"
                  ),
                  React.createElement(Form.Control, { type: "text",
                    placeholder: "fb", className: "mr-sm-2",
                    ref: function ref(el) {
                      return _this2.ticker = el;
                    }
                  })
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

function renderNav(dom_node_id, feed_render_callback) {
  ReactDOM.render(React.createElement(FeedNav, { feed_render_callback: feed_render_callback }), document.getElementById(dom_node_id));
}