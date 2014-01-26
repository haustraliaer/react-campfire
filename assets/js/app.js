/** @jsx React.DOM */      


// firebase setup

var dataRef = new Firebase("https://react-campfire.firebaseio.com/comments");

// ---------------------------- comment box [loaded] ----------------------------- //

var CommentBox = React.createClass({displayName: 'CommentBox',

  handleCommentSubmit: function(comment) {
    dataRef.push(comment);
  },

  getInitialState: function() {
    return {data: {}};
  },

  componentWillMount: function() {
    dataRef.on('child_added', function (newSnap, oldSnap) {
      if(newSnap.val()) {
        this.setState({
          data: newSnap.val()
        });
      }
    }, this);
  },

  render: function() {
    return (
      React.DOM.div( {className:"commentBox"}, 
        React.DOM.h1(null, "Comments"),
        CommentList( {data:this.state.data} ),
        CommentForm( {onCommentSubmit:this.handleCommentSubmit} )
      )
    );
  }

});


// ---------------------------- list ----------------------------- //

var CommentList = React.createClass({displayName: 'CommentList',

  getInitialState: function() {
    return {data: []};
  },

  render: function() {
    var comment = this.props.data;
    var index = this.state.data.length;
    if(comment.author && comment.text) {
        this.state.data.push(Comment( {key:index, author:comment.author}, comment.text));
    }
    return React.DOM.div( {className:"commentList"}, this.state.data);
  }

});


// ---------------------------- comments ----------------------------- //

var Comment = React.createClass({displayName: 'Comment',

  render: function() {
    return (
      React.DOM.div( {className:"comment"}, 
        React.DOM.h2( {className:"commentAuthor"}, 
          this.props.author
        ),
        this.props.children
      )
    );
  }

});


// ---------------------------- form ----------------------------- //

var CommentForm = React.createClass({displayName: 'CommentForm',

  handleSubmit: function(e) {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    
    if (!text || !author) {
      return false;
    }

    this.props.onCommentSubmit({author: author, text: text}); // onCommentSubmit(comment)
    // this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },

  render: function() {
    return (
      React.DOM.form( {className:"commentForm", onSubmit:this.handleSubmit}, 
        React.DOM.input( {type:"text", placeholder:"Your name", ref:"author", maxLength:"25"} ),
        React.DOM.input( {type:"text", placeholder:"Say something...", ref:"text"} ),
        React.DOM.input( {type:"submit", value:"Post"} )
      )
    );
  }

});




// ---------------------------- render to DOM ----------------------------- //

React.renderComponent(
  CommentBox(null ),
  document.getElementById('app')
);