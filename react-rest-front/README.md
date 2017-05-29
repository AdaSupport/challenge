# Challenge
Hello :wave:

This is our challenge for potential new team members. The code is for a simple real-time TODO app. The challenge here is to fix some bugs, make some improvements and push your code for evaluation by @davidhariri.

When you're finished, you should have a real-time TODO app that two or more people could use to share TODO's with one another. Imagine a TODO list our team could use for office chores, for example.

## Notes
- When we make, complete or delete a TODO item, it should show up the same way on all clients. To test this, I recommend having two browser windows open (one in-cognito and one not).
- We're evaluating you on completion of the quest list below, but also on style. Do you commit often? Are you sticking to the principles of DRY? Did you make code and UI that _you_ would enjoy reading and using? Things like that are important to our team. 👊
- Please make a `start` commit on your own branch so I know how long it takes you to complete the challenge. It's not a race, but I expect this to be <= a days work.
- This should be fun! If you're stuck on a bug or something needs clarification you can [email me](mailto:david@ada.support?subject=Challenge) for help.
- If you prefer a functional style (or some other style of programming) feel free to switch things up to suit how you write best. I left the codebase intentionally small to support different styles/complete rewrites. Don't let how we've set things up get in the way of showing us your best work.

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
