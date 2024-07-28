import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Notification } from "./notification/notification";
import { getUserDetails, logoutUser, userSelector } from "../redux/reducer/adminform_reducer";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, status, error} = useSelector(userSelector)    
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);


    useEffect(()=>{
        dispatch(getUserDetails())
    },[dispatch])

    const signoutUser = async ()=>{
        try {
            const result = await dispatch(logoutUser());
            if(logoutUser.fulfilled.match(result)){
                setShowModal(true)
                setIsError(false)
                setMessage(result.payload.message)
                localStorage.removeItem("token")
                setTimeout(()=>{
                    setShowModal(false)
                    navigate('/')
                },3000)
            }else{
                setIsError(true)
                setMessage(result.payload.message)
                setShowModal(true)
                setTimeout(()=>{setShowModal(false)},3000)
            }
            
        } catch (error) {
            setIsError(true)
            setMessage(error.message)
            setShowModal(true)
            setTimeout(()=>{setShowModal(false)},3000)
            console.log("here is the error message",error)
        }
    }
    return (
        <>
            <nav class="navbar navbar-expand-lg fixed-top">
                <div class="container-fluid nav">
                    <div class="nav-left d-flex">
                        <a href='/' style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontWeight: '600'
                        }}>
                            <p className="brand-name">whitefield</p>
                        </a>
                    </div>
                    <div className="nav-left mt-3">
                        <a href="/dashboard" className="text-white" style={{textDecoration:"none"}}>
                        <p>Home</p>
                        </a>
                    </div>
                    <div className="nav-left mt-3">
                    <a href="/emp-table" className="text-white" style={{textDecoration:"none"}}>
                        <p>Employee List</p>
                        </a>
                    </div>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a href='/' className="nav-link">{user?.name}</a>
                            </li>
                            <li class="nav-item">
                                <a href='/' className="nav-link" onClick={signoutUser}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Notification show={showModal}
                message={message}
                onHide={()=>setShowModal(false)}
                isError={isError}/>
        </>
    )
}