import { makeAutoObservable } from "mobx";
import {makePersistable} from "mobx-persist-store";


export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._token ={};
        makeAutoObservable(this);
        makePersistable(this, {name: "User", properties: ["_isAuth", "_token"], storage: window.localStorage});
    }
    setIsAuth(auth){
        this._isAuth = auth;
    }
    setToken(tok){
        this._token = tok;
    }
    get token(){
        return this._token;
    }
    get isAuth(){
        return this._isAuth;
    }
}