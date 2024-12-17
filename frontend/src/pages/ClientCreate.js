import { useState } from "react";
import ClientService from "../services/ClientService";
import { useNavigate } from "react-router-dom";

const ClientCreate = () => {
    const clientService = new ClientService();
    const navigate = useNavigate();

    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const clientData = { first_name, last_name, address, phone, email };

            await clientService.createClient(clientData);

            setFirst_name("");
            setLast_name("");
            setAddress("");
            setPhone("");
            setEmail("");

            navigate("/clients");
        } catch (err) {
            window.alert("Server error, please retry");
            console.error(err);
        }
    };

    return (
        <div>
            <div className="mb-8 text-center flex flex-col gap-5">
                <p className="text-3xl font-semibold">Create New Client</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-[30%] flex flex-col gap-7"
            >
                <div className="flex gap-12">
                    <div className="flex flex-col gap-2 w-full">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={first_name}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setFirst_name(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={last_name}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setLast_name(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-12">
                    <div className="flex flex-col gap-2 w-full">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label>Phone</label>
                        <input
                            type="text"
                            value={phone}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex flex-col gap-2">
                        <label>Address</label>
                        <input
                            type="text"
                            value={address}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-[#18B728] text-white text-base text-center rounded-3xl mx-auto my-5 py-2 px-14"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ClientCreate;
