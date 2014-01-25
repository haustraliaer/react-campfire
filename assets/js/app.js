/** @jsx React.DOM */      

// create components

// - CommentBox
//   - CommentList
//     - Comment
//   - CommentForm


// ---------------------------- comment box [loaded] ----------------------------- //

var CommentBox = React.createClass({displayName: 'CommentBox',

  loadCommentsFromServer: function() {
    $.ajax({
      url: '/assets/data/comments.json',
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("comments.json", status, err.toString());
      }.bind(this)
    });
  },

  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: []};
  },

  componentWillMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
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

  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return Comment( {author:comment.author}, comment.text);
    });
    return (
      React.DOM.div( {className:"commentList"}, 
        commentNodes
      )
    );
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

  handleSubmit: function() {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    
    if (!text || !author) {
      return false;
    }

    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },

  render: function() {
    return (
      React.DOM.form( {className:"commentForm", onSubmit:this.handleSubmit}, 
        React.DOM.input( {type:"text", placeholder:"Your name", ref:"author"} ),
        React.DOM.input( {type:"text", placeholder:"Say something...", ref:"text"} ),
        React.DOM.input( {type:"submit", value:"Post"} )
      )
    );
  }

});




// ---------------------------- render to DOM ----------------------------- //

React.renderComponent(
  CommentBox( {url:"/assets/data/comments.json", pollInterval:2000} ),
  document.getElementById('app')
);