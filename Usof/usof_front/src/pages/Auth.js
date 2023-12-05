import React, { useContext, useState } from "react";
import { Container, Form, Alert } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, Navigate, useNavigate } from "react-router-dom";
import { REGISTER_ROUTE, LOGIN_ROUTE, MAIN_PAGE } from "../AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { login as log_in, registration } from "../server/AuthAPI";

const Auth = observer(() => {
    const {user} = useContext(Context);
    const location = useLocation();
    const isLogin = (location.pathname === LOGIN_ROUTE);
    const navigate = useNavigate();

    //let isAuthenticated = false;
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');

    const click = async () => {
        setError(false);
        try{
            if (isLogin) {            
                    user.setToken(await log_in(email,login, password));
                    user.setIsAuth(true);
                    console.log("Response: " + user.token);
            } else {
                const response = await registration(login, email, password, confirmPassword);
                console.log("Response: " + response);
                navigate(LOGIN_ROUTE);
            }
        }catch(e){
            setError(e.response.data.message);
            console.log(e.response.data.message);
        }
    };
    if (user.isAuth) {
        return <Navigate to = {MAIN_PAGE} />;
      }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{isLogin ? "Log in" : "Register"}</h2>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Username"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {isLogin ? (
                        <>
                            <Form.Control
                                className="mt-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                            />
                        </>
                    ) : (
                        <>
                            <Form.Control
                                className="mt-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                            />
                            <Form.Control
                                className="mt-3"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                            />
                        </>
                    )}

                    <Row className="d-flex justify-content-between mt-3">
                        {isLogin ? (
                            <div>
                                Don’t have an account? <NavLink to={REGISTER_ROUTE}>Register</NavLink>
                            </div>
                        ) : (
                            <div>
                                Already have an account? <NavLink to={LOGIN_ROUTE}>Log in</NavLink>
                            </div>
                        )}
                        <Button className="mt-3" variant={"outline-success"} onClick={click}>
                            {isLogin ? "Log in" : "Register"}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;