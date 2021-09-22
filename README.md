# Explainer

- dist/index.html is the example HTML. You can change the video-url to the appropriate one.
- dist/main.js is the script. Just import this on the page where this HTML sits.
- ignore the rest.

## Want to update the style?

You cant edit the CSS directly for the banner as it resides in the JS, you will have to write your own CSS in a new file/location to edit it.

> This doesnt have a mobile design, so you will have to do this yourself if its what you want.

## Notes:

- Dont add more than one element per slide.
- Click to slide is not supported - dont have the time to get it working properly without jank.
- Controls methods are: touch drag (mouse and touch), arrow keys, and arrow buttons. 