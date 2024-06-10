import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { Component, createSignal } from "solid-js";
import { createTodo } from "../controllers/todos";
import { CgSpinner } from "solid-icons/cg";
import { IoAdd } from "solid-icons/io";

const TodoForm: Component = () => {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = createSignal("");

  const createTodoMutation = createMutation(() => ({
    mutationKey: ["createTodo"],
    mutationFn: async (e: SubmitEvent) => {
      e.preventDefault();
      await createTodo(newTodo());
    },
    onSuccess: () => {
      setNewTodo("");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  }));

  return (
    <form class="flex gap-4 justify-center items-center my-4" onSubmit={createTodoMutation.mutate}>
      <input
        class="input input-md input-bordered w-full max-w-xs"
        type="text"
        placeholder="Add things to do"
        value={newTodo()}
        onChange={(e) => setNewTodo(e.currentTarget.value)}
      />
      <button
        class="btn btn-square btn-primary active:scale-95"
        type="submit"
      >
        { createTodoMutation.isPending ? <CgSpinner class="animate-spin" size={30} /> : <IoAdd size={30} />}
      </button>
    </form>
  );
};

export default TodoForm;