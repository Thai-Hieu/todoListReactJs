import React, { useState, useEffect, useRef } from "react";
import TodoHeader from "./TodoHeader";
import TodoItem from "./TodoItem";
import TodoControls from "./TodoControls";
import TodoFilter from "./TodoFilter";
import "./todoList.css";

const TodoList = () => {
    // const [todos, setTodos] = useState([]);
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem("todos");
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [inputValue, setInputValue] = useState("");
    const [editMode, setEditMode] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [filter, setFilter] = useState("all");
    const clickTimeoutRef = useRef(null);
    const clickHandlerRef = useRef(null);

    // useEffect(() => {
    //     const storedTodos = localStorage.getItem("todos");
    //     if (storedTodos) {
    //         setTodos(JSON.parse(storedTodos));
    //     }
    // }, []);

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "todos") {
                const updatedTodos = JSON.parse(event.newValue || "[]");
                setTodos(updatedTodos);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;

        const newTodo = {
            id: Date.now(),
            text: inputValue,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        setTodos([...todos, newTodo]);
        setInputValue("");
    };

    const handleToggleComplete = (id) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        setTodos(updatedTodos);
    };

    const handleDeleteTodo = (id) => {
        const filteredTodos = todos.filter((todo) => todo.id !== id);
        setTodos(filteredTodos);
    };

    const handleStartEdit = (todo) => {
        setEditMode(todo.id);
        setEditValue(todo.text);
    };

    const handleSaveEdit = (id) => {
        if (editValue.trim() === "") return;

        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, text: editValue };
            }
            return todo;
        });

        setTodos(updatedTodos);
        setEditMode(null);
    };

    const handleCancelEdit = () => {
        setEditMode(null);
    };

    useEffect(() => {
        if (editMode !== null) {
            clickTimeoutRef.current = setTimeout(() => {
                const handleClick = () => {
                    handleCancelEdit();
                    window.removeEventListener("click", clickHandlerRef.current);
                };

                clickHandlerRef.current = handleClick;
                window.addEventListener("click", handleClick);
            }, 2000);

            return () => {
                clearTimeout(clickTimeoutRef.current);
                window.removeEventListener("click", clickHandlerRef.current);
            };
        }
    }, [editMode]);

    const handleToggleAll = () => {
        const allCompleted = todos.every((todo) => todo.completed);
        const updatedTodos = todos.map((todo) => ({
            ...todo,
            completed: !allCompleted,
        }));
        setTodos(updatedTodos);
    };

    const handleClearCompleted = () => {
        const activeTodos = todos.filter((todo) => !todo.completed);
        setTodos(activeTodos);
    };

    const filteredTodos = todos.filter((todo) => {
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
    });

    const activeCount = todos.filter((todo) => !todo.completed).length;

    const hasCompleted = todos.some((todo) => todo.completed);

    return (
        <div className="todo-app">
            <TodoHeader
                inputValue={inputValue}
                handleInputChange={handleInputChange}
                handleAddTodo={handleAddTodo}
            />

            {todos.length > 0 && (
                <>
                    <TodoControls
                        todos={todos}
                        handleToggleAll={handleToggleAll}
                        handleClearCompleted={handleClearCompleted}
                    />

                    <ul>
                        {filteredTodos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                editMode={editMode}
                                editValue={editValue}
                                setEditValue={setEditValue}
                                handleToggleComplete={handleToggleComplete}
                                handleStartEdit={handleStartEdit}
                                handleSaveEdit={handleSaveEdit}
                                handleCancelEdit={handleCancelEdit}
                                handleDeleteTodo={handleDeleteTodo}
                            />
                        ))}
                    </ul>

                    <TodoFilter
                        filter={filter}
                        setFilter={setFilter}
                        activeCount={activeCount}
                        todos={todos}
                        hasCompleted={hasCompleted}
                        handleClearCompleted={handleClearCompleted}
                    />
                </>
            )}
        </div>
    );
};

export default TodoList;
