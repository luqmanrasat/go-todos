import { CgSpinner } from "solid-icons/cg";
import { Component, ErrorBoundary, For, Show, Suspense } from "solid-js";
import GoLogo from "../assets/go.png";
import TodoItem from "./TodoItem";
import { createQuery } from "@tanstack/solid-query";
import { Todo, fetchTodos } from "../controllers/todos";

const TodoList: Component = () => {
  const todosQuery = createQuery<Todo[]>(() => ({
    queryKey: ["todos"],
    queryFn: async () => {
      const todos = await fetchTodos();
      return todos;
    },
  }));

  return (
    <>
      <h1 class="text-transparent text-4xl uppercase font-bold text-center my-2 bg-gradient-to-l from-gray-700 to-gray-200 dark:from-blue-500 dark:to-blue-50 bg-clip-text">
        Today's Tasks
      </h1>
      <ErrorBoundary fallback={
        <div class="text-center">
          Error: {todosQuery.error?.message}
        </div>
      }>
        <Suspense fallback={
          <div class="flex justify-center my-4">
            <CgSpinner class="animate-spin" size={50} />
          </div>
        }>
          <div class="flex flex-col items-center mx-auto my-4 gap-2 max-w-[700px]">
            <Show when={todosQuery.data && todosQuery.data?.length <= 0}>
              <p class="text-xl">All task completed! 🤞</p>
              <img class="w-16" src={GoLogo} alt="Go logo" />
            </Show>
            <Show when={todosQuery.data && todosQuery.data.length > 0} >
              <For each={todosQuery.data || []}>
                {(todo) => (
                  <TodoItem todo={todo} />
                )}
              </For>
            </Show>
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default TodoList;