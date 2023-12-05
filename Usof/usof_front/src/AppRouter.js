import React, {useContext} from 'react';
import { Route, Navigate, Routes} from 'react-router-dom'
import Main from './pages/MainP';
import Auth from './pages/Auth';
import { Context } from "./index";
import Profile from './pages/Profile';
import Response from './pages/Response';
import Post from './pages/Post';
import AddPost from './pages/AddPost';
export const MAIN_PAGE = "/";
export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const POST_ROUTE = "/post";
export const ADDPOST_ROUTE = "/addpost";
export const PROFILE_ROUTE = "/profile";
export const RESPONSEPASS_ROUTE = "/response/pass";
export const RESPONSEMAIL_ROUTE = "/response/email";



const authRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: ADDPOST_ROUTE + '/:postId',
        Component: AddPost
    },
    //{
    //    path: BASKET_ROUTE,
    //    Component: Basket
    //},
]

const publicRoutes = [
    {
        path: MAIN_PAGE,
        Component: Main
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTER_ROUTE,
        Component: Auth
    },
    {
        path: RESPONSEPASS_ROUTE + '/:confirm_token',
        Component: Response
    },
    {
        path: RESPONSEMAIL_ROUTE + '/:confirm_token',
        Component: Response
    },
    {
        path: POST_ROUTE + '/:id',
        Component: Post
    },
];

const AppRouter = () => {
    const {user} = useContext(Context)

    //console.log(user)
    return (
        
        <Routes>
            {user.isAuth && authRoutes.map(({path, Component}) =>(
                <Route key={path} path={path} element={<Component />} exact/>
            ))}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} exact />
            ))}
            <Route path="*" element={<Navigate to={MAIN_PAGE} />} />
        </Routes>
    );
};

export default AppRouter;
