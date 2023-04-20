// endpoints.js
import axios from './axiosConfig';
import axiosUnprotected from './axiosUnprotected';

export const login = (email, password) => axiosUnprotected.post('auth/login', {
    email,
    password,
  });

export const register = (name, email, password, organization, username) => axiosUnprotected.post('auth/register', {
    name,
    email,
    password,
    organization,
    username,
  });

export const getUser = () => axios.get('auth/user')


export const deloys3Bucket = (name) => axios.post('s3/deploy',{bucketName:name})
export const deployStorageAccount = (name) => axios.post('sA/deploy',{name})

export const uploadFileAws = (formData) => axios.post('s3/upload',formData)
export const uploadFileAzure = (formData) => axios.post('sA/upload',formData)

export const getFileAws = (name) => axios.get(`s3/${name}`)
export const getFileAzure = (name) => axios.get(`sA/getFiles/${name}`)



export const deployec2 = (name) => axios.post('ec2/deploy',{
	"imageId":"ami-006dcf34c09e50022",
	"instanceType":"t3.micro",
	"name":name
})



export const stopInstance = (instance) => axios.put('/ec2/stop',{instanceId:instance})
export const restartInstance = (instance) => axios.put('/ec2/restart',{instanceId:instance})
export const terminateInstance = (instance) => axios.put('/ec2/terminate',{instanceId:instance})
export const desctibeInstance = (instance) => axios.post('/ec2/describe',{instanceId:instance})




