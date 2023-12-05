import React, { useContext, useState, useEffect } from "react";
import { Container, Form, Alert } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, Navigate, useNavigate,useParams } from "react-router-dom";
import { RESPONSEMAIL_ROUTE, RESPONSEPASS_ROUTE} from "../AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { ressetPassConf, verifyEmail } from "../server/AuthAPI";

const Response = observer(() => {
    const {confirm_token} = useParams();
    const {user} = useContext(Context);
    const location = useLocation();
    const isEmail = location.pathname.includes(RESPONSEMAIL_ROUTE);
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    useEffect(() => {
         const  start = async () =>{
            try{
                if(isEmail){
                    console.log("email eeee")
                    setSuccess(await verifyEmail(confirm_token));
                }else{
                    setSuccess(await ressetPassConf(confirm_token));
                }
            }catch(e){
                setError(e.response.data.message);
                console.log(e.response.data.message);
            }
        };
        start();
        
    }, []);


    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {success && <Alert variant="success" className="mt-3">{success.message}</Alert>}
            </Card>
        </Container>
    );
});

export default Response;