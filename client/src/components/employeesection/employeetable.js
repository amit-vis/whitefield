import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from '../navbar';
import { deleteEmployee, employeeSelector, getEmployee } from '../../redux/reducer/employeeReducer';
import { Image } from 'react-bootstrap';
import { Notification } from '../notification/notification';

export const EmployeeTable = () => {
    const dispatch = useDispatch();
    const { employeeData, currentPage, totalPages, loading } = useSelector(employeeSelector);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        dispatch(getEmployee({ search, page }));
    }, [dispatch, search, page, employeeData]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleDelete = async (id) => {
        try {
            const result = await dispatch(deleteEmployee(id));
            if (deleteEmployee.fulfilled.match(result)) {
                setShowModal(true);
                setMessage(result.payload.message);
                setIsError(false);
                setTimeout(() => { setShowModal(false) }, 3000);
            } else {
                setShowModal(true);
                setMessage(result.payload ? result.payload.message : "An error occurred");
                setIsError(true);
                setTimeout(() => { setShowModal(false) }, 3000);
            }
        } catch (error) {
            setShowModal(true);
            setMessage(error.message);
            setIsError(true);
            setTimeout(() => { setShowModal(false) }, 3000);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container card bg-success" style={{ marginTop: "6%" }}>
                <h1 className="card-header text-center text-light">Employee List</h1>
                <div className="d-flex justify-content-end align-items-center mt-2 mb-2">
                    <span className="text-white">Total Count: {employeeData?.length || 0}</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="text-end">
                        <a href="/create-emp" className="text-primary btn btn-warning" style={{ textDecoration: "none" }}>Create Employee</a>
                    </div>
                </div>
                <div className="d-flex justify-content-end align-items-center mb-2">
                    <label className="text-white">Search</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" placeholder="search.." className="w-25" style={{ outline: "none", border: "none", paddingTop: "0.4%", paddingBottom: "0.4%", borderRadius: "10px" }} value={search} onChange={handleSearchChange} />
                </div>
                <table className="table text-light card-body" style={{ textAlign: "center" }}>
                    <thead>
                        <tr>
                            <th scope="col">Unique Id</th>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Mobile No</th>
                            <th scope="col">Designation</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Course</th>
                            <th scope="col">Create Date</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="10">Loading...</td>
                            </tr>
                        ) : Array.isArray(employeeData) && employeeData.length > 0 ? (
                            employeeData.map((emp, index) => (
                                <tr key={index}>
                                    <td>{emp._id}</td>
                                    <td>
                                        {emp.file ? (
                                            <Image src={emp.file} alt='employee' width="50px" height="50px" rounded />
                                        ) : (
                                            <p>No Image</p>
                                        )}
                                    </td>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.mobile}</td>
                                    <td>{emp.designation}</td>
                                    <td>{emp.gender}</td>
                                    <td>{Array.isArray(emp.course) ? emp.course.join(', ') : emp.course}</td>
                                    <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <a href={`/edit-emp/${emp._id}`}
                                            style={{ textDecoration: "none", padding: "8px", backgroundColor: "blueviolet", color: "white", borderRadius: "10px" }}
                                        >Edit</a>
                                        <span>-</span>
                                        <button onClick={() => handleDelete(emp._id)} className='bg-danger text-white'
                                        style={{border:"none", padding:"3%", borderRadius:"10px"}}
                                            >Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">No Employees Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center">
                    <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}
                    style={{border:"none", backgroundColor: "yellowgreen", borderRadius:"10px", padding:"10px"}}
                        >Previous</button>
                        &nbsp;
                    <span className='text-white text-center'>Page {currentPage} of {totalPages}</span>
                    &nbsp;
                    <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}
                    style={{border:"none", backgroundColor: "yellowgreen", borderRadius:"10px", padding:"10px"}}
                        >Next</button>
                </div>
            </div>
            <Notification show={showModal}
                message={message}
                onHide={() => setShowModal(false)}
                isError={isError} />
        </>
    );
};
