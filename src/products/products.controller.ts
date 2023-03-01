import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseFilters ,Headers} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsEntity } from './entities/product.entity';
import { ProductsRole } from './enum/products.role';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles, UserRole } from 'src/core/common/custom.decorator';



@Controller('products')
@ApiTags('products') 

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @ApiBody({ type: CreateProductDto })
  @Post()
  @Roles(UserRole.ADMIN)
  createProduct(
    @Body() reqBody: CreateProductDto,
    @Headers('userId') createdBy: string,
  ){
    return this.productsService.createProduct(reqBody, createdBy);
  }

  @ApiBody({ type: UpdateProductDto })
  @ApiParam({ name: 'productId', required: true })
  @Roles(UserRole.ADMIN)
  @Patch('/:productId')
  updateProduct(
    @Body() reqBody: UpdateProductDto,
    @Param() param,
    @Headers('userId') createdBy: string,
  ) {
    const productId = parseInt(param.productId);
    return this.productsService.updateProduct(reqBody, productId, createdBy);
  }

  
  @Get()
  getAllProducts(){
    return this.productsService.getAllProduct();
  }

  // For Delete Product
  
  @Delete('/:productId')
  @ApiParam({ name: 'productId', required: true })
  deleteProduct(@Param() param) {
    const productId = parseInt(param.productId);
    return this.productsService.deleteProduct(productId);
  }

}



