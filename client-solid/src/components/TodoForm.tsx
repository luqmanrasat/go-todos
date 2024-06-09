import { Component } from "solid-js";

const TodoForm: Component = () => {
  
  return (
    <form class="flex gap-2 justify-center my-4">
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full max-w-xs"
      />
      <button type="submit" class="btn btn-primary active:scale-95">
        Add
      </button>
    </form>
  );
};

export default TodoForm;