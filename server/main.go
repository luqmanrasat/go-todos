package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

type Todo struct {
	bun.BaseModel `bun:"table:todos,alias:t"`

	ID        int64  `json:"id"        bun:",pk,autoincrement,unique"`
	Completed bool   `json:"completed"`
	Body      string `json:"body"`
}

var db *bun.DB

func main() {
	fmt.Println("Hello world")

	// Load .env file
	if os.Getenv("ENV") != "production" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file", err)
		}
	}

	// Connect to PostgreSQL
	POSTGRES_URI := os.Getenv("POSTGRES_URI")
	if POSTGRES_URI == "" {
		log.Fatal("POSTGRES_URI is not set")
	}
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(POSTGRES_URI)))
	db = bun.NewDB(sqldb, pgdialect.New())
	defer db.Close()

	err := db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	// TODO: add migration
	// _, err = db.NewCreateTable().Model((*Todo)(nil)).Exec(context.Background())
	// if err != nil {
	// 	log.Fatal(err)
	// }

	fmt.Println("Connected to PostgreSQL")

	// Init web server
	app := fiber.New()

	if os.Getenv("ENV") == "production" {
		app.Static("/", "../client/dist")
	} else {
		app.Use(cors.New(cors.Config{
			AllowOrigins: "http://localhost:5173",
			AllowHeaders: "Origin,Content-Type,Accept",
		}))
	}

	// Set routes
	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", createTodo)
	app.Patch("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)

	// Start web server
	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "5000"
	}
	log.Fatal(app.Listen("0.0.0.0:" + PORT))
}

func getTodos(c *fiber.Ctx) error {
	var todos []Todo

	err := db.NewSelect().Model(&todos).Scan(context.Background())
	if err != nil {
		return err
	}

	return c.JSON(todos)
}

func createTodo(c *fiber.Ctx) error {
	todo := &Todo{}

	if err := c.BodyParser(todo); err != nil {
		return err
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo body cannot be empty"})
	}

	_, err := db.NewInsert().Model(todo).Exec(context.Background())
	if err != nil {
		return err
	}

	return c.Status(201).JSON(*todo)
}

func updateTodo(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	todo := &Todo{}
	if err := c.BodyParser(todo); err != nil {
		return err
	}

	todo.ID = int64(id)

	res, err := db.NewUpdate().Model(todo).Column("completed").WherePK().Exec(context.Background())
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows < 1 {
		return c.Status(404).JSON(fiber.Map{"error": "Todo ID not found"})
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

func deleteTodo(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	todo := &Todo{ID: int64(id)}

	res, err := db.NewDelete().Model(todo).WherePK().Exec(context.Background())
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows < 1 {
		return c.Status(404).JSON(fiber.Map{"error": "Todo ID not found"})
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}
