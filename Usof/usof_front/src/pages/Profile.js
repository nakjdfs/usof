import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { NavLink, useLocation, Navigate, useNavigate } from "react-router-dom";
import { REGISTER_ROUTE, LOGIN_ROUTE, MAIN_PAGE } from "../AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { login as log_in, registration } from "../server/AuthAPI";
import { getPostCateg, getPostUserLike} from "../server/PostAPI";
import {getUser, getUserPost} from "../server/UserAPI";
import PostTemp from '../comps/PostTemp';
import SettingsBar from '../comps/SettingsBar';


const Profile = observer(() => {
    const {user} = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLiked] = useState([]);

    //let isAuthenticated = false;
    useEffect(() => {
        const start = async () => {
            try {
                const userPosts = await getUserPost(user.token.user_id);
                const postsWithCategories = await Promise.all(userPosts.map(async p => {
                    p.categories = await getCategories(p.id);
                    p.authorTitle = await getAuthor(p.author);
                    return p;
                }));
                setPosts(postsWithCategories);
                const userLikedPosts = await getPostUserLike(user.token.user_id);
                console.log(userLikedPosts);
                const likedPostsWithCategories = await Promise.all(userLikedPosts.map(async p => {
                    p.categories = await getCategories(p.id);
                    p.authorTitle = await getAuthor(p.author);
                    return p;
                }));
                setLiked(likedPostsWithCategories);
                
                console.log(posts)
            } catch (e) {
                console.log(e.response.data.message);
            }
        };
        async function  getCategories(post_id){
            let str ="";
            let data;
            try {
             data = await getPostCateg(post_id);
            }
            catch (e) {
                console.log(e.response.data.message);
            }
            data?.map((c, index) => {
                str += c.title;
                if (index < data.length - 1) {
                  str += ", ";
                }
              });
            //console.log("Categories = "+ str);
            return str;
        }
        async function  getAuthor(user_id){
            let data;
            try {
             data = await getUser(user_id);
            }
            catch (e) {
                console.log(e.response.data.message);
            }
            return data.full_name ? data.full_name : data.login;
        }

        start();
    }, []);

    return (
        <Container fluid>
            <Row>
                    <Col lg={6}>
                    {/* Основний контент на всю ширину екрану */}
                    <h1>Основний контент</h1>
                    {/* Додайте сюди інші елементи або компоненти */}
                    <SettingsBar />
                    </Col>
                    <Col lg={3}>
                    {/* Колонка для постів з правого боку */}
                    <div style={{ padding: '15px' }}>
                        <h2>Мої пости</h2>
                        {posts.map(p => (
                        <Card key={p.id} className="mb-3" style={{ width: '100%' }}>
                                <PostTemp p={p} />
                        </Card>
                    ))}
                    </div>
                    </Col>
                    <Col lg={3}>
                        {/* Додайте ще одну колонку для уподобаних постів */}
                        <div style={{ padding: '15px' }}>
                            <h2>Уподобані пости</h2>
                            {likedPosts.map(lp => (
                            <Card key={lp.id} className="mb-3" style={{ width: '100%' }}>
                                <PostTemp p={lp} />
                            </Card>
                            ))}
                        </div>
                    </Col>
            </Row>
        </Container>
    );
});

export default Profile;