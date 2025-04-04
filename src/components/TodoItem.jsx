import React from "react";
import styles from "./TodoItem.module.css";
const TodoItem = ({
    todo,
    editMode,
    editValue,
    setEditValue,
    handleToggleComplete,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteTodo,
}) => {
    return (
        <li className={todo.completed ? "completed" : ""}>
            {editMode === todo.id ? (
                <>
                    <input
                        className={styles.formItemInput}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                    />
                    <button onClick={() => handleSaveEdit(todo.id)}>Save!</button>
                    <button onClick={handleCancelEdit}>Cancel!</button>
                </>
            ) : (
                <>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo.id)}
                        style={{ cursor: "pointer" }}
                    />
                    <span
                        style={{
                            textDecoration: todo.completed ? "line-through" : "none",
                            color: todo.completed ? "red" : "black",
                            cursor: "pointer",
                        }}
                        onDoubleClick={() => handleStartEdit(todo)}
                    >
                        {todo.text}!
                    </span>
                    <button
                        className={styles.ItemBtn}
                        onClick={() => handleDeleteTodo(todo.id)}
                    >
                        Delete!
                    </button>
                </>
            )}
        </li>
    );
};

export default TodoItem;
