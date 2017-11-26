# Challenge Solution

I took a lunch break in the middle, which I think is noticeable in the logs. 😅

I relied on:

- `Mithril.js` for manipulation of the DOM.
- `Picnic.css` for some simple styling.
- a Lea Verou CSS pattern to fill the space on wide-screen displays.
- Mocha & Chai for the requisite Node testing.

The extra features added were simple:

- Allow edit of task names
- Notify user of connection status, and disconnections
- Autoscroll when new tasks added

Some comments:

- I would normally structure the file tree differently, but I kept it as provided because I was already being plenty opinionated with eg: my chosen rendering engine.
- No minification/bundling/transpiling, etc. Just a code showcase for modern devices (For personal projects I test on Firefox Nightly, Chrome, and Mobile Safari).
- The header and footer use the CSS `position: sticky` property, which is not fully well implemented in all browsers. For example, in Safari, If an parent element has overflow of any kind, it defaults back into the inline property. In a real setting I would test with multiple devices and use workarounds and shims as needed.
- The fact that the "database" is a list opens us to a bunch of race conditions (e.g: if a user deletes a task, another user modifies the same task before being notified of deletion, then the modification would apply to an unintended target). I considered adding a transational mechanism, or annotating the todos with a uuid myself, but decided it wasn't anything particularly exciting.
- I don't know if it was clear from the phone conversation, but I don't usually reach for JavaScript on the server-side. I usually use Python with `pytest`. Since this is my first time touching Mocha & Chai, instead of figuring out how to test websockets, I just separated the "database" into its own file and tested functions that modified it.
- The task was small enough that I did not reach for TypeScript. However, I feel like by the end it was just big enough to be worth it. Lesson: always use TypeScript.


##  Log
- [x] Fix all the bugs
- [x] Add a feature that allows users to complete tasks
- [x] Add a feature that allows users to delete tasks
- [x] Add a feature that allows the completion of all tasks
- [x] Add a feature that allows the deletion of all tasks
- [x] Add caching to the client app so that when we lose our connection we can still see our TODO's
- [x] Make it look right on mobile devices
- [x] Make a design change to improve the user experience
- [x] Write some unit tests for your server side code

## Set Up

```sh
npm install
node server
```

To expose the file to mobile devices in a LAN network, open a new terminal on the directory containing the files to be served, and run

```sh
python3 -m http.server
```

Now open `index.html` in your browser(s).
