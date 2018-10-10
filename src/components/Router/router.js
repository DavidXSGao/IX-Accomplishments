/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import Dashboard from './../Dashboard/dashboard.js';
import NewPost from './../Create/newPost.js';
import NewUser from './../Create/newUser.js';
import Profile from './../Profile/profile.js';
import About from './../About/about.js';
import Leaderboard from './../Leaderboard/leaderboard.js';
import Rewards from './../Rewards/rewards.js';
import ErrorPage from './../Error/error.js';

/*
	All new routes must be added here
	colons indicate parameters and parenthesis around subpaths indicate optional parameters
*/
const AppRoutes = [
    { path: "/dashboard", name: "Dashboard", component: Dashboard },
    { path: "/newpost", name: "New Post", component: NewPost },
    { path: "/newuser", name: "New User", component: NewUser },
    { path: "/editpost", component: NewPost },
    { path: "/profile/:fullname", component: Profile},
    { path: "/about", component: About},
    { path: "/rewards", component: Rewards},
    { path: "/leaderboard", component: Leaderboard},
    { path: "/error", component: ErrorPage},
    { redirect: true, path:"/", to:"/dashboard", name: "Dashboard" }
];

export default AppRoutes;
