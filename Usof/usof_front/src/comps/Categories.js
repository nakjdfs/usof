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
import {get_categories} from "../server/CategAPI";


const Categories = ({comment}) => {
	const {post} = useContext(Context);
	const [categories, setCateg] = useState([]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategories, setSelect] = useState();
	const navigate = useNavigate();
	useEffect(() => {
		const start = async ()=>{
			const c=await getCategories();
            setCateg(c);
			
		}
        async function getCategories() {
            let data;
            try {
                data = await get_categories();
            } catch (e) {
                console.log(e);
            }
            let str = [];
            //data?.map((c) => {
            //    str.push(c.title);
            //});
            return data;
        }
		start();
	},[]);
	const handelSelect =(e)=>{
        setSelect(e.target.value);
        post.setCategory(e.target.value);
    }

    return (		
	<Card className="mt-3" style={{background: "#BEE9E8", margin:"5px"}}>
      <Card.Body>
        <Form>
          <Form.Group controlId="formCategories">
            <Form.Label>Categories</Form.Label>
            <Form.Select
              value={selectedCategories}
              onChange={handelSelect}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
		
    );
}

export default Categories;
