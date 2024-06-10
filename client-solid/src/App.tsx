import { Component } from 'solid-js';
import './App.css'
import Navbar from './components/Navbar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const App: Component = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <TodoForm />
        <TodoList />
      </main>
    </>
  )
};

export default App;
