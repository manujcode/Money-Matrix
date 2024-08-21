import React,{useState,useEffect} from 'react'
import {Form , Input , message} from 'antd'
import { Link , useNavigate} from 'react-router-dom'
import axios from 'axios'
import Spinner from '../components/Spinner'
import "../styles/Loginpage.css";

const Login = () => {
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    //form submit
    const submitHandler = async(values) => {
        try{
           setLoading(true);
           const {data} = await axios.post('/api/v1/users/login',values);
           console.log(values);
           setLoading(false);
           message.success('login success');
           localStorage.setItem('user',JSON.stringify({...data.user,password:''}));
           navigate('/')
        }catch(error){
           setLoading(false);
           message.error('Something went wrong');
        }
    }

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="login-page ">
        {loading && <Spinner />}
        <div className="row container">
          <h1 className="cry">Money Matrix  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-wallet2" viewBox="0 0 16 16">
  <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/>
</svg></h1>
          
          <div className="col-md-6">
            <img src="save.jpg" alt="login-img" width={"100%"} height="100%" />
          </div>
          <div className="col-md-4 login-form" style={{backgroundColor:'rgba(255, 255, 255, 0.1)'}}>
            <Form layout="vertical" onFinish={submitHandler} >
              <h1>Login Form</h1>

              <Form.Item label="Email" name="email">
                <Input type="email" required />
              </Form.Item>
              <Form.Item label="Password" name="password">
                <Input type="password" required />
              </Form.Item>
              <div className="d-flex justify-content-between mt-8">
                <Link to="/register"  style={{ color: 'inherit', textDecoration: 'inherit'}} >
                  <p style={{ color: 'white'}}>Not a user ? Click Here to regsiter !</p>
                </Link>
                <button className="btn">Login</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;