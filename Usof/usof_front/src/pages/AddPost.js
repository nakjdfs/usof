import React, { useContext, useState, useEffect} from "react";
import { Container, Form, Alert, Card, Button,Row, Col } from "react-bootstrap";
import { NavLink, useLocation, Navigate, useNavigate, useParams } from "react-router-dom";
import { REGISTER_ROUTE, LOGIN_ROUTE, MAIN_PAGE } from "../AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { getPost,getPostComm,getPostCateg, createPost, editPost} from "../server/PostAPI";
import { getUser } from "../server/UserAPI";
import { Avatar } from '@mui/material';
import Comment from "../comps/Comment";
import { get_categories } from "../server/CategAPI";
import { editComm } from "../server/CommAPI";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const AddPost = observer(() => {
    const { postId } = useParams();
    const { user } = useContext(Context);
    const location = useLocation();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelect] = useState([]);
    const [isEdit, setEdit] = useState(false);

    const [post, setPost] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const start = async () => {
            try {
                if (postId !== "-1") {
                    console.log("Post Id" + postId);
                    setEdit(true);
                    const postT = await getPost(postId);
                    setPost(postT);
                    setContent(postT.content);
                    setTitle(postT.title);
                    const c = await getCategoriesP(postId);
                    console.log(c);
                    setSelect(c);
                    
                }

                setCategories(await getCategories());
                console.log(selectedCategories);
            } catch (e) {
                console.log(e);
            }
        };

        async function getCategoriesP(post_id) {
            let str = [];
            let data;
            try {
                data = await getPostCateg(post_id);
            } catch (e) {
                console.log(e);
            }
            data?.map((c, index) => {
                str.push(c.title);
            });
            return str;
        }

        async function getCategories() {
            let data;
            try {
                data = await get_categories();
            } catch (e) {
                console.log(e);
            }
            let str = [];
            data?.map((c) => {
                str.push(c.title);
            });
            return str;
        }

        start();
    }, [postId]);

    const handleSubmit = async () => {
        try {
            let categoriesForSend = [...new Set(selectedCategories)];

            if (isEdit) {
                console.log(categoriesForSend);
                await editPost(postId, title, content, categoriesForSend);
            } else {
                const mes = await createPost(title, content, categoriesForSend);
            }
        } catch (e) {
            console.log(e.response.data.message);
        }
    };

    const handleInputChange = (e) => {
        const {target: { value, checked },} = e;
        setSelect(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
    };

    return (
        <Container>
            <Row>
                <Form>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter the title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter the content"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCategories">
                        <Form.Label>Categories</Form.Label>
                        <div>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                                <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={selectedCategories}
                                onChange={handleInputChange}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                    <Checkbox checked={selectedCategories.includes(category)} />
                                    <ListItemText primary={category} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            </div>
                    </Form.Group>

                    <Button variant="primary" onClick={handleSubmit}>
                        {isEdit ? 'Edit Post' : 'Create Post'}
                    </Button>
                </Form>
            </Row>
        </Container>
    );
});

export default AddPost;