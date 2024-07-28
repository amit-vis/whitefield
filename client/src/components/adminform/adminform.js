import { useDispatch } from "react-redux"
import "./adminform.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { adminRegister } from "../../redux/reducer/adminform_reducer";
import { Notification } from "../notification/notification";
export const AdminForm = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({name:"", email:"", password:""});

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async ()=>{
        try {
            const result = await dispatch(adminRegister(userData));
            if(adminRegister.fulfilled.match(result)){
                setUserData({name:"", email:"", password:""});
                setShowModal(true);
                setMessage(result.payload.message);
                setIsError(false);
                setTimeout(()=>{
                    setShowModal(false)
                    navigate("/")
                },3000)
            }else{
                setShowModal(true);
                setMessage(result.payload.message);
                setIsError(true)
                setTimeout(()=>{setShowModal(false);}, 3000)
            }
        } catch (error) {
            setShowModal(true);
            setMessage(error.message);
            setIsError(true)
            setTimeout(()=>{setShowModal(false);}, 3000)
        }
    }
    return(
        <>
         <div className="fluid-container sign-container">
                <div className="logo-div" >
                    <img src="" alt="" className="logo" />
                    <div className="kyndo">whitefield</div>
                </div>
                <div className="main-form">
                    <div className="signup">
                        <p className='heading'>Create an account</p>
                        <div className="sign-form">
                            <div className="username">
                                <p className="t">Username</p>
                                <input type="text" placeholder="Enter your username" 
                                className="input-box"
                                value={userData.name}
                                onChange={(e)=>setUserData({...userData, name: e.target.value})}
                                     />
                            </div>
                            <div className="email">
                                <p className="t">Email Address</p>
                                <input type="email" placeholder="Enter your email address" 
                                className="input-box"
                                value={userData.email}
                                onChange={(e)=>setUserData({...userData, email: e.target.value})}
                                     />
                            </div>
                            <div className="password">
                                <p className="t">Password</p>
                                <input type="password" placeholder="Enter your password" className="input-box"
                                value={userData.password}
                                onChange={(e)=>setUserData({...userData, password: e.target.value})}
                                     />
                            </div>
                        </div>
                        <button className="sign-up-button" onClick={handleSubmit}>Sign Up</button>
                        <div className="link">
                            <a href="/">Already got an account? Sign in</a>
                        </div>
                    </div>
                </div>
            </div>
            <Notification show={showModal} 
                message={message}
                onHide={() => setShowModal(false)}
                isError={isError}/>
        </>
    )
}