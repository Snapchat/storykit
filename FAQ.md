# Story Kit API FAQ

The Story Kit API is defined by our [GraphQL schema](https://github.com/Snapchat/storykit/blob/master/gqlschema/public_story_api.graphql).

## What kind of Snaps does the Story Kit API serve?

Regular Snaps are private, but a lot of Snaps are for everyone to see. The Story Kit API serves only these *non-private* Snaps from Snapchatters. There are two types of non-private Snaps — we call them *Stories*:

#### [Our Story](https://support.snapchat.com/en-US/a/our-story)
When a Snapchatter posts to Our Story, the Snap lives publicly for 90 days. Snapchat attaches location information (lat/lng, city, or country) to Our Stories — but the Snaps are not attributed.

#### [My Story](https://support.snapchat.com/en-US/article/my-story)
The Story Kit API currently supports *Official Stories*, which are My Stories posted by a verified celebrity. When a Snapchatter posts a Story and sets their sharing setting to *Everyone*, its lifespan is 24 hours. In this case, the username and display name are attached, but location information is hidden. We plan to expand this to our full My Story corpus, which includes *Popular* and *Public User* Stories.

The Story Kit API serves all **Our Stories** and **Official Stories**. In the API response, we do not explicitly include which type of Story each Snap is, but you can differentiate by checking the `expiration_time_secs` field, which indicates when the Snap’s lifespan ends.

## Why are some fields in the response empty?

We hide some of the fields to protect user privacy. For example, we hide `display_name` from Our Story results. In My Story results, city and state information is hidden from the `title` field.

## Can we get a collection of related Stories based on any criteria?
From the Snaps posted to Our Story and My Story, we build two kinds of collection of Stories:

**Per-user**: A collection of Stories a particular user posts to My Story. These Stories live for 24 hours, with location information hidden.

**Per-feature**: A collection of Stories posted to Our Story that share a particular feature, like topic or location. The Stories live for 90 days, and personally identifiable information is hidden.

Note that the above collection of Stories does not represent the entire pool of Snaps available via the Snap Kit API. These collected Stories are limited subsets of all the Snaps. To surface all the available Snaps in the Story Kit API, please use the `SearchSnaps` query.

## What kinds of content do API queries surface?
You can query for different kinds of content:

`SearchSnaps` searches for matching Stories posted to Our Story or My Story.

`SearchStories` searches for matching Stories in Snapchat's curated Story collections. The only difference here is that we've done some of the categorizing for you already and hidden certain PII.

`SearchUserStories` searches for matching Stories in Snapchat's per-user collection only.

You can see the up-to-date list of possible queries in [public_story_api.graphql](https://github.com/Snapchat/storykit/blob/master/gqlschema/public_story_api.graphql) at any time.

## map.snapchat.com shows location-based Snaps. Can we get similar Stories based on the geo location?

Story Kit API doesn’t provide exactly the same contents as map.snapchat.com. However, the `SearchSnaps` query with `GeoCircleInput` in `GeoFilterInput` provides similar results. This query has fewer ranking features applied, so it yields more results, with less sophistication.

## Can we get the list of popular users, so that we can easily search by user using `ContentFilterInput`.

Currently, we only provide Official Stories, or Snaps posted by anyone on our list of a few thousand verified celebrity Snapchatters. We do not provide a list of popular users.

## Can we get a list of popular locations so that we can easily search by location using `GeoFilterInput`?

Currently, we do not provide the list of popular locations.

## Can we get a list of currently trending locations so that we can easily search by location using `GeoFilterInput`?

Currently, we do not provide the list of locations trending now.

## Can we get media download link?

Instead of a media download link, Story Kit API provides an embed link (please adjust ```a_url_suffix``` to what is in the API response):

```<iframe width="270" height="480" style="max-width: 100%; max-height: 100%;" frameborder="0" src="https://play.snapchat.com/a_url_suffix></iframe>```

The embed link enables essential features, like spam reporting, enabling share link, logging, user privacy control, and consistent UI.

## Can we get a feed of interesting Snaps?

The definition of *interesting* Snaps depends on your application. Story Kit API provides rich query filters, including time range, geo bound, and keywords. Use custom filters with varying time range queries or geo bounds to find interesting Snaps for your use case.

## How much rate limiting will be enforced?

Rate limiting helps us support organic query streams while protecting the server from abuse. We enforce rate limiting when the number of Snaps or Stories returned in your organization is excessive. Rates are capped to 3,000 Snaps or Stories per minute for each organization. If you exceed that cap, we stop returning results for 1 to 5 minutes, depending on how much your organization has exceeded the rate-limiting cap. The higher the number of excessive queries, the longer the time penalty.

## How many results can we get for a query?

We support pagination to explore long results, but our service does not offer infinite streaming. Instead, we limit the total number of results for a query to around 500 Snaps. To explore beyond the results from a single query, we recommend modifying the query. Try sliding the time window or changing geo bound.

## Is there any maximum value of `radius_in_meters`?

We have no predefined minimum or maximum value for `radius_in_meters`. However, radius values yield more useful results if they’re neither too specific nor too broad. If `radius_in_meters` is too small, we return empty results for queries to help protect user privacy. If `radius_in_meters` is too large, the resulting Snaps will cut off at around 500. This means only a subset of Stories in that geo will show up. To see richer results, try decreasing your geo radius.

## What should be the shape of the geo polygon?

When making your geo polygon, consider a few characteristics:

**Edge count limit**: As the number of points in the polygon increases, backend server performance degrades, so we limit edges to 100. We recommend about 10–20 points in a polygon.

**Shape**: Use basic shapes. Your query won’t work if the polygon or circle crosses itself or crosses the primary meridian line. Make sure to close the polygon, meaning the first point and final point are the same.

## What does `latitude=0` and `longitude=0` in the response mean?

This means location is unknown or empty. Global searches are one reason for this response.

## Can you be more specific about the meaning of `ANY`, `CAPTION`, `USER`, and `LOCATION` content filters?

Searchable terms are categorized by caption, user, and location.

`CAPTION`: Snapchat users add caption text on their Snaps. Search for Snaps with certain content by the terms in the captions.

`USER`: Username and display name are available for searching for My Story Snaps.

`LOCATION`: City name or country code are available for searching for Our Story Snaps.

`ANY`: Searches the query terms against any of `CAPTION`, `USER`, and `LOCATION`. Returns a Snap if the query term matches at least one of these filters.
