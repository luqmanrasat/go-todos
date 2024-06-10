export type Todo = {
  id: number;
  body: string;
  completed: boolean;
}

type ResponseSuccess = {
  success: boolean;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(BASE_URL + "/todos");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data || [];
};

export const createTodo = async (newTodo: string): Promise<Todo> => {
  const response = await fetch(BASE_URL + "/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: newTodo }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

export const updateTodo = async (id: number, completed: boolean): Promise<ResponseSuccess> => {
  const response = await fetch(BASE_URL + `/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: completed }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export const deleteTodo = async (id: number): Promise<ResponseSuccess> => {
  const response = await fetch(BASE_URL + `/todos/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}