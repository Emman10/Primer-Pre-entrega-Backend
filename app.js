import express from "express";
import { ProductManager } from "./scripts/ProductManager.js";

const app = express();

const prod = new ProductManager("productos.json");

app.get("/", (req, res) => {
    res.send(`serverup `);
});
app.listen(8080, () => {
    console.log("Server UP");
});

app.get("/products", (req, res) => {
    let { limit } = req.query;
    if( limit) {
        res.status(200).send(prod.getProducts().slice(0,+limit));
    } else {
        res.status(200).send(prod.getProducts());
    }
});
app.get("/product/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let foundprod = prod.getProductById(id)
    if(foundprod===false) {
        res.status(400).send({error:'Producto no encontrado'});
    } else {
        res.status(200).send(foundprod);
    }
});