import { Component, Show } from "solid-js";
import { Todo, deleteTodo, updateTodo } from "../controllers/todos";
import { IoCheckmarkCircle, IoTrash } from "solid-icons/io";
import { createMutation, useQueryClient } from "@tanstack/solid-query";

const TodoItem: Component<{ todo: Todo }> = (props) => {
  const queryClient = useQueryClient();

  const updateTodoMutation = createMutation(() => ({
    mutationKey: ["updateTodo"],
    mutationFn: async () => {
      await updateTodo(props.todo.id, !props.todo.completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  }));

  const deleteTodoMutation = createMutation(() => ({
    mutationKey: ["deleteTodo"],
    mutationFn: async () => {
      await deleteTodo(props.todo.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  }))

  return (
    <div class="flex items-center gap-2 w-full">
      <div class="flex grow items-center justify-between border border-gray-600 p-2 rounded-lg">
        <p>{props.todo.body}</p>
        <Show when={props.todo.completed}>
          <div class="badge badge-success gap-2 uppercase rounded-md px-1">
            done
          </div>
        </Show>
        <Show when={!props.todo.completed}>
          <div class="badge badge-warning gap-2 uppercase rounded-md px-1">
            in progress
          </div>
        </Show>
      </div>
      <div class="flex items-center gap-1">
        <button class="btn btn-sm btn-square" onClick={() => updateTodoMutation.mutate()}>
          <IoCheckmarkCircle size={20} />
        </button>
        <button class="btn btn-sm btn-square" onClick={() => deleteTodoMutation.mutate()}>
          <IoTrash size={20} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;