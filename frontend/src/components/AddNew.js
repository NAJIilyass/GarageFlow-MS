import { useNavigate } from "react-router-dom";

const AddNew = ({ target, clientId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (target === "task") {
            navigate("/maintenance-tasks/create");
        } else if (target === "client") {
            navigate("/clients/create");
        } else if (target === "vehicle" && clientId) {
            navigate(`/clients/${clientId}/vehicles/create`);
        } else {
            console.error("Invalid target");
        }
    };

    return (
        <div
            className="text-[#18B728] flex flex-col gap-2 items-center cursor-pointer w-fit mx-auto"
            onClick={handleClick}
        >
            <div className="border-2 border-[#18B728] rounded-full flex justify-center text-[3.5rem] font-serif w-[5.7rem] h-[5.7rem]">
                <p>+</p>
            </div>
            <div className="text-lg font-[600]">
                <p>Add new {target}</p>
            </div>
        </div>
    );
};

export default AddNew;
