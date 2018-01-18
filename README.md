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
But **it's not the case in real life**, and I suppose engineers working at Bankin' do not know how many pages there are on bank account of their customer (supposing at some point they need to do some parsing because the bank doesn't have an API).

In real life, you need to get page one by one until there is no more page. That's slow.

I saw other scripts, where people were loading the page once, then modifying the script and doing everything on their side without having to rebuild the DOM XX times. Ok, this is really fast. But again, this is cheating! 

In real life, you get the data from the server, and if you need to parse 1000 pages, you need to load 1000 pages. Client side rendering here was just for this challenge, so modifying the client script it's not really scraping, it's re-coding this challenge !

## Work done here

I decided to build this parser as close as possible as it would be in real life. So yes, I'm loading all the pages from `?start=0` to `?start=5000`, without hardcoding the 5000 value.

But rather than going it 1 by 1, I decided to load pages in parallel, 10 by 10 for example.

So I'm starting a headless Chrome instance, and I open 10 tabs. Each table is loading a page corresponding to a multiple of his number.

| Tab  | Iteration 1 | Iteration 2 | ... | Iteration N | 
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Tab N°0  | ?start=0  | ?start=500  | ... | ?start=(previous + 0*50) |
| Tab N°1  | ?start=50  | ?start=550  | ... | ?start=(previous + 1*50) |
| Tab N°2  | ?start=50  | ?start=600  | ... | ?start=(previous + 2*50) |
| Tab N°3  | ?start=50  | ?start=650  | ... | ?start=(previous + 3*50) |
| Tab N°4  | ?start=50  | ?start=700  | ... | ?start=(previous + 4*50) |
| Tab N°5  | ?start=50  | ?start=750  | ... | ?start=(previous + 5*50) |
| Tab N°6  | ?start=50  | ?start=800  | ... | ?start=(previous + 6*50) |
| Tab N°7  | ?start=50  | ?start=850  | ... | ?start=(previous + 7*50) |
| Tab N°8  | ?start=50  | ?start=900  | ... | ?start=(previous + 8*50) |
| Tab N°9  | ?start=50  | ?start=950  | ... | ?start=(previous + 9*50) |

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