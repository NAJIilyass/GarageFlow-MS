import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ClientService from "../services/ClientService";

const ClientDetails = ({ client }) => {
    const clientService = new ClientService();
    const navigate = useNavigate();

    const [isModifying, setIsModifying] = useState(false);

    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        setFirst_name(client.first_name);
        setLast_name(client.last_name);
        setAddress(client.address);
        setPhone(client.phone);
        setEmail(client.email);
    }, [client]);

    const handleVehiclesClick = () => {
        navigate(`/clients/${client._id}/vehicles`);
    };

    const handleModifyClick = async () => {
        if (isModifying === false) setIsModifying(true);
        else {
            const updatedClient = {};
            if (first_name !== client.first_name)
                updatedClient.first_name = first_name;
            if (last_name !== client.last_name)
                updatedClient.last_name = last_name;
            if (phone !== client.phone) updatedClient.phone = phone;
            if (address !== client.address) updatedClient.address = address;
            if (email !== client.email) updatedClient.email = email;

            try {
                await clientService.updateClient(client._id, updatedClient);
                navigate(`/clients/`);
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="bg-[#F3F4F6] text-center mx-[30%] py-6 my-10 rounded-2xl shadow-md shadow-[#c1c1c1] text-lg">
            {!isModifying && (
                <div className="flex flex-col gap-5 font-semibold">
                    <div className="flex gap-2 mx-auto">
                        <p>{client.first_name}</p>
                        <p>{client.last_name}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex gap-2">
                            <p className="font-normal">Address:</p>
                            <p>{client.address}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Phone:</p>
                            <p>{client.phone}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Email:</p>
                            <p>{client.email}</p>
                        </div>
                    </div>
                    <div className="font-normal flex justify-end mr-4 gap-4 mt-2 mb-1.5 text-base">
                        <button
                            onClick={handleModifyClick}
                            className="bg-white rounded-2xl py-2 px-7"
                        >
                            Modify
                        </button>
                        <button
                            onClick={handleVehiclesClick}
                            className="bg-[#18B728] text-white rounded-2xl py-2 px-7"
                        >
                            See vehicles
                        </button>
                    </div>
                </div>
            )}

            {isModifying && (
                <form className="flex flex-col gap-5 font-semibold">
                    <div className="flex gap-2 mx-auto">
                        <input
                            type="text"
                            value={first_name}
                            className="text-end"
                            required
                            onChange={(e) => setFirst_name(e.target.value)}
                        />
                        <input
                            type="text"
                            value={last_name}
                            className="text-start"
                            required
                            onChange={(e) => setLast_name(e.target.value)}
                        />
                    </div>
                    <div className="mx-auto">
                        <div className="flex gap-2">
                            <p className="font-normal">Address:</p>
                            <input
                                type="text"
                                value={address}
                                className=""
                                required
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Phone:</p>
                            <input
                                type="text"
                                value={phone}
                                className=""
                                required
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Email:</p>
                            <input
                                type="email"
                                value={email}
                                className=""
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="font-normal flex justify-end mr-4 gap-4 mt-2 mb-1.5 text-base">
                        {!isModifying && (
                            <button
                                onClick={handleModifyClick}
                                className="bg-white rounded-2xl py-2 px-7"
                            >
                                Modify
                            </button>
                        )}
                        {isModifying && (
                            <button
                                onClick={() => setIsModifying(false)}
                                className="bg-white rounded-2xl py-2 px-7"
                            >
                                Cancel
                            </button>
                        )}

                        {!isModifying && (
                            <button
                                onClick={handleVehiclesClick}
                                className="bg-[#18B728] text-white rounded-2xl py-2 px-7"
                            >
                                See vehicles
                            </button>
                        )}
                        {isModifying && (
                            <button
                                onClick={handleModifyClick}
                                className="bg-[#18B728] text-white rounded-2xl py-2 px-7"
                            >
                                Modify
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default ClientDetails;
