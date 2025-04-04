import React from "react";
import styles from "./TodoControls.module.css";
const TodoControls = ({ todos, handleToggleAll }) => {
    const allCompleted = todos.every((todo) => todo.completed);

    return (
        <div className="todo-controls">
            {todos.length > 0 && (
                <button className={styles.FilterBtn} onClick={handleToggleAll}>
                    {allCompleted ? "Uncheck all!!" : "Check all!!"}
                </button>
            )}
        </div>
    );
};

export default TodoControls;
