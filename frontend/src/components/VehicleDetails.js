import { useEffect, useState } from "react";
import VehicleService from "../services/VehicleService";
import { useNavigate } from "react-router-dom";
import { FuelTypes } from "../utils/FuelTypes";
import { VehicleStatus } from "../utils/VehicleStatus";

const VehicleDetails = ({ vehicle }) => {
    const vehicleService = new VehicleService();
    const navigate = useNavigate();

    const fuelTypes = Object.values(FuelTypes);
    const vehicleStatus = Object.values(VehicleStatus);

    const [isModifying, setIsModifying] = useState(false);

    const [vin, setVin] = useState("");
    const [registration_number, setRegistrationNumber] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [color, setColor] = useState("");
    const [mileage, setMileage] = useState("");
    const [fuel_type, setFuelType] = useState("");
    const [purchase_date, setPurchaseDate] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        setVin(vehicle.vin);
        setRegistrationNumber(vehicle.registration_number);
        setBrand(vehicle.brand);
        setModel(vehicle.model);
        setYear(vehicle.year);
        setColor(vehicle.color);
        setMileage(vehicle.mileage);
        setFuelType(vehicle.fuel_type);
        const formattedDate = vehicle.purchase_date
            ? new Date(vehicle.purchase_date).toISOString().split("T")[0]
            : "";
        setPurchaseDate(formattedDate);
        setStatus(vehicle.status);
    }, [vehicle]);

    const handleModifyClick = async () => {
        if (isModifying === false) setIsModifying(true);
        else {
            const updatedVehicle = {};
            if (vin !== vehicle.vin) updatedVehicle.vin = vin;
            if (registration_number !== vehicle.registration_number)
                updatedVehicle.registration_number = registration_number;
            if (brand !== vehicle.brand) updatedVehicle.brand = brand;
            if (model !== vehicle.model) updatedVehicle.model = model;
            if (year !== vehicle.year) updatedVehicle.year = year;
            if (color !== vehicle.color) updatedVehicle.color = color;
            if (mileage !== vehicle.mileage) updatedVehicle.mileage = mileage;
            if (fuel_type !== vehicle.fuel_type)
                updatedVehicle.fuel_type = fuel_type;
            if (purchase_date !== vehicle.purchase_date)
                updatedVehicle.purchase_date = purchase_date;
            if (status !== vehicle.status) updatedVehicle.status = status;

            try {
                await vehicleService.updateVehicle(vehicle._id, updatedVehicle);
                setIsModifying(false);
                navigate(`/clients/${vehicle.owner_id}/vehicles`);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-[#F3F4F6] text-center mx-[30%] py-6 my-10 rounded-2xl shadow-md shadow-[#c1c1c1] text-lg">
            {!isModifying && (
                <div className="flex flex-col gap-5 font-semibold">
                    <div className="flex gap-2 mx-auto">
                        <p>{vehicle.brand}</p>
                        <p>{vehicle.model}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex gap-2">
                            <p className="font-normal">VIN:</p>
                            <p>{vehicle.vin}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Registration Number:</p>
                            <p>{vehicle.registration_number}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Year:</p>
                            <p>{vehicle.year}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex gap-2">
                            <p className="font-normal">Fuel Type:</p>
                            <p>{vehicle.fuel_type}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Color:</p>
                            <p>{vehicle.color}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Mileage:</p>
                            <p>{vehicle.mileage}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Purchase Date:</p>
                            <p>{formatDate(vehicle.purchase_date)}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex gap-2">
                            <p className="font-normal">Status:</p>
                            <p>{vehicle.status}</p>
                        </div>
                    </div>

                    <div className="font-normal flex justify-end mr-4 gap-4 mt-2 mb-1.5 text-base">
                        <button
                            onClick={handleModifyClick}
                            className="bg-white rounded-2xl py-2 px-7"
                        >
                            Modify
                        </button>
                    </div>
                </div>
            )}

            {isModifying && (
                <div className="flex flex-col gap-5 font-semibold">
                    <div className="flex gap-2 mx-auto pl-[6.5%]">
                        <input
                            type="text"
                            value={brand}
                            className="text-end"
                            required
                            onChange={(e) => setBrand(e.target.value)}
                        />
                        <input
                            type="text"
                            value={model}
                            className=""
                            required
                            onChange={(e) => setModel(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex gap-2">
                            <p className="font-normal">VIN:</p>
                            <input
                                type="text"
                                value={vin}
                                className=""
                                required
                                onChange={(e) => setVin(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Registration Number:</p>
                            <input
                                type="text"
                                value={registration_number}
                                className=""
                                required
                                onChange={(e) =>
                                    setRegistrationNumber(e.target.value)
                                }
                            />
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Year:</p>
                            <select
                                value={year}
                                className=""
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
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex gap-2">
                            <p className="font-normal">Fuel Type:</p>
                            <select
                                value={fuel_type}
                                className=""
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
                        <div className="flex gap-2">
                            <p className="font-normal">Color:</p>
                            <input
                                type="text"
                                value={color}
                                className=""
                                required
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Mileage:</p>
                            <input
                                type="number"
                                value={mileage}
                                className=""
                                required
                                onChange={(e) => setMileage(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <p className="font-normal">Purchase Date:</p>
                            <input
                                type="date"
                                value={purchase_date}
                                className=""
                                required
                                onChange={(e) =>
                                    setPurchaseDate(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex gap-2">
                            <p className="font-normal">Status:</p>
                            <select
                                value={status}
                                className=""
                                required
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select Status
                                </option>

                                {vehicleStatus &&
                                    vehicleStatus.map((oneStatus, index) => (
                                        <option key={index} value={oneStatus}>
                                            {oneStatus}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className="font-normal flex justify-end mr-4 gap-4 mt-2 mb-1.5 text-base">
                        <button
                            onClick={() => setIsModifying(false)}
                            className="bg-white rounded-2xl py-2 px-7"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleModifyClick}
                            className="bg-[#18B728] text-white rounded-2xl py-2 px-7"
                        >
                            Modify
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleDetails;
