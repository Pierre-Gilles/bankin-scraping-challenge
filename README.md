Bankin' Scraping Challenge
=======================

The goal of this challenge is to scrape a crappy bank website as fast as possible.

Concept
-------------

Here, we've got a really crappy website. The disposition of the website changes all of the time, sometimes there is a table, sometimes it's a iframe, sometimes you need to close an alert, it's a mess.

But the real difficulty here is not really about parsing the data. In fact, it was the easiest thing in this challenge, because you have just 2 cases: 
- It's an iframe
- It's a table

In more or less 10/20 minutes, you can code a simple parser that does the job.

The real challenge here, is to parse the whole website **as fast as possible**.

## What I supposed

I found on GitHub other scripts coded for this challenge, and saw hardcoded "5000" values, because people found that in this example, the website just has 5 000 pages. 
But **it's not the case in real life**, and I suppose engineers working at Bankin' do not know how many pages there are on bank account of their customers.

In real life, you need to get pages one by one until there is no more page. That's slow.

I saw other scripts, where people were loading the page once, then modifying the script and doing everything on their side without having to rebuild the DOM XX times. Ok, this is really fast. But again, this is cheating! 

In real life, you get the data from the server, and if you need to parse 1000 pages, you need to load 1000 pages. Client side rendering here was just for this challenge, so modifying the client script it's not really scraping, it's re-coding this challenge !

## Work done here

I decided to build this parser as close as possible as it would be in real life. So yes, I'm loading all the pages from `?start=0` to `?start=5000`, without hardcoding the 5000 value.

But rather than going it 1 by 1, I decided to load pages in parallel, 10 by 10 for example.

So I'm starting a headless Chrome instance, and I open 10 tabs. Each tab is loading a page, and is assigned a page that has not been explored yet. By doing that, we are browsing waaay faster than if it was just done sequentialy.

The only tradeoff with this method, is that you could browse useless pages. For example here, the script may browse page 5100 even if it's not relevant (pages are stopping at 5000). But it's not a problem, because all that happens in parallel, so when you consider the whole problem, it will be way faster with the parallel method!

Benchmarking
-------------

On average, with a concurrency of 30 simultaneous instances on a Macbook Pro 2017, the script is able to browse, fetch, parse and write the JSON file in **13 seconds**.
The result is really variable because the display of the page is completely random in the client side script, and last pages are taking up to **7 seconds** to load!

As we have 5000/50=100 pages to load here, it means that on average one page of data takes **130 ms** to be loaded. In fact it's really not the case because this horrible website loads in 6/7 seconds sometimes, but as we are highly parallelizing everything, we are reducing theses horrible loading times on average.

Prerequisites
-------------

To use this script, you just need Node.js > v8.x.x and install dependencies.

My only dependency is puppeteer that I used to start an headless Chrome instance.

Installation
-------------

Run :

```
git clone https://github.com/Pierre-Gilles/bankin-scraping-challenge.git pierre-gilles-bankin-scraping-challenge
```

```
cd pierre-gilles-bankin-scraping-challenge
```

```
yarn install
```

Usage
-------------

To use this script, simply run :

```
node index.js
```

Who am I ?
-------------

<img src="https://pierregillesleymarie.com/logo-2x.jpg" width="200">

My name is [Pierre-Gilles Leymarie](https://pierregillesleymarie.com/), I'm a french back-end Engineer working at BulldozAIR, a YC S16 startup!

I founded an open-source home automation project, [Gladys](https://gladysproject.com) 4 years ago, it's basically a home assistant who controls everything at home (lights, music, coffee machine, etc...), and who helps the user is his everyday life by **predicting his needs**.

Gladys is 100% built with Node.js, and has been downloaded **more than 27 000 times**, and numbers are growing everyday! If you want to automate your home with an open-source solution, Gladys is the way to go ;)