import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import ejs from "ejs";
import "dotenv/config";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");// Set EJS as the templating engine

let items = []; // In-memory list of items, will be populated from the database on each request

async function getItems() { // Function to fetch items from the database
  const results = await db.query("SELECT * FROM items ORDER BY created_at ASC, id ASC"); // Execute the SQL query to get all items from the "items" table
  items = results.rows; // Update the in-memory list of items with the results from the database
}

  app.get("/", async (req, res) => {
  try {
    await getItems(); // Fetch items from the database before rendering the page
    res.render("index.ejs", { // Pass the items to the template
      listTitle: "Today", // Set the title of the list
      listItems: items, // Use the items fetched from the database
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => { // Handle the form submission to add a new item
  const newItem = req.body.newItem;// Get the new item title from the form data
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [newItem]); // Insert the new item into the database
    //items.push({ id: items.length + 1, title: newItem }); // Add the new item to the in-memory list (optional, since we fetch from the database on each request)
    res.redirect("/"); // Redirect back to the home page to see the updated list
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {// Handle the form submission to edit an existing item
const id = req.body.updatedItemId;
const updateditemTitle = req.body.updatedItemTitle;
try {
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [updateditemTitle, id]);
 // const itemIndex = items.findIndex((item) => item.id == id); // Find the index of the item to be edited
  //if (itemIndex !== -1) { // If the item is found, update its title
    //items[itemIndex].title = updateditemTitle; // Update the title of the item in the in-memory list (optional, since we fetch from the database on each request)
 
  res.redirect("/");
} catch (err) {
  console.log(err);
 }
});

app.post("/delete", async (req, res) => {
const deleteitemId = req.body.deleteItemId;
try {
  await db.query("DELETE FROM items WHERE id = $1", [deleteitemId]);
  //items = items.filter((item) => item.id != deleteitemId); // Remove the deleted item from the in-memory list (optional, since we fetch from the database on each request)
  res.redirect("/");
} catch (err) {
  console.log(err);
}
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
