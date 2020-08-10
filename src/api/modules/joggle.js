import axios from 'axios';
let get = (data) => axios.get('http://27.223.90.126:7777/Core/Get', { params: data });
let post = (data) => axios.post('http://27.223.90.126:7777/Core/Post', data);
let del = (data) => axios.delete('http://27.223.90.126:7777/Core/DeleteForAxios', { params: data });
let delFile = (data) => axios.delete('http://27.223.90.126:7777/Core/DeleteFileForAxios', { params: data });
let put = (data) => axios.put('http://27.223.90.126:7777/Core/Put', data);

export default {
	get,
	post,
	del,
	delFile,
	put,
}
