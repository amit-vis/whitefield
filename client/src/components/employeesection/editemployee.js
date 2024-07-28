import { useDispatch, useSelector } from "react-redux";
import { Navbar } from "../navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Notification } from "../notification/notification";
import { editEmployee, employeeSelector, getsingleData } from "../../redux/reducer/employeeReducer";

export const EditEmployee = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { singleEmp } = useSelector(employeeSelector);
    const [employeeDatas, setEmployeeDatas] = useState({ name: "", email: "", mobile: "", designation: "", gender: "", course: [], file: null });

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        dispatch(getsingleData(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (singleEmp) {
            setEmployeeDatas({
                name: singleEmp.name,
                email: singleEmp.email,
                mobile: singleEmp.mobile,
                designation: singleEmp.designation,
                gender: singleEmp.gender,
                course: singleEmp.course,
                file: null  // Reset file input
            });
        }
    }, [singleEmp]);

    const handleupdate = async () => {
        const formData = new FormData();
        formData.append('name', employeeDatas.name);
        formData.append('email', employeeDatas.email);
        formData.append('mobile', employeeDatas.mobile);
        formData.append('designation', employeeDatas.designation);
        formData.append('gender', employeeDatas.gender);
        formData.append('course', employeeDatas.course.join(",")); // Convert array to string
        if (employeeDatas.file) {
            formData.append('file', employeeDatas.file);
        }
    
        try {
            const result = await dispatch(editEmployee({ id, employee: formData }));
            if (editEmployee.fulfilled.match(result)) {
                setEmployeeDatas({ name: "", email: "", mobile: "", designation: "", gender: "", course: [], file: null });
                setShowModal(true);
                setIsError(false);
                setMessage(result.payload.message);
                setTimeout(() => {
                    setShowModal(false);
                    navigate("/emp-table");
                }, 3000);
            } else {
                setShowModal(true);
                setIsError(true);
                setMessage(result.payload.message);
                setTimeout(() => {
                    setShowModal(false);
                }, 3000);
            }
        } catch (error) {
            setShowModal(true);
            setIsError(true);
            setMessage(error.message);
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        }
    };

    const handleCourseChange = (e) => {
        const { value, checked } = e.target;
        setEmployeeDatas({
            ...employeeDatas,
            course: checked
                ? [...employeeDatas.course, value]
                : employeeDatas.course.filter(course => course !== value)
        });
    };

    return (
        <>
            <Navbar />
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
                                    value={employeeDatas.name}
                                    onChange={(e) => setEmployeeDatas({ ...employeeDatas, name: e.target.value })}
                                />
                            </div>
                            <div className="email">
                                <span className="t">Email</span>
                                <input type="email" placeholder="Enter your email address"
                                    className="input-box"
                                    value={employeeDatas.email}
                                    onChange={(e) => setEmployeeDatas({ ...employeeDatas, email: e.target.value })}
                                />
                            </div>
                            <div className="password">
                                <span className="t">Mobile No</span>
                                <input type="number" placeholder="Enter your number" className="input-box"
                                    value={employeeDatas.mobile}
                                    onChange={(e) => setEmployeeDatas({ ...employeeDatas, mobile: e.target.value })}
                                />
                            </div>
                            <div className="password">
                                <span className="t">Designation</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <select value={employeeDatas.designation} onChange={(e) => setEmployeeDatas({ ...employeeDatas, designation: e.target.value })}>
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
                                            checked={employeeDatas.gender === "Male"}
                                            onChange={(e) => setEmployeeDatas({ ...employeeDatas, gender: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-dark">Female</label>
                                        &nbsp;
                                        <input type="radio" className="radio-large"
                                            value="Female"
                                            checked={employeeDatas.gender === "Female"}
                                            onChange={(e) => setEmployeeDatas({ ...employeeDatas, gender: e.target.value })}
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
                                            checked={employeeDatas.course.includes("MCA")}
                                            onChange={handleCourseChange} />
                                    </div>
                                    <div>
                                        <label className="text-dark">BCA</label>
                                        &nbsp;
                                        <input type="checkbox" className="radio-large"
                                            value="BCA"
                                            checked={employeeDatas.course.includes("BCA")}
                                            onChange={handleCourseChange} />
                                    </div>
                                    <div>
                                        <label className="text-dark">BSC</label>
                                        &nbsp;
                                        <input type="checkbox" className="radio-large"
                                            value="BSC"
                                            checked={employeeDatas.course.includes("BSC")}
                                            onChange={handleCourseChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="password d-flex justify-content-around align-items-center">
                                <span className="t">Image Upload</span>
                                <input type="file" style={{ color: "white", backgroundColor: "black" }}
                                    onChange={(e) => 
                                        {console.log("ha mai hi",e.target.files[0])
                                        setEmployeeDatas({ ...employeeDatas, file: e.target.files[0] })}}
                                />
                            </div>
                        </div>
                        <button className="sign-up-button" onClick={handleupdate}>update Employee</button>
                    </div>
                </div>
            </div>
            <Notification show={showModal}
                message={message}
                onHide={() => setShowModal(false)}
                isError={isError} />
        </>
    )
}
