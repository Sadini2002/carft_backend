import product from "../model/product.js"; 
import { isAdmin } from "./userController.js";

export async function getProducts (req, res) {
    
    try {
          if (isAdmin(req) ) {
            const products = await product.find()
            res.json(products)
        } else  {

            const products = await product.find({isAvailable:true  } )
            res.json(products)
        }
    } catch (err) {

        res.json({
                message: "Failed to get products",
                error: err.message
            });
            
}
}


export function saveProduct(req, res) {

    if(!isAdmin(req) ){
        return res.status(403) .json({ message: "Only admin can create product" });
        return;
    }

 
    const newProduct = new product(
        req.body    
    );
newProduct.save()
    .then(() => {
        res.json({ message: 'Product created successfully' });     
    })
    .catch((err) => {
        res.json({ message: 'Error creating product', error: err });
    }); 



}
    


export async function deleteProduct(req, res) {

    if(!isAdmin(req) ){
        return res.status(403) .json({ message: "Only admin can delete product" });
        
    }
    try{
    await product.deleteOne({productId: req.body.productId})
    res.json({ message: 'Product deleted successfully' });  
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err });
    }

}

export async function updateProduct(req, res) {
    if(!isAdmin(req) ){
        return res.status(403) .json({ message: "Only admin can update product" });
    
    }
    const productId = req.params.productId
    const updatingData = req.body;

    try{
        await product.updateOne({
            productId: productId
        },
            updatingData
        );
        res.json({ message: 'Product updated successfully' });  
 
    }catch(err){
        res.status(500).json({ message: 'Internal server Error', error: err });
    }
}

export async function getProductById(req, res) 
{
    const productId = req.params.productId;
    try{
        constproduct = await product.findOne({ product : productId });
        if(product===null){
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        if(product.isAvailable ){
            res.json(product);
        }else{
            if(!isAdmin(req) ){
                res.status(404).json({ message: 'Product not found' });
                return;
            }else{
                res.json(product);
            }   
        }


    }catch(err){
        res.status(500).json({ message: 'Internal server Error', error: err });
    }
}

