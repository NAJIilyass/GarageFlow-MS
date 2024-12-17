import { useState, useEffect } from "react";

import PlanificationService from "../services/PlanificationService";

import AddNew from "../components/AddNew";
import NoElementFound from "../components/NoElementFound";
import TaskDetails from "../components/TaskDetails";

const Home = () => {
    const planificationService = new PlanificationService();
    const [tasks, setTasks] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const today = new Date().toISOString().split("T")[0];
                const data = await planificationService.getWorkPlan(today);
                setTasks(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTasks();
    }, []);

    // Formatted Day below the title
    const currentDate = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    return (
        <div>
            <div className="mb-8 text-center flex flex-col gap-5">
                <p className="text-3xl font-semibold">Work Plan</p>
                <p className="text-lg">Today: {formattedDate}</p>
            </div>

            {!tasks && (
                <div className="my-16">
                    <NoElementFound target={"task"} />
                </div>
            )}
            {tasks &&
                tasks.map((task) => (
                    <div key={task._id}>
                        <TaskDetails task={task} />
                    </div>
                ))}

            <div className="my-8">
                <AddNew target={"task"} />
            </div>
        </div>
    );
};

export default Home;
