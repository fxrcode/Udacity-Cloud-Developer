# Project 2: Udagram: Your own Instagram on AWS

## Implement endpoint to process image_url
* as in server.ts.
* It'll return 200 if image_url is valid, and processed, and returned filtered image in response.
* It'll return 400 if image_url is null/empty.

## Deploy
* need to package to www folder: `npm run build`.
* create eb config: `eb init`: select some options.
* eb environment create and deploy: `eb create`: select some options.
* go get eb DNS CNAME, url: `image-filter-starter-code-dev.us-west-1.elasticbeanstalk.com`

## Verification
* used postmane to GET ebs endpoint to filter image: `http://image-filter-starter-code-dev.us-west-1.elasticbeanstalk.com/filteredimage?image_url=https://i.ytimg.com/vi/n9sLZPLOxG8/maxresdefault.jpg`
    * got from YouTube: How do transformers work? (Attention is all you need)
    * ![img](/img/postman-test.png)