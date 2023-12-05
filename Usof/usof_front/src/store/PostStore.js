import { makeAutoObservable } from "mobx";
import {makePersistable} from "mobx-persist-store";


export default class PostStore {
    constructor() {
        this._post =[];
        this._author = {};
        this._pages = 0;
        this._page = 1;
        this._category = 1;
        makeAutoObservable(this);
       // makePersistable(this, {name: "User", properties: ["_isAuth", "_token"], storage: window.localStorage});
    }
    setPost(post){
        this._post = post;
    }
    setAuthor(author){
        this._author = author;
    }
    setPages(post){
        this._pages = post;
    }
    get pages(){
        return this._pages;
    }
    setPage(post){
        this._page = post;
    }
    get page(){
        return this._page;
    }
    get post(){
        return this._post;
    }
    get author(){
        return this._author;
    }
    setCategory(post){
        this._category = post;
    }
    get category(){
        return this._category;
    }

}