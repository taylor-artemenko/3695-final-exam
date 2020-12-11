**Test Queries for Final Exam - Reddit Clone**

1. Server Setup
    1. ```npm install```
    2. ```npm start```
    
2. Mutation for "Add New Post"
    ```
     mutation addPost {
       addPost(id: "1", topic: "Soup", body: "Soup tastes pretty good", user_id: "1") {
         id
         topic
         body
         user {
           id
           name
         }
       }
     }
    ```
   
3. Mutation for "Add New Comment To Post"
    ```
     mutation addComment {
       addComment(id: "1", contents: "this is a comment", user_id: "1", post_id: "1") {
         id
         contents
       }
     }
    ```

4. Mutation for "Add response to Post"
    ```
     mutation updateComment {
       updateComment(comment_id: "1", response: "response to comment 1 on post 1") {
         id
         contents
         responses
       }
     }
    ```

5. Query for "Posts by Topic"
    ```
    {
      postsByTopic(topic: "Soup") {
        id
        topic
        body
        user {
          id
          name
        }
        comments {
          id
          responses
          post {
            id
          }
          user {
            id
          }
        }
      }
    }
    ```
6. Query for "Posts by ID"
    ```
    {
      postByID(id: "1") {
        id
        topic
        body
        user {
          id
          name
        }
        comments {
          contents
          responses
        }
      }
    }
    ```

7. Feel free to add more posts and or multiple comments/replies to see the query outputs handling
    multiple posts.
