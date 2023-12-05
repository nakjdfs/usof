import React, {useState,useContext,useEffect} from 'react';
import { Card, Button, Form, Modal, NavLink } from 'react-bootstrap';
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Avatar } from '@mui/material';
import { setPostComm } from '../server/PostAPI';
import {Context} from "../index";
import { editComm, delComm, createComLike, delComLike, getCommLike } from '../server/CommAPI';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';


const Comment = ({comment}) => {
	const {user} = useContext(Context);
	const [newComment, setComm] = useState(comment.content);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isEdit, setEdit] = useState(false);
	const [isLike, setLike] = useState(false);
	const [isDislike, setDislike] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		const start = async ()=>{
			if(isEdit === false){
				const like = await getCommLike(comment.id);
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
			
		}
		start();
	},[isLike, isDislike]);
	
	async function handleAddComment () {
		try{
			await setPostComm(comment.post_id, newComment)
			navigate(0);
		} catch (e) {
			console.log(e.response.data.message);
		}
	};

	async function handleDeleteComment () {
		try{
			await delComm(comment.id)
			setShowDeleteModal(false);
			navigate(0);
		} catch (e) {
			console.log(e.response.data.message);
		}
	};

	async function handleEditComment () {
		if(isEdit === false){
			setEdit(true);
			return;
		}
		try{
			await editComm(comment.id, newComment)
			setEdit(false);
			navigate(0);
		} catch (e) {
			console.log(e.response.data.message);
		}
	};

	async function handleLike (like) {
		if(like === false){
			try{
				const type = "LIKE";
				await createComLike(comment.id,type )
				setLike(true);
				setDislike(false);
				navigate(0);
			} catch (e) {
				console.log(e.response.data.message);
			}
		}else{
			try{
				console.log("sdfsfd");
				await delComLike(comment.id)
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
				await createComLike(comment.id,type )
				setDislike(true);
				setLike(false);
				navigate(0);
			} catch (e) {
				console.log(e.response.data.message);
			}
		}else{
			try{
				//console.log("sdfsfd");
				await delComLike(comment.id)
				setDislike(false);
				navigate(0);
			} catch (e) {
				console.log(e.response.data.message);
			}
		}
		
	};

    return (
		
		<Card className="mt-3">
			{(comment.isAdd === true || isEdit === true) ? (
            <div>
              {/* Вікно для додавання коментаря */}
              <Form.Control style={{ height: 100, marginLeft: 5,marginBottom: 5, }}
                    className="mt-3"
                    placeholder="Username"
                    value={newComment}
                    onChange={(e) => setComm(e.target.value)}
                    />
              <Button variant="primary" onClick={comment.isAdd?handleAddComment:handleEditComment}>
                {comment.isAdd? 'Add Comment': 'Edit comment'}
              </Button>
            </div>
          ):
			(<Card.Body>
			<div className="d-flex align-items-center">
			<Avatar variant="rounded" src ={`http://localhost:3002/api/users/${comment.author}/avatar`} />
				<div>
				<Card.Title>{comment.authorTitle}</Card.Title>
				<Card.Subtitle className="mb-2 text-muted">{new Date(comment.createdAt).toLocaleDateString('en-GB')}</Card.Subtitle>
				</div>
			</div>
			<Card.Text>{comment.content}</Card.Text>
			<Card.Text>Rating: {comment.rating}</Card.Text>
			<div>
				{!isLike?<ThumbUpOffAltIcon style={{cursor: "pointer"}} onClick={()=>{handleLike(false)}}/>:
				<ThumbUpAltIcon style={{cursor: "pointer"}} onClick={()=>{handleLike(true)}}/>}
				{!isDislike?<ThumbDownOffAltIcon  style={{cursor: "pointer"}} onClick={()=>{handleDislike(false)}}/>:
				<ThumbDownIcon style={{cursor: "pointer"}} onClick={()=>{handleDislike(true)}}/>}
			</div>
			{comment.author === user.token.user_id && (
				<div>
				<Button variant="info" onClick={handleEditComment}>
					Edit Comment
				</Button>
				<Button variant="danger" onClick={() => {setShowDeleteModal(true);}}>Delete Comment</Button>
				</div>
			)}
			</Card.Body>
			)}
			<Modal show={showDeleteModal} onHide={() => {setShowDeleteModal(false);}}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your comment?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => {setShowDeleteModal(false);}}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteComment}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
		</Card>
		
    );
}

export default Comment;
