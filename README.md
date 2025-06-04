# GoalTracker

This mobile app lets users set goals and create plans! Users can invite friends to join plans to track shared progress and be accountable to each other. Notifications are sent when one individual has completed their task for the day to remind and incentivize users to do their part. The app will also implement OAuth sign-in features.

## Database Design: ERD 
![image](https://github.com/user-attachments/assets/ae4c0601-497c-469a-a556-4f06dee53a95)

The PostgreSQL backend, served up through Supabase, will keep track of basic data such as users, their associated list of plans, and the progress markers for each plan.

## System Design: 


## UX Design:
![image](https://github.com/user-attachments/assets/2ecd695c-0e5e-4bf6-a921-f6d86a7b697b)

The UX will consist mainly of 5 screens: 
- A login page where users can register or sign in
- Their home page which shows the list of current plans and a button for adding a new plan
- The resulting pop-up page to fill in the details of making a new plan
- The page for viewing and keeping track of the progress of a current plan
- And a simple settings or user info page
