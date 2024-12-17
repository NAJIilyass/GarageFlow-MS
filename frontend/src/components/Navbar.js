import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
    return (
        <div className="mb-8 bg-[#f8f8f8] flex justify-between px-24 text-[1.18rem] text-[#3c36db] border-b border-[#3c36db] py-1">
            <div className="w-20 h-20">
                <Link to="/">
                    <img src={logo} alt="logo" />
                </Link>
            </div>
            <div className="flex justify-around items-center gap-16">
                <Link to="/">
                    <p>Home Page</p>
                </Link>
                <Link to="/clients">
                    <p>Clients</p>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
