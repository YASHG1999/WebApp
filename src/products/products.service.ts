import { DataSource, In, Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './entities/product.entity';
import { id } from 'date-fns/locale';




  
@Injectable()
export class ProductsService {
  constructor(
    
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,

    
  ) {}
  
 
  async createProduct(
    productBody: CreateProductDto,
    updatedBy: string,
  ){
    let product: ProductsEntity = null;
    console.log(productBody);
      product = await this.productsRepository.save({
        ...productBody,
        updated_by: updatedBy,
      });
      return product;
      
  }

  async updateProduct(
    productBody: UpdateProductDto,
    productId: number,
    updatedBy: string,
  ){
    let product = null;
    let existingProduct:ProductsEntity = null;
    
      existingProduct = await this.productsRepository.findOneBy({ id: productId });
      existingProduct.packet_description = productBody.packet_description;
     return existingProduct;
      
    }

  async getAllProduct(filters: any = {}) {
    const filter: {
      id?: number;
    } = {};
    if (filters?.id) filter.id = filters.id;
    };
  

    
   // for Delete Product
  async deleteProduct(id: number) {
   
   const a = await this.productsRepository.findOneBy({id:id});
    a.is_active=false;
    await this.productsRepository.save(a);
    return a;
  }
}







