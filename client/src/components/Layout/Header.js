import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import "../../styles/HeaderStyles.css";




const Header = () => {
  const navigate = useNavigate();
  const [loginUser,setLoginUser]=useState('')
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'))
    if(user){
      setLoginUser(user)
    }
  },[])
const logoutHandler = () => {
    localStorage.removeItem("user")
    message.success("Logout Succesfull");
    navigate("/login")
}

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link className="navbar-brand expense cry" to="/">Money Matrix</Link><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-wallet2" viewBox="0 0 16 16">
  <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/>
</svg>
            <ul className="navbar-nav ms-auto end ">
            <li>
            <svg xmlns="http://www.w3.org/2000/svg" className='icon' width="40" height="40" fill="" class="bi bi-person-check" viewBox="0 0 16 16">
  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
</svg>
            </li>
              <li className="nav-item ">
                <p className="nav-link user">{loginUser && loginUser.name}</p>
              </li>
              <li className="nav-item ms-4">
                <button className="btn btn-dark " aria-current="page" onClick={logoutHandler} >Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
}
export default Header;

