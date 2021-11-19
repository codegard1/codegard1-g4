---
title: "New site design is causing problems"
tags: ["gatsby"]
published: true
date: "2021-11-14"
---

I recently upgraded to Gatsby v4 and in so doing re-created the site from scratch using a generic starter.

The redesign is welcome because the old one was causing me a lot of headaches from the constant compatibility warnings. However

However, the new version also seems to perform much worse, in that pages don't load completely on the first try; it seems you have to refresh the page every time to get all the CSS to render properly. I'm not sure what the cause is, but rest assured I will find and crush it.

Edit: The issue is almost certainly that it is trying to load too many images at once, which is not really the purpose of a static site generator. I have limited the image output on the gallery page to 50, which seems to perform much better.
