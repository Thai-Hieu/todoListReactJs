import React from "react";
import styles from "./todoHeader.module.css";
const TodoHeader = ({ inputValue, handleInputChange, handleAddTodo }) => {
    return (
        <div className="todo-header">
            <h1>Todo List</h1>
            <form className={styles.formHeader} onSubmit={handleAddTodo}>
                <input
                    className={styles.formHeaderInput}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Click to add new jobs..."
                />
                <button className={styles.formHeaderButton} type="submit">
                    Add!!
                </button>
            </form>
        </div>
    );
};

export default TodoHeader;
