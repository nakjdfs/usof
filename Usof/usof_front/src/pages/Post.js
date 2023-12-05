import React, { useContext, useState, useEffect} from "react";
import { Container, Form, Alert, Card, Button,Row, Col , Modal} from "react-bootstrap";
import { NavLink, useLocation, Navigate, useNavigate, useParams } from "react-router-dom";
import { ADDPOST_ROUTE,REGISTER_ROUTE, LOGIN_ROUTE, MAIN_PAGE } from "../AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { getPost,getPostComm,getPostCateg, delPost, get_PostUserLike, create_PostLike, del_PostLike} from "../server/PostAPI";
import { getUser } from "../server/UserAPI";
import { Avatar } from '@mui/material';
import Comment from "../comps/Comment";

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

const Post = observer(() => {
    const {id} = useParams();
    const {user} = useContext(Context);
    const location = useLocation();
    const [post, setPost] = useState({});
    const [comments, setComms] = useState([]);
    const [comment, setComm] = useState({isAdd: false});
    const [isAddComment, setIsAddComment] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLike, setLike] = useState(false);
	const [isDislike, setDislike] = useState(false);
    //const isLogin = (location.pathname === LOGIN_ROUTE);
    const navigate = useNavigate();
    useEffect(() => {
		const start = async ()=>{
			
				const like = await get_PostUserLike(id);
				//console.log("Like2 "+like.commentId +" "+ comment.id);
				if(like && like.type === "LIKE"){
					setLike(true);
				}else{
					setLike(false)
				}
				if(like && like.type === "DISLIKE"){
					setDislike(true);
				}else{
					setDislike(false)
				}
		}
		start();
	},[isLike, isDislike]);

    useEffect(() => {
        const start = async () => {
            try {
                let userPost = await getPost(id);
                userPost.categories = await getCategories(userPost.id)
                userPost.authorTitle = await getAuthor(userPost.author);
                let postComm = await getPostComm(userPost.id);
                userPost.comments = await Promise.all(postComm.map(async p => {
                    p.authorTitle = await getAuthor(p.author);
                    return p;
                }));
                setPost(userPost);
            } catch (e) {
                console.log(e);
            }
        };
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
        
        start();
    }, []);
    const handleAddComment = () =>{
        //console.log("addddddd");
        if(isAddComment){
            setIsAddComment(false);
            return;
        }
        setIsAddComment(true);
        comment.isAdd = true;
        comment.post_id = post.id;
        comment.author = user.token.user_id;
    }
    const handleDeletePost = async() =>{
        await delPost(post.id);
    }
    async function handleLike (like) {
		if(like === false){
			try{
				const type = "LIKE";
				await create_PostLike(post.id,type )
				setLike(true);
				setDislike(false);
				navigate(0);
			} catch (e) {
				console.log(e.response.data.message);
			}
		}else{
			try{
				console.log("sdfsfd");
				await del_PostLike(post.id)
				setLike(false);
				navigate(0);
			} catch (e) {
				console.log(e.response.data.message);
			}
		}
		
	};
	async function handleDislike (like) {
		if(like === false){
			try{
				const type = "DISLIKE";
				await create_PostLike(post.id,type )
				setDislike(true);
				setLike(false);
				navigate(0);
			} catch (e) {
				console.log(e.response.data.message);
			}
		}else{
			try{
				//console.log("sdfsfd");
				await del_PostLike(post.id)
				setDislike(false);
				navigate(0);
			} catch (e) {
				console.log(e.response.data.message);
			}
		}
		
	};

    return (
        <Container>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                        <Avatar variant="rounded" sx={{ width: 100, height: 100, marginLeft: 3, marginRight: 5, display: "block" }}
                         src ={`http://localhost:3002/api/users/${post.author}/avatar`} />
                        <Card.Title>{post.authorTitle}</Card.Title>
                        <Card.Text>{post.rating}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{new Date(post.createdAt).toLocaleDateString('en-GB')}</Card.Subtitle>
                        <Card.Text>{post.content}</Card.Text>
                        </Card.Body>
                        <div>
                            {!isLike?<ThumbUpOffAltIcon style={{cursor: "pointer"}} onClick={()=>{handleLike(false)}}/>:
                            <ThumbUpAltIcon style={{cursor: "pointer"}} onClick={()=>{handleLike(true)}}/>}
                            {!isDislike?<ThumbDownOffAltIcon  style={{cursor: "pointer"}} onClick={()=>{handleDislike(false)}}/>:
                            <ThumbDownIcon style={{cursor: "pointer"}} onClick={()=>{handleDislike(true)}}/>}
                        </div>
                            {(post.author === user.token.user_id)&& (<div>
                                <Button variant="primary" onClick={()=>{navigate(ADDPOST_ROUTE + `/${post.id}`)}}>Edit Post</Button>
                                <Button variant="danger" onClick={() => {setShowDeleteModal(true);}}>
                                    Dell Post
                                </Button></div>
                                )}
                            
                        <Button variant="primary" onClick={handleAddComment}>
                            Add Comment
                        </Button>
                        
                    </Card>
                <h2 className="mt-4">Comments</h2>
                {isAddComment  && <Comment key={-1} comment={comment} />}
                {post?.comments?.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
                </Col>
                
            </Row>
            <Modal show={showDeleteModal} onHide={() => {setShowDeleteModal(false);}}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your comment?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => {setShowDeleteModal(false);}}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDeletePost}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
});

export default Post;