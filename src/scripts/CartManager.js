import * as fs from "fs";

import { ProductManager } from "../scripts/ProductManager.js";

const prod = new ProductManager("./src/data/productos.json");

class CartManager {
    #Carts;
    #path; 
    constructor(path = "./src/carritos.json") {
        this.#path = path;
        this.#Carts = [];
        const loadCarts = async () => {
            try {
                this.#Carts = JSON.parse(
                    await fs.promises.readFile(this.#path, "utf-8")
                );
            } catch {
                this.#Carts = [];
            }
        };
        loadCarts();
    }
    getCarts = () => {
        return this.#Carts;
    };

    getCartById = (cid) => {
       const cartfound = this.#Carts.findIndex(
            (Carro) => Carro.id === parseInt(cid)
        );
       if (cartfound < 0) {
            return { error: 2, errortxt: "el Carro no existe" };
        }
        const Carro = this.#Carts[cartfound];
        const productosCompleto = Carro.products.map((producto) => {
           const prodexists = prod.getProductById(producto.id);
           if (prodexists.id === undefined) {
                return {
                    ...producto,
                    error: 2,
                    errortxt: "el Producto ya no esta disponible",
                };
            } else {
                return { ...producto, ...prodexists };
            }
        });
        return {id: Carro.id, products: productosCompleto};
    };

   getPath = () => {
        return this.#path;
    };

    addCart = () => {
        const id =
            this.#Carts.length === 0
                ? 1
                : this.#Carts[this.#Carts.length - 1].id + 1;
        const products = [];
        const Cart = {
            id,
            products,
        };
        this.#Carts.push(Cart);
        const saveCarts = async () => {
            try {
                const filewriten = await fs.promises.writeFile(
                    this.#path,
                    JSON.stringify(this.#Carts)
                );
                return Cart;
            } catch (err) {
                return err;
            }
        };
        return saveCarts();
    };

    addProduct = ({ cid, pid }) => {
        const cartfound = this.#Carts.findIndex(
            (Carro) => Carro.id === parseInt(cid)
        );
        if (cartfound < 0) {
            return { error: 2, errortxt: "el Carro no existe" };
        }
        const Carro = this.#Carts[cartfound];
        const prodexists = prod.getProductById(pid);
        if (prodexists.id === undefined) {
            return { error: 2, errortxt: "el Producto no existe" };
        }
        const prodfound = Carro.products.findIndex(
            (product) => product.id === parseInt(pid)
        );
        if (prodfound < 0) {
            Carro.products.push({ id: pid, quantity: 1 });
        } else {
            Carro.products[prodfound].quantity++;
        }
        const saveCarts = async () => {
            try {
                const filewriten = await fs.promises.writeFile(
                    this.#path,
                    JSON.stringify(this.#Carts)
                );
                return Carro;
            } catch (err) {
                return err;
            }
        };
        return saveCarts();
    };
}

export { CartManager };