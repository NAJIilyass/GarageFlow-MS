const NoElementFound = ({ target }) => {
    return (
        <div className="text-center italic flex flex-col gap-4">
            <div>
                <p>No {target}s Found</p>
            </div>
            <div>
                <p>It looks like you haven't added any {target}s yet.</p>
                <p>Please add a {target} to get started.</p>
            </div>
        </div>
    );
};

export default NoElementFound;
