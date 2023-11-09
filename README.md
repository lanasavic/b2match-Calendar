### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in browser.

The page will reload as changes are made.\

---

Task was to create a calendar on the user interface.\
Design could have been either followed from the (attached) picture or of own choice.\

Some of the points to achieve were:
- Switching between months
- For every month, displaying only the dates of that month
- Fetching data from the GitHub API and appropriately showing it in the calendar
- Additional: When clicking on an event in the calendar, displaying more details about that event

There was a possibility of using a DateTime handling library, therefore **Luxon** was used in the project.\
As for the API, **GitHub REST API** was used.\
Events in the calendar are commits made by the owner of the repository. They are reached through an API: `https://api.github.com/repos/${owner}/${repo}/commits`\
Documentation: [List commits](https://docs.github.com/en/rest/commits/commits)

*Note: it is neccessary for the owner of the repository to generate a new **accessToken** to ensure continued authenticated access to the GitHub API.*\