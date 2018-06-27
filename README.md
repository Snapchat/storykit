# Story Kit API

# Story Kit API Documentation

Story Kit includes a [GraphQL](https://graphql.org/ "GraphQL") API service that lets partners search Snapchat Stories by location, time, caption, media type, official username, and more.

Browse this repo for guidance on using the Story Kit API.

## Getting started

### Create an ESDSA key pair
1. Create the private key:
`$ openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem`
2. From your private key, create the public key:
`$ openssl ec -in private-key.pem -pubout -out public-key.pem`

### Send the public key to your Snap advocate
Your advocate at Snap will assign an `iss` and a`kid` to you:

- `iss`
  - A UUID string created to uniquely identify the partner's organization
  - *Example: `dcb57664-94ba-469e-ab4c-e2468ad218b9` is the `iss` we created for `SnapAPITest`*
- `kid`
  - The `iss-version number`
  - `version number` is to support key rotation in the future
  - *Example: `dcb57664-94ba-469e-ab4c-e2468ad218b9-v1` is the `kid` for `SnapAPITest`*

### Send a GraphQL request to Story Kit API endpoint
The Story Kit API only accepts HTTP POST requests that carry the query in the request body and the partner-signed [JWT token](https://jwt.io/introduction/ "JWT token") in the `X-Snap-Kit-S2S-Auth` HTTP header. Learn how to successfully send an HTTP POST request in the steps below.

#### 1. Construct a [GraphQL](https://graphql.org/ "GraphQL") query.

The Story Kit API is [GraphQL](https://graphql.org/ "GraphQL") based. For details, see the GraphQL schema defined in [public_story_api.graphql](gqlschema/public_story_api.graphql).

To construct the query body, use whichever [GraphQL client libraries](https://graphql.org/code/#graphql-clients "GraphQL client libraries") you prefer.

#### 2. Construct the `X-Snap-Kit-S2S-Auth` header.

The header is of the format:
`Bearer <Unsigned Token>.<Signature>`

The token is a [JWT token](https://jwt.io/introduction/ "JWT token"). Below, see the field descriptions and learn how to generate the signature.

```
header = '{
 "alg":"ES256",
 "typ":"JWT",
 "kid": <string: <3pa organization id>-v<key version>> // <key version> is 1, 2, etc., to support key rotation
}'

payload = '{
 "iss": <string: 3PA organization ID>,
 "aud": "PublicStoryKitAPI",
 "exp": <int32: expiry time in seconds from 1970-01-01T00:00:00Z UTC>,
 "iat": <int32: issued time in seconds from 1970-01-01T00:00:00Z UTC>,
 "hash": <string: sha256Hex of request body in all lower case hex chars>
}'
```

Here's how to sign the token:

```
privateKey = <string: private key>
unsignedToken = base64.rawurlencode(header) + '.' + base64.rawurlencode(payload)
signature = base64.rawurlencode(ecdsaSigner.sign(privateKey, unsignedToken))
authorizationHeader = 'Bearer ' + unsignedToken + '.' + signature
request.header(‘X-Snap-Kit-S2S-Auth’, authorizationHeader)
```

And here is an example of the `X-Snap-Kit-S2S-Auth` header:

#### Header
```
{
  "alg": "ES256",
  "kid": "dcb57664-94ba-469e-ab4c-e2468ad218b9-v1",
  "typ": "JWT"
}
```
#### Payload
```
{
  "aud": "PublicStoryKitAPI",
  "exp": 1529640526,
  "hash": "85f07ad28767eaab637a5f78ed3ebc23f58595d08db14df7d8f2df312106cab9",
  "iat": 1527630526,
  "iss": "dcb57664-94ba-469e-ab4c-e2468ad218b9"
}
```

#### Generated token
`Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImRjYjU3NjY0LTk0YmEtNDY5ZS1hYjRjLWUyNDY4YWQyMThiOS12MSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJQdWJsaWNTdG9yeUtpdEFQSSIsImV4cCI6MTUyOTY0MDUyNiwiaGFzaCI6Ijg1ZjA3YWQyODc2N2VhYWI2MzdhNWY3OGVkM2ViYzIzZjU4NTk1ZDA4ZGIxNGRmN2Q4ZjJkZjMxMjEwNmNhYjkiLCJpYXQiOjE1Mjc2MzA1MjYsImlzcyI6ImRjYjU3NjY0LTk0YmEtNDY5ZS1hYjRjLWUyNDY4YWQyMThiOSJ9.OUKz6vPYH6VQVk0KK30qOaUWhvc50WH1HAa-VoXxHnkuG5JmZRFPizbDdEOjK8qSDNGPKuo_X--4MM7faBgLGw`

JWT offers many [token signing libraries](https://jwt.io/) in various languages. To simplify token signing, choose one that fits easily with your tech stack.

#### 3. Send an HTTP POST request to the API endpoint

The final step is sending your HTTP POST request. Make sure it follows these conventions:
- Carries the query in the request body
- Includes the partner signed [JWT token](https://jwt.io/introduction/ "JWT token") in the `X-Snap-Kit-S2S-Auth` HTTP header

Try it out with the beta test endpoint: `https://kit.snap-dev.net/v1/stories/public`

#### Example with curl command
Need an example? See the request and response below.

##### Request
```
$ curl -X POST https://kit.snap-dev.net/v1/stories/public -d '{"query":"query($g:GeoFilterInput!, $o:SearchResultsOrderType!, $p:PagingInput!) {\n  SearchSnaps(geo_filter:$g, order:$o, paging:$p) {\n    snaps {\n      embed_url\n    }\n  }\n  SearchStories(geo_filter:$g, order:$o, paging:$p) {\n    stories {\n      embed_url\n    }\n  }\n  SearchUserStories(user_name:\"kevin guedj\", order:$o, paging:$p) {\n    stories {\n      embed_url\n    }\n  }\n}\n","variables":{"g":{"geotype":"CIRCLE","circle":{"center":{"latitude":37.797548,"longitude":-122.402775},"radius_in_meters":1000000}},"p":{"offset":0,"count":5},"o":"REVERSE_CHRONOLOGICAL"}}' -H "X-Snap-Kit-S2S-Auth: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImRjYjU3NjY0LTk0YmEtNDY5ZS1hYjRjLWUyNDY4YWQyMThiOS12MSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJQdWJsaWNTdG9yeUtpdEFQSSIsImV4cCI6MTUyOTY0MDUyNiwiaGFzaCI6Ijg1ZjA3YWQyODc2N2VhYWI2MzdhNWY3OGVkM2ViYzIzZjU4NTk1ZDA4ZGIxNGRmN2Q4ZjJkZjMxMjEwNmNhYjkiLCJpYXQiOjE1Mjc2MzA1MjYsImlzcyI6ImRjYjU3NjY0LTk0YmEtNDY5ZS1hYjRjLWUyNDY4YWQyMThiOSJ9.OUKz6vPYH6VQVk0KK30qOaUWhvc50WH1HAa-VoXxHnkuG5JmZRFPizbDdEOjK8qSDNGPKuo_X--4MM7faBgLGw"
```
##### Response
```
{"data":{"SearchSnaps":{"snaps":[{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/o:W7_EDlXWTBiXAEEniNoMPwAAYOyGtM6YTz3GaAWP8mLrkAWP8mLigAHanAA\u003e\u003c/iframe\u003e"},{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/o:W7_EDlXWTBiXAEEniNoMPwAAYCVhBPbYycEqMAWP8mLEiAWP8mK-dAHanAA\u003e\u003c/iframe\u003e"},{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/o:W7_EDlXWTBiXAEEniNoMPwAAY68Ac2DZCxDvNAWP8mLYtAWP8mLRuAHanAA\u003e\u003c/iframe\u003e"},{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/o:W7_EDlXWTBiXAEEniNoMPwAAYqAY80LtrnQ1OAWP8mKxiAWP8mKnvAHanAA\u003e\u003c/iframe\u003e"},{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/o:W7_EDlXWTBiXAEEniNoMPwAAYD5qSTgQgIMBlAWP8mKl7AWP8mKdsAHanAA\u003e\u003c/iframe\u003e"}]},"SearchStories":{"stories":[{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/c:14::airpowerout0613::1528907076823\u003e\u003c/iframe\u003e"},{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/c:14::e3expo18::1528932412723\u003e\u003c/iframe\u003e"},{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/c:14::nbaparade18181::1528844423644\u003e\u003c/iframe\u003e"},{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/c:14::musclebeach18::1527628315321\u003e\u003c/iframe\u003e"}]},"SearchUserStories":{"stories":[{"embed_url":"\u003ciframe width=\"270\" height=\"480\" style=\"max-width: 100%; max-height: 100%;\" frameborder=\"0\" src=\"https://play.snapchat.com/kevs2309\u003e\u003c/iframe\u003e"}]}}}
```
