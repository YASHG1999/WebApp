import { DataSource, In, Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './entities/product.entity';
import { id } from 'date-fns/locale';
import {CategoryEntity} from "../category/entity/category.entity";




  
@Injectable()
export class ProductsService {
  constructor(private dataSource: DataSource,

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
    console.log(productBody);
    let existingProduct:ProductsEntity = null;


      existingProduct = await this.productsRepository.findOneBy({ id: productId });
      existingProduct.packet_description = productBody.packet_description;
      await this.productsRepository.save(existingProduct);
     return existingProduct;

    }
//id fetch
  async getAllProduct(){
  const userRepository = this.dataSource.getRepository(ProductsEntity);
  return await userRepository.find({where:{is_active:true}});
}

  // (filters: any = {}) {
  //   const filter: {
  //     id?: number;
  //   } = {};
  //   if (filters?.id) filter.id = filters.id;
  //   };
  

    
   // for Delete Product
  async deleteProduct(id: number) {
   
   const a = await this.productsRepository.findOneBy({id:id});
    a.is_active=false;
    await this.productsRepository.save(a);
    return a;
  }
}







