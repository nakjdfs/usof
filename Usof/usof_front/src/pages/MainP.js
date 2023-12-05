import React, {useContext, useEffect } from 'react';
import {Context} from "../index";
import {LOGIN_ROUTE, MAIN_PAGE, POST_ROUTE} from "../AppRouter";
import {observer} from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {getPosts} from "../server/PostAPI";
import PostList from '../comps/PostList';
import Pages from '../comps/Pages';
import Categories from '../comps/Categories';

const Main = () => {
    
    return (
        <Container>
            <Row className="mt-2">
                <Col md={9}>
                    <Categories/>
                </Col>
                <Col md={9}>
                    < PostList />
                    <Pages/>
                </Col>
            </Row>
        </Container>
    );
};

export default Main;