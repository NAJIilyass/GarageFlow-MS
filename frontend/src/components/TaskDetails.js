import { useEffect, useState } from "react";

import ClientService from "../services/ClientService";
import VehicleService from "../services/VehicleService";
import PlanificationService from "../services/PlanificationService";
import { useNavigate } from "react-router-dom";

const TaskDetails = ({ task }) => {
    const clientService = new ClientService();
    const vehicleService = new VehicleService();
    const planificationService = new PlanificationService();

    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [vehicle, setVehicle] = useState(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const data = await vehicleService.getVehicleById(
                    task.vehicle_id
                );
                setVehicle(data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchClient = async () => {
            try {
                const data = await clientService.getClientById(task.client_id);
                setClient(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchVehicle();
        fetchClient();
    }, []);

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (value) => {
        const formatter = new Intl.NumberFormat("en-US", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const formattedValue = formatter.format(value);
        return `${formattedValue.replace(/,/g, " ")} MAD`;
    };

    const handleProceedClick = async () => {
        let newStatus = task.status === "PLANNED" ? "IN_PROGRESS" : "COMPLETED";
        try {
            await planificationService.updateStatus(task._id, newStatus);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDisplayClientClick = () => {
        navigate(`/clients/#${task.client_id}`);
    };

    return (
        <div className="bg-[#F3F4F6] text-center mx-[30%] py-6 my-10 rounded-2xl shadow-md shadow-[#c1c1c1] text-lg">
            {task && client && vehicle && (
                <div className="flex flex-col gap-5 font-semibold">
                    <div>
                        <p>
                            From {formatTime(task.start_time)} to{" "}
                            {formatTime(task.end_time)}
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className="font-normal">Vehicle:</span>{" "}
                            {vehicle.brand} {vehicle.model} ({vehicle.vin})
                        </p>
                        <p>
                            <span className="font-normal">Client:</span>{" "}
                            {client.first_name} {client.last_name}
                        </p>
                        <p>
                            <span className="font-normal">Description:</span>{" "}
                            {task.description}
                        </p>
                        <p>
                            <span className="font-normal">Amount:</span>{" "}
                            {formatCurrency(task.total_amount)}
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className="font-normal">Status:</span>{" "}
                            {task.status}
                        </p>
                    </div>
                    <div className="font-normal flex justify-end mr-4 gap-4 mt-2 mb-1.5 text-base">
                        <button
                            onClick={handleDisplayClientClick}
                            className="bg-white rounded-2xl py-2 px-7"
                        >
                            Display client
                        </button>
                        {task.status !== "COMPLETED" && (
                            <button
                                onClick={handleProceedClick}
                                className={`${
                                    task.status === "PLANNED"
                                        ? "bg-[#18B728]"
                                        : "bg-[#B91C1C]"
                                } text-white rounded-2xl py-2 px-7`}
                            >
                                {task.status === "PLANNED" && <p>Proceed</p>}
                                {task.status === "IN_PROGRESS" && <p>Finish</p>}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetails;
