import { useState } from "react";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { adminSignin } from "../../redux/reducer/adminform_reducer";
import { Notification } from "../notification/notification";

export const AdminSignin = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({email:"", password:""});

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async ()=>{
        try {
            const result = await dispatch(adminSignin(userData));
            if(adminSignin.fulfilled.match(result)){
                setUserData({email:"", password:""});
                setShowModal(true);
                setMessage(result.payload.message);
                setIsError(false);
                setTimeout(()=>{
                    setShowModal(false);
                    navigate("/dashboard")
                },3000);
            }else{
                setShowModal(true);
                setMessage(result.payload.message);
                setIsError(true);
                setTimeout(()=>{
                    setShowModal(false);
                },3000);
            }
        } catch (error) {
            setShowModal(true);
            setMessage(error.message);
            setIsError(true);
            setTimeout(()=>{setShowModal(false);}, 3000);
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
                    <p className='heading'>Sign in</p>
                    <div className="sign-form">
                        <div className="username">
                            <p className="t">Email Address</p>
                            <input type="email"
                                placeholder="Enter your email address"
                                className="input-box"
                                value={userData.email}
                                onChange={(e)=>setUserData({...userData, email: e.target.value})}
                                required
                            />
                        </div>
                        <div className="password">
                            <p className="t">Password</p>
                            <input type="password"
                                placeholder="Enter your password"
                                className="input-box"
                                value={userData.password}
                                onChange={(e)=>setUserData({...userData, password: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <button className="sign-up-button"
                        onClick={handleSubmit}
                        >
                            Sign in
                        </button>
                    <div className="link">
                        <a href="/admin-signup">Don't have an account? Sign Up</a>
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