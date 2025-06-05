# GoalTracker

This mobile app lets users set goals and create plans! Users can invite friends to join plans to track shared progress and be accountable to each other. Notifications are sent when one individual has completed their task for the day to remind and incentivize users to do their part. The app will also implement OAuth sign-in features.

## Database Design: ERD 
![image](https://github.com/user-attachments/assets/ae4c0601-497c-469a-a556-4f06dee53a95)

The PostgreSQL backend, served up through Supabase, will keep track of basic data such as users, their associated list of plans, and the progress markers for each plan.

## System Design: 
![image](https://github.com/user-attachments/assets/4d01817f-cb6e-4182-b640-7af73f68a0c5)

The system serves up the frontend mobile app using Expo React Native for the client to interact with. The backend uses Supabase (Postgre database, Auth, Realtime) for the backend. When the client logs in, Auth handles their authorization and updates the frontend so the client can view their other screens. As clients create plans and record their progress, the changes are written to the database and the UI is updated. Lastly, when one user records their progress and the database is changed, it will trigger a notification event that is sent in realtime to the other friend on the plan.

## UX Design:
![image](https://github.com/user-attachments/assets/2ecd695c-0e5e-4bf6-a921-f6d86a7b697b)

The UX will consist mainly of 5 screens: 
- A login page where users can register or sign in
- Their home page which shows the list of current plans and a button for adding a new plan
- The resulting pop-up page to fill in the details of making a new plan
- The page for viewing and keeping track of the progress of a current plan
- And a simple settings or user info page

## Timeline:
- 6/4: Refine auth flow, tokens, and storage of user data
- 6/5: Create layout for homepage
- 6/6: Add button to bring up initial view for creating a plan
- 6/7: Make basic goal creation logic, integrated with database + simple UI
- 6/9: Implement the friend invite system
- 6/10: Create UI and logic for tracking the plan progress page
- 6/11: Have the UI updating in realtime for other users
- 6/13: Begin working on push notifications
- 6/14: Get a basic notification working, refine and test UI
- 6/16: Polish details and present project!
