import {
  Body,
  Controller,
  Post,
  UseFilters,
  Patch,
  Param,
  Get,
  Delete,
  Headers,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryEntity } from './entity/category.entity';

@Controller('category')
@ApiTags('Category')

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  
  @Post()
  createCategory(
    @Body() reqBody: CreateCategoryDto,
    @Headers('userId') createdBy: string,
  ) {
    return this.categoryService.createCategory(reqBody, createdBy);
  }

 
  
  @Patch('/:categoryId')
  updateCategory(
    @Body() reqBody: UpdateCategoryDto,
    @Param() param,
    @Headers('userId') createdBy: string,
  ) {
    const categoryId = parseInt(param.categoryId);
    return this.categoryService.updateCategory(
      reqBody,
      categoryId,
      createdBy,
    );
  }

  
  @Get()
 async getAllCategory() {
    return await this.categoryService.getAllCategory();
  }

  
  @Delete('/:categoryId')
  @ApiParam({ name: 'categoryId', required: true })
  deleteCategory(@Param() param) {
    const categoryId = parseInt(param.categoryId);
    return this.categoryService.deleteCategory(categoryId);
  }
}

// @Column({nullable: true, default: null })
// user_id: string;