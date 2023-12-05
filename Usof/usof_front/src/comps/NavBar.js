import React, {useContext} from 'react';
import {Context} from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {LOGIN_ROUTE, MAIN_PAGE, PROFILE_ROUTE} from "../AppRouter";
import {Button} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { logout } from "../server/AuthAPI";
import { Avatar } from '@mui/material';
const NavBar = observer(() => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const isProfile = (location.pathname === PROFILE_ROUTE);

    const logOut = () => {
        user.setToken({})
        user.setIsAuth(false)
        logout();
        navigate(MAIN_PAGE);
    }

    return (
        <Navbar style={{ background: "#1B4965" }} variant="dark">
            <Container>
                {!isProfile &&
                    <NavLink style={{color:'white'}} to={PROFILE_ROUTE}>
                    {user.token && (<Avatar variant="rounded" src ={`http://localhost:3002/api/users/${user.token.user_id}/avatar`} />)}
                    </NavLink>
                }
                <NavLink style={{color:'white'}} to={MAIN_PAGE}>toMain</NavLink>

                {user.isAuth ?
                    <Nav className="ml-auto" style={{color: 'white' }}>
                        <Button
                            variant={"outline-light"}
                            onClick={() => logOut()}
                            className="ml-2"
                            style={{ backgroundColor: "#62B6CB" }}
                        > Logout </Button>
                    </Nav>
                    :
                    <Nav className="ml-auto" style={{color: 'white'}}>
                        <Button variant={"outline-light"}
                        style={{ backgroundColor: "#62B6CB" }} onClick={() => navigate(LOGIN_ROUTE)}>Log in</Button>
                    </Nav>
                }
            </Container>
        </Navbar>

    );
});

export default NavBar;