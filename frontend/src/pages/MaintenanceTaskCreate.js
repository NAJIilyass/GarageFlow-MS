import VehicleService from "../services/VehicleService";
import PlanificationService from "../services/PlanificationService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MaintenanceTaskCreate = () => {
    const vehicleService = new VehicleService();
    const planificationService = new PlanificationService();
    const navigate = useNavigate();

    const [start_time, setStart_time] = useState("");
    const [end_time, setEnd_time] = useState("");
    const [total_amount, setTotal_amount] = useState("");
    const [description, setDescription] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [choosenVehicleId, setChoosenVehicleId] = useState("");

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const data = await vehicleService.getAllVehicles();
                setVehicles(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //Convert start_time and end_time to ISO format
            const today = new Date().toISOString().split("T")[0];
            const formattedStartTime = new Date(
                `${today}T${start_time}:00.000Z`
            ).toISOString();
            const formattedEndTime = new Date(
                `${today}T${end_time}:00.000Z`
            ).toISOString();

            const taskData = {
                description,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                total_amount: parseFloat(total_amount),
                vehicle_id: choosenVehicleId,
            };

            await planificationService.createMaintenanceTask(taskData);

            setStart_time("");
            setEnd_time("");
            setTotal_amount("");
            setDescription("");
            setChoosenVehicleId("");
            navigate("/");
        } catch (err) {
            window.alert("Server error, please retry");
            console.error(err);
        }
    };

    return (
        <div>
            <div className="mb-8 text-center flex flex-col gap-5">
                <p className="text-3xl font-semibold">Create New Task</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-[30%] flex flex-col gap-7"
            >
                <div className="flex flex-col gap-2">
                    <label>Vehicles</label>
                    <select
                        value={choosenVehicleId}
                        className={`border border-black py-1 px-2 text-sm ${
                            choosenVehicleId === ""
                                ? "text-slate-400"
                                : "text-black"
                        }`}
                        onChange={(e) => setChoosenVehicleId(e.target.value)}
                        required
                    >
                        <option value="">Select a vehicle</option>
                        {vehicles.map((vehicle, index) => (
                            <option
                                key={index}
                                value={vehicle._id}
                                className="text-black"
                            >
                                {vehicle.brand} {vehicle.model} ({vehicle.vin})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label>Description</label>
                    <textarea
                        value={description}
                        className="border border-black text-sm py-2 px-3"
                        required
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                    ></textarea>
                </div>

                <div className="flex gap-12">
                    <div className="flex flex-col gap-2 w-full">
                        <label>Start Time</label>
                        <input
                            type="time"
                            value={start_time}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setStart_time(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label>End Time</label>
                        <input
                            type="time"
                            value={end_time}
                            className="border border-black py-1 px-2 text-sm"
                            required
                            onChange={(e) => setEnd_time(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label>Total Amount</label>
                    <input
                        type="number"
                        step="1"
                        value={total_amount}
                        className="border border-black py-1 px-2 text-sm"
                        required
                        onChange={(e) => setTotal_amount(e.target.value)}
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

export default MaintenanceTaskCreate;
