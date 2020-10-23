import storage from 'good-storage'
//import BaseModel from './BaseModel';

export default class localCache {//extends BaseModel {
  static entity = 'caches'

  static getToken() {
  	return this.getCache('token', '');
  }

  static getUserData() {
  	return this.getCache('user', {});
  }

  static getUserPlats() {
  	return this.getCache('userPlat', {});
  }

  static removeUser() {
  	this.removeCache('token');
  	this.removeCache('user');
  	this.removeCache('userPlat');
  	return true;
  }

  static removePermission() {
	this.removeCache('routes');
	this.removeCache('currentRoles');
	this.removeCache('roles');
  }

  static hasSignin() {
    let token = this.getToken();
    let userData = this.getUserData();
    return token && userData.hasOwnProperty('id');
  }

  static setCache(key, value) {
  	return storage.set(this._localKey(key), value);
  }

  static getCache(key, defaultValue = {}) {
  	return storage.get(this._localKey(key), defaultValue);
  }

  static hasCache(key) {
  	return storage.has(this._localKey(key));
  }

  static removeCache(key) {
  	return storage.remove(this._localKey(key));
  }

  static _localKey(keyword) {
    return keyword + '_local_key'
  } 
}
