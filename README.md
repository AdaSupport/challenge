# Greetings from Ben! :)

#Installation
I've built a react app on the front end and a node/socket app on the backend.

To review, first install dependencies:

```sh
npm install
```
To get the server up and running, in one terminal from the root directoy type:

```sh
node server.js
```

This will launch your server on port 3003.

To get the client app up and running, in a second terminal from the root directory type:
```sh
npm start
```

This will launch the app on port 3000.

#App Structure
*** Front end ***
Full app is rendered from index.js

App.js is the app component that includes a header.

TodoList.js is the intelligent list component that hosts the application state and methods. It renders a list of todos, and user input buttons for list-level functions.

Todo.js is the dumb todo component that renders each todo item and the delete button.

*** Back end ***
Server.js is the server and holds logic for handling sockets.

data.json is the makeshift DB.

# Notes from Ben
This was a great project for learning about sockets. With the current build, some clients may not be able to successfully broadcast to the 'ada' room. This was discovered when opening up two windows (one normal, one incognito). The client that loads most recently appears to work well.

On Unit Testing. This is a brand new subject for me. I'm familiar with the concept at a high-level, but implementation will require some reading. I wanted to submit something for feedback, so if you'd like to proceed, I can write some tests after some research.

Other than that, I'm looking forward to your feedback!

# Challenge
Hello :wave:

This is our challenge for potential new developer team members. The code is for a simple real-time TODO app. The challenge here is to fix some bugs, make some improvements and push your code for evaluation by our team.

When you're finished, you should have a real-time TODO app that two or more people could use to share TODO's with one another. Imagine a TODO list our team could use for office chores, for example.

## Notes
- When we make, complete or delete a TODO item, it should show up the same way on all clients. To test this, we recommend having two browser windows open (one in-cognito and one not).
- We're evaluating you on completion of the quest list below, but also on style. Do you commit often? Are you sticking to the principles of DRY? Did you make code and UI that _you_ would enjoy reading and using? Things like that are important to our team. 👊
- Please make a `start` commit on your own branch so we know how long it takes you to complete the challenge. It's not a race, but we expect this to be <= a days work.
- This should be fun! If you're stuck on a bug or something needs clarification you can [email Anson](mailto:anson@ada.support?subject=Challenge) for help.
- If you prefer a functional style (or some other style of programming) feel free to switch things up to suit how you write best. We left the codebase intentionally small to support different styles/complete rewrites. Don't let how we've set things up get in the way of showing us your best work.

##  Your Quest
- [ ] Fix all the bugs
- [ ] Add a feature that allows users to complete tasks
- [ ] Add a feature that allows users to delete tasks
- [ ] Add a feature that allows the completion of all tasks
- [ ] Add a feature that allows the deletion of all tasks
- [ ] Add caching to the client app so that when we lose our connection we can still see our TODO's
- [ ] Make it look right on mobile devices
- [ ] Make a design change to improve the user experience
- [ ] Write some unit tests for your server side code

## Set Up
This is a Node app so you'll need Node and NPM to get it up on its feet.

```sh
npm install
node server
```

Now open `index.html` in your browser. Things won't work at first, but once the server is running, you should see your TODO's under the input.

## Done?
Great job! When you're all finished, open a PR and we'll review it 🙌
