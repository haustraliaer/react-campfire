/** @jsx React.DOM */      


// firebase setup

var dataRef = new Firebase("https://react-campfire.firebaseio.com/comments");

// ---------------------------- comment box [loaded] ----------------------------- //

var CommentBox = React.createClass({

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
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }

});


// ---------------------------- list ----------------------------- //

var CommentList = React.createClass({

  getInitialState: function() {
    return {data: []};
  },

  render: function() {
    var comment = this.props.data;
    var index = this.state.data.length;
    if(comment.author && comment.text) {
        this.state.data.push(<Comment key={index} author={comment.author}>{comment.text}</Comment>);
    }
    return <div className="commentList">{this.state.data}</div>;
  }

});


// ---------------------------- comments ----------------------------- //

var Comment = React.createClass({

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }

});


// ---------------------------- form ----------------------------- //

var CommentForm = React.createClass({

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
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" maxLength="25" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }

});




// ---------------------------- render to DOM ----------------------------- //

React.renderComponent(
  <CommentBox />,
  document.getElementById('app')
);