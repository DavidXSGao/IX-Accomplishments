# Dashboard component
This component is used to display both the accomplishments and the leaderboards

# MostRecogized component
This component is the leaderboards component. This will display different data depending on the category prop passed in from the dashboard component. Passing in "mostrecognitions" as the category will display the leaderboard for people who **received** the most recognitions. Passing in "mostrecognized" as the category will display the leaderboard for people who **given** the most recognitions.

This will only display the top 5 users based on the number of times given/received and update timestamp.

# RecentAccomplishments component

This component is the accomplishments component. This will allow users to edit and delete the accomplishment if they are the giver, and only delete the accomplishment if the user is the recipient.

This will only display the top 10 accomplishments based on the update timestamp.