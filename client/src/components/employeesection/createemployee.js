import { useDispatch } from "react-redux"
import { Navbar } from "../navbar"
import "./createemployee.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Notification } from "../notification/notification";
import { createEmployee } from "../../redux/reducer/employeeReducer";

export const CreateEmployee = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState({name:"", email:"", mobile:"", designation:"", gender:"", course:[], file:null });

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleCourseChange = (e)=>{
        const {value, checked} = e.target;
        setEmployeeData({
            ...employeeData,
            course: checked
            ? [...employeeData.course, value]
            :employeeData.course.filter(course=>course !== value)
        })
    }

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            for (const key in employeeData) {
                if (key === "course") {
                    formData.append(key, employeeData[key].join(","));
                } else {
                    formData.append(key, employeeData[key]);
                }
            }
            const result = await dispatch(createEmployee(formData));
            if (createEmployee.fulfilled.match(result)) {
                setEmployeeData({name: "", email: "", mobile: "", designation: "", gender: "", course: [], file: null});
                setShowModal(true);
                setMessage(result.payload.message);
                setIsError(false);
                setTimeout(() => {
                    setShowModal(false);
                    navigate("/emp-table");
                }, 3000);
            } else {
                setShowModal(true);
                setMessage(result.payload ? result.payload.message : "An error occurred");
                setIsError(true);
                setTimeout(() => {
                    setShowModal(false);
                }, 3000);
            }
        } catch (error) {
            console.log(error, "error from catch");
            setShowModal(true);
            setMessage(error.message);
            setIsError(true);
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        }
    };
    
    return (
        <>
        <Navbar/>
            <div className="fluid-container mt-4 sign-container">
                <div className="logo-div" >
                    <img src="" alt="" className="logo" />
                    <div className="kyndo">whitefield</div>
                </div>
                <div className="main-form">
                    <div className="signups">
                        <p className='heading'>Create an account</p>
                        <div className="sign-form">
                            <div className="username">
                                <span className="t">Name</span>
                                <input type="text" placeholder="Enter your username"
                                    className="input-box"
                                    value={employeeData.name}
                                    onChange={(e)=>setEmployeeData({...employeeData, name: e.target.value})}
                                />
                            </div>
                            <div className="email">
                                <span className="t">Email</span>
                                <input type="email" placeholder="Enter your email address"
                                    className="input-box"
                                    value={employeeData.email}
                                    onChange={(e)=>setEmployeeData({...employeeData, email: e.target.value})}
                                />
                            </div>
                            <div className="password">
                                <span className="t">Mobile No</span>
                                <input type="number" placeholder="Enter your number" className="input-box"
                                    value={employeeData.mobile}
                                    onChange={(e)=>setEmployeeData({...employeeData, mobile: e.target.value})}
                                />
                            </div>
                            <div className="password">
                                <span className="t">Designation</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <select value={employeeData.designation} onChange={(e)=>setEmployeeData({...employeeData, designation: e.target.value})}>
                                    <option value="">Select</option>
                                    <option value="HR">HR</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Sales">Sales</option>
                                </select>
                            </div>
                            <div className="password">
                                <div className="d-flex w-100 justify-content-between">
                                    <span className="t">Gender</span>
                                    <div>
                                        <label className="text-dark">Male</label>
                                        &nbsp;
                                        <input type="radio" className="radio-large"
                                        value="Male"
                                        checked={employeeData.gender === "Male"}
                                        onChange={(e)=>setEmployeeData({...employeeData, gender: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-dark">Female</label>
                                        &nbsp;
                                        <input type="radio" className="radio-large"
                                        value="Female"
                                        checked={employeeData.gender === "Female"}
                                        onChange={(e)=>setEmployeeData({...employeeData, gender: e.target.value})}
                                         />
                                    </div>
                                </div>
                            </div>
                            <div className="password">
                                <div className="d-flex w-100 justify-content-between">
                                    <span className="t">Course</span>
                                    <div>
                                        <label className="text-dark">MCA</label>
                                        &nbsp;
                                        <input type="checkbox" className="radio-large"
                                        value="MCA"
                                        checked={employeeData.course.includes("MCA")} 
                                        onChange={handleCourseChange}/>
                                    </div>
                                    <div>
                                        <label className="text-dark">BCA</label>
                                        &nbsp;
                                        <input type="checkbox" className="radio-large"
                                        value="BCA"
                                        checked={employeeData.course.includes("BCA")}
                                        onChange={handleCourseChange} />
                                    </div>
                                    <div>
                                        <label className="text-dark">BSC</label>
                                        &nbsp;
                                        <input type="checkbox" className="radio-large"
                                        value="BSC"
                                        checked={employeeData.course.includes("BSC")}
                                        onChange={handleCourseChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="password d-flex justify-content-around align-items-center">
                                <span className="t">Image Upload</span>
                                <input type="file" style={{color:"white", backgroundColor:"black"}}
                                    onChange={(e)=>setEmployeeData({...employeeData, file: e.target.files[0]})}
                                />
                            </div>
                        </div>
                        <button className="sign-up-button" onClick={handleSubmit}>Create Employee</button>
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