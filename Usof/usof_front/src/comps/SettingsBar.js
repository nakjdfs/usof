import React, { useContext, useState } from "react";
import { Container, Form, Alert,Modal  } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, Navigate, useNavigate } from "react-router-dom";
import { REGISTER_ROUTE, LOGIN_ROUTE, MAIN_PAGE } from "../AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { login as log_in, registration, ressetPass } from "../server/AuthAPI";
import { delete_user,patch_avatar, patch_user } from "../server/UserAPI";

const SettingsBar = observer(() => {
    const {user} = useContext(Context);
    const location = useLocation();
    const isLogin = (location.pathname === LOGIN_ROUTE);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //let isAuthenticated = false;
    const [login, setLogin] = useState("");
    const [fullName, setFull] = useState("");
    const [password, setPassword] = useState("");
    const [handleAvatarChange, setAvatar] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [ressetP, setRessetP] = useState(false);
    const [ressetI, setRessetI] = useState(false);
    const [ressetN, setRessetN] = useState(false);
    
    //useEffect(() => {
    //    set
    //}, []);

    const passResset = async () => {
        setRessetI(false);
        if(ressetP === false){
            setRessetP(true);
            return null;
        }
        //console.log("reset:" +resset);
        try{       
            setSuccess(await ressetPass(password, user.token.email));
            //console.log("Response: " + user.token);
            //console.log("reset:" +message.message);
            setRessetP(false);
        }catch(e){
            setError(e.response.data.message);
            console.log(e.response.data.message);
        }
        
    };
    const changeName = async () => {
        setRessetI(false);
        setRessetP(false);
        if(ressetN === false){
            setRessetN(true);
            return null;
        }
        //console.log("reset:" +resset);
        try{       
            setSuccess(await patch_user( user.token.user_id, fullName, login));
            //console.log("Response: " + user.token);
            //console.log("reset:" +message.message);
            setRessetN(false);
        }catch(e){
            setError(e.response.data.message);
            console.log(e.response.data.message);
        }
        
    };
    const changeAvatar = async()=>{
        setRessetP(false);
        if(ressetI === false){
            setRessetI(true);
            return null;
        }
        try{       
            setSuccess(await patch_avatar(handleAvatarChange));
            //console.log("Response: " + user.token);
            //console.log("reset:" +message.message);
            setRessetI(false);
        }catch(e){
            setError(e.response.data.message);
            console.log(e.response.data.message);
        }

    }
    const delUser = async ()=>{
        setRessetP(false);
        setRessetI(false);
        try{     
            await delete_user(user.token.user_id, user.token);
            user.setToken({});
            user.setIsAuth(false);
            navigate(MAIN_PAGE);
        }catch(e){
            setError(e.response.data.message);
            console.log(e.response.data.message);
        }
    }

    return (
        <Card className="p-5">
            <h2 className="m-auto">Settings</h2>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {success && (<Alert variant="success" className="mt-3">{success.message}</Alert>)}
            <Form className="d-flex flex-column">
            
                {ressetP && (
                <Form.Control
                    className="mt-3"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                />)}
                <Button className="mt-3" variant="outline-success" onClick={passResset}>Resset Password</Button>
                <Form.Group controlId="formFile" className="mt-3">
                {ressetI &&(<Form.Label>Choose Avatar (JPG only)</Form.Label>)}
                {ressetI &&(<Form.Control type="file" accept=".jpg" onChange={(e) => setAvatar(e.target.files[0])} />)}
                </Form.Group>
                <Button className="mt-3" variant="outline-success" onClick={changeAvatar}>Change avatar</Button>
                {ressetN && (
                <Form.Control
                className="mt-3"
                placeholder="Set new Username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}/>)}
                {ressetN && (
                <Form.Control
                className="mt-3"
                placeholder="Set new Full Name"
                value={fullName}
                onChange={(e) => setFull(e.target.value)}/>)}

                <Button className="mt-3" variant="outline-success" onClick={changeName}>Change name</Button>
                <Button className="mt-3" variant="outline-success" onClick={() => {setShowDeleteModal(true);}}>
                Delete account
                </Button>
                {user.token.role && <Button className="mt-3" variant="outline-success" href="http://localhost:3002/admin">
                to Admin
                </Button>}
            </Form>
            <Modal show={showDeleteModal} onHide={() => {setShowDeleteModal(false);}}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => {setShowDeleteModal(false);}}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={delUser}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>

        </Card>
    );
});

export default SettingsBar;