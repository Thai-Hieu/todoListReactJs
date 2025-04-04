import React from "react";
import styles from "./TodoFilter.module.css";
const TodoFilter = ({
    filter,
    setFilter,
    activeCount,
    todos,
    handleClearCompleted,
    hasCompleted,
}) => {
    if (todos.length === 0) {
        return null;
    }

    return (
        <div className="todo-filter">
            <span className={styles.filterCount}>
                {activeCount} The work has not been completed!!!
            </span>
            <div className={styles.filterButtons}>
                <button
                    className={filter === "all" ? "active" : ""}
                    onClick={() => setFilter("all")}
                >
                    All!
                </button>
                <button
                    className={filter === "active" ? "active" : ""}
                    onClick={() => setFilter("active")}
                >
                    Are doing!
                </button>
                <button
                    className={filter === "completed" ? "active" : ""}
                    onClick={() => setFilter("completed")}
                >
                    Completed!
                </button>
                {hasCompleted && (
                    <button className={styles.FilterBtn} onClick={handleClearCompleted}>
                        Clear All!!
                    </button>
                )}
            </div>
        </div>
    );
};

export default TodoFilter;
