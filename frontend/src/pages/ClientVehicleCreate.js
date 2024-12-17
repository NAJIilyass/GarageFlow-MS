import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import VehicleService from "../services/VehicleService";
import ClientService from "../services/ClientService";

import { FuelTypes } from "../utils/FuelTypes";

const ClientVehicleCreate = () => {
    const vehicleService = new VehicleService();
    const clientService = new ClientService();
    const navigate = useNavigate();

    const { id: owner_id } = useParams();

    const [client, setClient] = useState(null);

    const fuelTypes = Object.values(FuelTypes);

    const [vin, setVin] = useState("");
    const [registration_number, setRegistrationNumber] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [color, setColor] = useState("");
    const [mileage, setMileage] = useState("");
    const [fuel_type, setFuelType] = useState("");
    const [purchase_date, setPurchaseDate] = useState("");

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const data = await clientService.getClientById(owner_id);
                setClient(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchClient();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const vehicleData = {
                vin,
                registration_number,
                brand,
                model,
                year,
                color,
                mileage,
                fuel_type,
                purchase_date,
                owner_id,
            };

            await vehicleService.createVehicle(vehicleData);

            setVin("");
            setRegistrationNumber("");
            setBrand("");
            setModel("");
            setYear("");
            setColor("");
            setMileage("");
            setFuelType("");
            setPurchaseDate("");

            navigate(`/clients/${owner_id}/vehicles`);
        } catch (err) {
            window.alert("Server error, please retry");
            console.error(err);
        }
    };

    return (
        <div>
            <div className="mb-8 text-center flex flex-col gap-5">
                <p className="text-3xl font-semibold">
                    Create New Vehicle{" "}
                    {client && (
                        <span>
                            for {client.first_name} {client.last_name}
                        </span>
                    )}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-[30%] flex flex-col gap-7"
            >
                <div className="flex gap-12">
                    <div className="flex flex-col gap-2 w-full">
                        <label>VIN</label>
                        <input
                            type="text"
                            value={vin}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setVin(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label>Registration Number</label>
                        <input
                            type="text"
                            value={registration_number}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) =>
                                setRegistrationNumber(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="flex gap-12">
                    <div className="flex flex-col gap-2 w-full">
                        <label>Brand</label>
                        <input
                            type="text"
                            value={brand}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label>Model</label>
                        <input
                            type="text"
                            value={model}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setModel(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-12">
                    <div className="flex flex-col gap-2 w-full">
                        <label>Year</label>
                        <select
                            value={year}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="" disabled>
                                Select Year
                            </option>
                            {Array.from(
                                { length: 44 },
                                (_, i) => new Date().getFullYear() - i
                            ).map((yr) => (
                                <option key={yr} value={yr}>
                                    {yr}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label>Color</label>
                        <input
                            type="text"
                            value={color}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-12">
                    <div className="flex flex-col gap-2 w-full">
                        <label>Mileage</label>
                        <input
                            type="number"
                            value={mileage}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setMileage(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label>Fuel Type</label>
                        <select
                            value={fuel_type}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setFuelType(e.target.value)}
                        >
                            <option value="" disabled>
                                Select Fuel Type
                            </option>

                            {fuelTypes &&
                                fuelTypes.map((fuelType, index) => (
                                    <option key={index} value={fuelType}>
                                        {fuelType}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <label>Purchase Date</label>
                    <input
                        type="date"
                        value={purchase_date}
                        className="border border-black py-1 px-2 text-sm"
                        required
                        onChange={(e) => setPurchaseDate(e.target.value)}
                    />
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

export default ClientVehicleCreate;
