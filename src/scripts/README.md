## Updating New Users Through Scripts
### Updating Seed Users

1) Download the [Postman Extension](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en) for Google Chrome

2) Open the Postman application and turn on Postman Interceptor to allow access to cookies and cache stored in Google Chrome's session

```
Note: Postman Interceptor is required because Namely requires an authentication token to access their API. The process to obtain an authentication token from Namely is through a manual email exchange.
```

3) Log into your [Namely profile](https://indexexchange.namely.com/) on Google Chrome

4) Using Postman's GET request hit the endpoint for page 8 of Namely's profiles for Index Exchange: [https://indexexchange.namely.com/api/v1/profiles.json?filter[user_status]=active&page=8&per_page=50](https://indexexchange.namely.com/api/v1/profiles.json?filter[user_status]=active&page=8&per_page=50)

```
Note: Namely profiles are ordered by creation date. Therefore the last page refers to the latest users added. Each request will return a maximum of 50 profiles (by default if per_page is not set, it will only return 25 profiles).
```

5) Copy the response's body and replace the contents of 'src/data/users8.json' with the response's body

6) Check to see if there are any new pages. If so a new json file will need to be added users[page].json in src/data and the scripts will need to be updated to read that file

7) Navigate to the root folder

```
cd path/to/ix-accomplishments
```

8) Run the createSeedUsers.js script

```
node createSeedUsers.js
```

9) Hit the [loadseeddata](http://localhost:9002/api/loadseeddata) api call in the browser by visiting the url:

```
http://localhost:9002/api/loadseeddata
```

### Updating Users Pictures

1) Delete all the images in 'public/images'

2) Navigate to the root folder

```
cd path/to/ix-accomplishments
```

3) Run the generateImageUrl.js script

```
node generateImageUrl.js
```

4) Download the [Tab Save](https://chrome.google.com/webstore/detail/tab-save/lkngoeaeclaebmpkgapchgjdbaekacki) extension for Google Chrome to download all the images given a list of URLs

```
Note: Curl and other scripts will not work to grab the images in this case since Namely requires an authentication token to access their API. The process to obtain an authentication token from Namely is through a manual email exchange.
```

5) Open the image.txt file in src/data/images.txt

6) Change the download folder of Google Chrome to 'public/images' of this project for ease

7) Paste the URLs into the Tab Save extension and run the extension. Wait for all the images to finish downloading

8) Navigate to the root folder

```
cd path/to/ix-accomplishments
```

9) Run the renameImages.js script

```
node renameImages.js
```

