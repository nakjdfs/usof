import React, {useContext, useEffect } from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { getUser} from "../server/UserAPI";
import {getPosts, getPostCateg} from "../server/PostAPI";
import {Card, Row, Col, Container, Button} from "react-bootstrap";
import {ADDPOST_ROUTE, MAIN_PAGE, POST_ROUTE} from "../AppRouter";
import { Avatar } from '@mui/material';

const PostTemp = ({p}) => {
	const {user} = useContext(Context);
    const navigate = useNavigate();
    console.log(p.id);

    return (
        <Card.Body  onClick={() => navigate(POST_ROUTE + '/' + p.id)} 
		elevation={3} sx={{ width: "100%", height: "100%", position: "relative", justifyContent: 'space-between',}}
		style={{
			border: '1px solid #62B6CB',
			borderRadius: '8px',
			padding: '15px',
			cursor: 'pointer',
			backgroundColor: '#1B4965',
			color: 'white',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'start',
			overflow: 'hidden',
		  }}>
			<Row>
				<Col xs={2}>
				{(<Avatar variant="rounded" sx={{ width: 30, height: 30, marginRight: 5, display: "block" }}
				src ={`http://localhost:3002/api/users/${p.author}/avatar`} />)}
				</Col>
				<Col xs={10}>
				<p><b> {p.authorTitle}</b></p>
				</Col>
			</Row>
			<Row>
				<Col>
				<h5>{p.title}</h5>
				</Col>
			</Row>
			<div style={{ display: "flex" }}>
				<p>Rating: {p.rating}</p>
				<p style={{ marginLeft: "10px", maxWidth: "90%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis", }}>{" Categories:" + p.categories}</p>
			</div>
			<p style={{ maxWidth: "90%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",}}>{p?.content}</p>
        </Card.Body>
      );
    
/*
    return (
        <Col md={3} className={"mt-3"} key={p.id} onClick={() => navigate(POST_ROUTE + '/' + p.id)}>
            <Card className="d-flex flex-fill" style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }} border={"light"}>
                <div className="d-flex align-items-center mt-2">
                    {(<Avatar variant="rounded" src ={`http://localhost:3002/api/users/${p.author}/avatar`} />)}
                    <div className="font-weight-bold">{p.authorTitle}</div>
                </div>
                <div className="text-dark mt-1 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold h5 mb-0">{p.title}</div>
                    <div className="d-flex align-items-center">
                        <div className="font-weight-bold mr-2">{p.rating}</div>
                    </div>
                </div>
                <div className="mt-2 text-muted">{p?.content?.split(' ').slice(0, 5).join(' ')}</div>
                <div className="mt-2 text-muted font-italic">{p.categories}</div>
            </Card>
        </Col>
    );*/
};

export default PostTemp;