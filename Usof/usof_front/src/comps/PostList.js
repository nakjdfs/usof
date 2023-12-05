import React, {useContext, useEffect, useState } from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { getUser} from "../server/UserAPI";
import {getPosts, getPostCateg} from "../server/PostAPI";
import {Card, Row, Col, Container, Button} from "react-bootstrap";
import {ADDPOST_ROUTE,LOGIN_ROUTE, MAIN_PAGE, POST_ROUTE} from "../AppRouter";
import { Box, Grid } from "@mui/material";
import PostTemp from './PostTemp';
import AddIcon from '@mui/icons-material/Add';
import { get_posts_with_categories } from '../server/CategAPI';


const PostList = observer(() => {
    const {post} = useContext(Context);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [isCateg, setCateg] = useState(false);
    useEffect(() => {
        const start = async () => {
            try {
                const userPosts = await getPosts();
                //console.log("post:"+ userPosts);
                post.setPages(userPosts.count);
                const postsWithCategories = await Promise.all(userPosts.rows.map(async p => {
                    p.categories = await getCategories(p.id);
                    p.authorTitle = await getAuthor(p.author);
                    return p;
                }));
                console.log(postsWithCategories);
                setPosts(postsWithCategories);
            } catch (e) {
                console.log(e);
            }
        };
       
        

        start();
    }, []);
    async function  getCategories(post_id){
        let str ="";
        let data;
        try {
         data = await getPostCateg(post_id);
        }
        catch (e) {
            console.log(e);
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
            console.log(e);
        }
        return data.full_name ? data.full_name : data.login;
    }

    useEffect(() => {
        const fetchData = async () => {
            if(!isCateg){
            try {
                    const userPosts = await getPosts(post.page);
                    
                    const postsWithCategories = await Promise.all(userPosts.rows.map(async p => {
                        p.categories = await getCategories(p.id);
                        p.authorTitle = await getAuthor(p.author);
                        return p;
                    }));
                    console.log(postsWithCategories);
                    setPosts(postsWithCategories);
                } catch (e) {
                    console.log(e.response?.data?.message);
                }
            }else{
                try {
                    
                    const userPosts = await get_posts_with_categories(post.categories, post.page);
                    const postsWithCategories = await Promise.all(userPosts.rows.map(async p => {
                        p.categories = await getCategories(p.id);
                        p.authorTitle = await getAuthor(p.author);
                        return p;
                    }));
                    console.log(postsWithCategories);
                    setPosts(postsWithCategories);
                } catch (e) {
                    console.log(e.response?.data?.message);
                }
            }
            
        };
        fetchData();
    }, [post.page]);

    useEffect(() => {
        const fetchData = async () => {
            if(!post.category){
                try {
                    const userPosts = await getPosts(post.page);
                    post.setPages(userPosts.count);
                    const postsWithCategories = await Promise.all(userPosts.rows.map(async p => {
                        p.categories = await getCategories(p.id);
                        p.authorTitle = await getAuthor(p.author);
                        return p;
                    }));
                    console.log(postsWithCategories);
                    setPosts(postsWithCategories);
                } catch (e) {
                    console.log(e.response?.data?.message);
                }
                setCateg(false);
                return;
            }
            setCateg(true);
            try {
                const userPosts = await get_posts_with_categories(post.category, post.page);
                post.setPages(userPosts.count);
                const postsWithCategories = await Promise.all(userPosts.rows.map(async p => {
                    p.categories = await getCategories(p.id);
                    p.authorTitle = await getAuthor(p.author);
                    return p;
                }));
                console.log(postsWithCategories);
                setPosts(postsWithCategories);
            } catch (e) {
                console.log(e.response?.data?.message);
            }
        };
        fetchData();
    }, [post.category]);

    return (
        <Grid container spacing={2}>
            <Grid key={-1} item xs={12} sm={6} md={6} lg={4}>
            <Button style={{width: "100%", height:"100%"}} variant="primary" onClick={()=>{navigate(ADDPOST_ROUTE + `/${-1}`)}}>
                           <AddIcon/> Add Post</Button>
            </Grid>
                {posts.map((post) => {
                    return (
                        <Grid key={post.id} item xs={12} sm={6} md={6} lg={4}>
                            <PostTemp p ={post} />
                        </Grid>
                    );
                })}
            </Grid>
        
    );
});

export default PostList;
/*
<Row className="d-flex ">
            {posts.map(p =>
                <Col key={p.id} xs={12} sm={6} md={4} lg={3} xl={40} className="mb-3">
                <PostTemp p={p}/>
                </Col>
            )}
        </Row>*/