import { Navbar } from "../navbar"

export const Dashboard = ()=>{
    return(
        <>
        <Navbar/>
        <section className="section3">
            <div className="img-group1">
                Dashboard
            </div>
            <p>Welcome <span>Admin Panel!</span></p>
            <div className="img-group1">
                <img className="smallimg" alt="" />
                <img className="bigimg"  alt="" />
            </div>
        </section>
        </>
    )
}