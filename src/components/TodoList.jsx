import React, { useState, useEffect, useRef } from "react";
import "./todoList.css";
const TodoApp = () => {
    // State để lưu trữ danh sách các công việc
    const [todos, setTodos] = useState([]);

    // State để lưu trữ giá trị nhập vào từ input
    const [inputValue, setInputValue] = useState("");

    // State để lưu trữ chế độ chỉnh sửa
    const [editMode, setEditMode] = useState(null);

    // State để lưu trữ giá trị chỉnh sửa
    const [editValue, setEditValue] = useState("");

    // State để lưu trữ bộ lọc hiện tại (all, active, completed)
    const [filter, setFilter] = useState("all");

    const clickTimeoutRef = useRef(null);
    // Sử dụng ref để lưu trữ ID của setTimeout

    const clickHandlerRef = useRef(null);
    // Lưu trữ hàm xử lý click

    // Lấy dữ liệu từ localStorage khi component mount
    useEffect(() => {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }
    }, []);

    // Lưu dữ liệu vào localStorage mỗi khi todos thay đổi
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    // Xử lý sự kiện thay đổi giá trị input
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Đồng bộ giữa các tab
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

    // Xử lý sự kiện thêm công việc mới
    const handleAddTodo = (e) => {
        e.preventDefault();

        // Kiểm tra input không được để trống
        if (inputValue.trim() === "") return;

        // Tạo công việc mới với ID ngẫu nhiên, nội dung và trạng thái chưa hoàn thành
        const newTodo = {
            id: Date.now(),
            text: inputValue,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        // Cập nhật state với công việc mới
        setTodos([...todos, newTodo]);

        // Reset giá trị input
        setInputValue("");
    };

    // Xử lý sự kiện đánh dấu hoàn thành/chưa hoàn thành công việc
    const handleToggleComplete = (id) => {
        // Tạo mảng mới với công việc đã được cập nhật trạng thái
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });

        // Cập nhật state
        setTodos(updatedTodos);
    };

    // Xử lý sự kiện xóa công việc
    const handleDeleteTodo = (id) => {
        // Lọc ra các công việc không bị xóa
        const filteredTodos = todos.filter((todo) => todo.id !== id);

        // Cập nhật state
        setTodos(filteredTodos);
    };

    // Xử lý sự kiện bắt đầu chỉnh sửa công việc
    const handleStartEdit = (todo) => {
        setEditMode(todo.id);
        setEditValue(todo.text);
    };

    // Xử lý sự kiện lưu công việc sau khi chỉnh sửa
    const handleSaveEdit = (id) => {
        // Kiểm tra input không được để trống
        if (editValue.trim() === "") return;

        // Tạo mảng mới với công việc đã được cập nhật nội dung
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, text: editValue };
            }
            return todo;
        });

        // Cập nhật state
        setTodos(updatedTodos);

        // Thoát chế độ chỉnh sửa
        setEditMode(null);
    };

    // Xử lý sự kiện hủy chỉnh sửa
    const handleCancelEdit = () => {
        setEditMode(null);
    };
    // Xử lý sự kiện bấm ra ngoài để hủy chỉnh sửa.
    useEffect(() => {
        if (editMode !== null) {
            // Thiết lập timer delay
            clickTimeoutRef.current = setTimeout(() => {
                // Định nghĩa hàm xử lý click
                const handleClick = () => {
                    handleCancelEdit();
                    window.removeEventListener("click", clickHandlerRef.current);
                };

                clickHandlerRef.current = handleClick; // Lưu hàm vào ref
                window.addEventListener("click", handleClick); // Thêm sự kiện click
            }, 2000);

            // Cleanup: Dọn dẹp khi component unmount hoặc editMode thay đổi
            return () => {
                clearTimeout(clickTimeoutRef.current); // Hủy setTimeout
                window.removeEventListener("click", clickHandlerRef.current); // Gỡ bỏ sự kiện click
            };
        }
    }, [editMode]);

    // Xử lý sự kiện đánh dấu tất cả công việc là hoàn thành/chưa hoàn thành
    const handleToggleAll = () => {
        // Kiểm tra xem tất cả công việc đã hoàn thành chưa
        const allCompleted = todos.every((todo) => todo.completed);

        // Tạo mảng mới với tất cả công việc đã được cập nhật trạng thái
        const updatedTodos = todos.map((todo) => {
            return { ...todo, completed: !allCompleted };
        });

        // Cập nhật state
        setTodos(updatedTodos);
    };

    // Xử lý sự kiện xóa tất cả công việc đã hoàn thành
    const handleClearCompleted = () => {
        // Lọc ra các công việc chưa hoàn thành
        const activeTodos = todos.filter((todo) => !todo.completed);

        // Cập nhật state
        setTodos(activeTodos);
    };

    // Lọc danh sách công việc dựa trên filter  hiện tại
    const filteredTodos = todos.filter((todo) => {
        if (filter === "active") {
            return !todo.completed;
        } else if (filter === "completed") {
            return todo.completed;
        }
        return true; // 'all'
    });

    // Đếm số công việc chưa hoàn thành
    const activeCount = todos.filter((todo) => !todo.completed).length;

    // Kiểm tra xem có công việc đã hoàn thành không
    const hasCompleted = todos.some((todo) => todo.completed);

    return (
        <div className="todo-app">
            <h1>Todo List</h1>

            {/* Form thêm công việc mới */}
            <form onSubmit={handleAddTodo}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Thêm công việc mới..."
                />
                <button type="submit">Thêm</button>
            </form>

            {/* Nút đánh dấu tất cả */}
            {todos.length > 0 && (
                <button onClick={handleToggleAll}>
                    {todos.every((todo) => todo.completed)
                        ? "Bỏ đánh dấu tất cả"
                        : "Đánh dấu tất cả"}
                </button>
            )}

            {/* Danh sách công việc */}
            <ul>
                {filteredTodos.map((todo) => (
                    <li key={todo.id} className={todo.completed ? "comlpeted" : ""}>
                        {editMode === todo.id ? (
                            //chỉnh sửa
                            <>
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    autoFocus
                                />
                                <button onClick={() => handleSaveEdit(todo.id)}>
                                    Lưu
                                </button>
                                <button onClick={handleCancelEdit}>Hủy</button>
                            </>
                        ) : (
                            // hiển thị
                            <>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggleComplete(todo.id)}
                                    style={{ cursor: "pointer" }}
                                />
                                <span
                                    style={{
                                        textDecoration: todo.completed
                                            ? "line-through"
                                            : "none",
                                        color: todo.completed ? "red" : "black",
                                        cursor: "pointer",
                                    }}
                                    onDoubleClick={() => handleStartEdit(todo)}
                                >
                                    {todo.text}
                                </span>
                                <button onClick={() => handleStartEdit(todo)}>
                                    Sửa
                                </button>
                                <button onClick={() => handleDeleteTodo(todo.id)}>
                                    Xóa
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {/* Hiển thị thông tin và filter */}
            {todos.length > 0 && (
                <div className="todo-footer">
                    <span>{activeCount} công việc chưa hoàn thành</span>

                    {/* Filter */}
                    <div className="filters">
                        <button
                            className={filter === "all" ? "active" : ""}
                            onClick={() => setFilter("all")}
                        >
                            Tất cả
                        </button>
                        <button
                            className={filter === "active" ? "active" : ""}
                            onClick={() => setFilter("active")}
                        >
                            Đang làm
                        </button>
                        <button
                            className={filter === "completed" ? "active" : ""}
                            onClick={() => setFilter("completed")}
                        >
                            Đã hoàn thành
                        </button>
                    </div>

                    {/* Nút xóa tất cả công việc */}
                    {hasCompleted && (
                        <button onClick={handleClearCompleted}>
                            Xóa đã hoàn thành
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TodoApp;
