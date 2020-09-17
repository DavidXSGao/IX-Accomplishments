# IX ACCOMPLISHMENT- React
This webapp was created for individuals to recognize each other for their accomplishes on a public forum.

## Getting Started
### One Time Installation

1) Install MongoDB

```
https://www.mongodb.com/download-center?_ga=2.72891354.853422023.1524851706-456132331.1516220697&_gac=1.237789748.1524851706.EAIaIQobChMI7bjmoIPb2gIVyZyzCh3ISQVbEAAYASAAEgJhdPD_BwE#production
```

2) Clone repository

```
git clone git@gitlab.internal.casalemedia.com:david.gao/ix-accomplishments.git
```

3) Install new npm modules using node

```
npm install
```

### Running the App
1) Run the ix-accomplishments app.

```
npm start
```

2) Go to port 9001 of your localhost to see the app. [http://localhost:9001](http://localhost:9001)


3) Go to port 9002 for the api server [http://localhost:9002/api](http://localhost:9002/api)

Routes:
```
/loadseeddata - loads all the seed users scraped from namely (March 12, 2018)
/factoryreset - DELETE request that removes all entries in MongoDB
/accomplishments - lists all the accomplishments in the database
/users - lists all the users in the database (and all associated information)
/fullnames - lists all the users full name only
/departments - lists all the departments scraped from namely (March 12, 2018)
/previewrecentaccomplishments - lists 10 most recent accomplishments
/previewmostrecognized - lists 5 users with the most received accomplishments
/previewmostrecognitions - lists 5 users with the most given recognitions
/usersfromdepartment/:department - lists all the full names of the users from the specified department (case and space sensitive)
/departmentfromuser/:user - lists the department the user belongs to
/imagefromuser/:user - lists the image name of the user (which can then be found in public/images)

```

4) This app uses database "ixAccomplishments" in MongoDB.

5) Upon initial launch of the app the seed data should be loaded to populate the users in MongoDB. This can be done by visiting [http://localhost:9002/api/loadseeddata](http://localhost:9002/api/loadseeddata)

6) The seed data mentioned above is up to date as of April 2, 2018. To update the seed data, please follow the instructions in the [readme file](http://gitlab.internal.casalemedia.com/david.gao/ix-accomplishments/blob/master/src/scripts/README.md) of the [scripts folder](http://gitlab.internal.casalemedia.com/david.gao/ix-accomplishments/tree/master/src/scripts)

### Upcoming Features

Stop pinging the database every 5 seconds to check for an update

Rewards page

Leaderboard page

Search functionality

About page

### NOTE
If a new user is added **through the UI** you **MUST** add their picture manually into 'public/images' otherwise they will be given the default anonymous picture as their display picture.
