// Define a class for the Solution Network
class SolutionNetwork {
  constructor() {
    this.posts = [];
  }

  // Method to post a new post
  post(text) {
    const post = {
      id: Date.now(), // Generate a unique ID
      text: text,
      likes: 0,
      replies: [],
    };

    this.posts.unshift(post); // Add the new post at the beginning of the array
  }

  // Method to add a reply to a post
  reply(postId, text) {
    const reply = {
      id: Date.now(), // Generate a unique ID
      text: text,
      likes: 0,
    };

    const post = this.findPost(postId);
    if (post) {
      post.replies.push(reply);
    }
  }

  // Method to like a post or reply
  like(postId, replyId) {
    if (replyId) {
      const reply = this.findReply(postId, replyId);
      if (reply) {
        reply.likes = reply.liked ? reply.likes - 1 : reply.likes + 1;
        reply.liked = !reply.liked;
      }
    } else {
      const post = this.findPost(postId);
      if (post) {
        post.likes = post.liked ? post.likes - 1 : post.likes + 1;
        post.liked = !post.liked;
      }
    }
  }

  // Method to find a post by its ID
  findPost(postId) {
    return this.posts.find(post => post.id === postId);
  }

  // Method to find a reply by its ID within a post
  findReply(postId, replyId) {
    const post = this.findPost(postId);
    if (post) {
      return post.replies.find(reply => reply.id === replyId);
    }
    return null;
  }

  // Method to get all posts
  getAllPosts() {
    return this.posts;
  }
}

// Create an instance of the Solution Network
const solutionNetwork = new SolutionNetwork();

// Get HTML elements
const postInput = document.getElementById("postInput");
const postButton = document.getElementById("postButton");
const postsList = document.getElementById("postsList");

// Function to create a post HTML element
function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  const contentElement = document.createElement("div");
  contentElement.classList.add("content");
  contentElement.textContent = post.text;

  const actionsElement = document.createElement("div");
  actionsElement.classList.add("actions");

  const likeButton = document.createElement("span");
  likeButton.classList.add("btn");
  likeButton.innerHTML = '<span style="color: red;">&#x2764;</span> <span class="like-count">' + post.likes + '</span>'; // Use the red heart emoji Unicode representation
  likeButton.addEventListener("click", () => {
    solutionNetwork.like(post.id);
    renderPosts();
  });

  actionsElement.appendChild(likeButton);

  const repliesElement = document.createElement("div");

  const replyForm = document.createElement("div");
  const replyInput = document.createElement("input");
  replyInput.type = "text";
  const replyButton = document.createElement("button");
  replyButton.textContent = "Reply";
  replyButton.addEventListener("click", () => {
    if (replyInput.value) {
      solutionNetwork.reply(post.id, replyInput.value);
      replyInput.value = "";
      renderPosts();
    }
  });

  replyForm.appendChild(replyInput);
  replyForm.appendChild(replyButton);
  repliesElement.appendChild(replyForm);

  post.replies.forEach(reply => {
    const replyElement = document.createElement("div");
    replyElement.classList.add("post", "reply");

    const replyContentElement = document.createElement("div");
    replyContentElement.classList.add("content");
    replyContentElement.textContent = reply.text;

    const replyActionsElement = document.createElement("div");
    replyActionsElement.classList.add("actions");

    const likeReplyButton = document.createElement("span");
    likeReplyButton.classList.add("btn");
    likeReplyButton.innerHTML = '<span style="color: red;">&#x2764;</span> <span class="like-count">' + reply.likes + '</span>'; // Use the red heart emoji Unicode representation
    likeReplyButton.addEventListener("click", () => {
      solutionNetwork.like(post.id, reply.id);
      renderPosts();
    });

    replyActionsElement.appendChild(likeReplyButton);

    replyElement.appendChild(replyContentElement);
    replyElement.appendChild(replyActionsElement);

    repliesElement.appendChild(replyElement);
  });

  postElement.appendChild(contentElement);
  postElement.appendChild(actionsElement);
  postElement.appendChild(repliesElement);

  return postElement;
}

// Function to render all posts
function renderPosts() {
  postsList.innerHTML = "";

  const posts = solutionNetwork.getAllPosts();

  posts.forEach(post => {
    const postElement = createPostElement(post);
    postsList.appendChild(postElement);
  });
}

// Event listener for posting
postButton.addEventListener("click", () => {
  if (postInput.value) {
    solutionNetwork.post(postInput.value);
    postInput.value = "";
    renderPosts();
  }
});

// Initial rendering of posts
renderPosts();
