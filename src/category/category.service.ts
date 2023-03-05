import { DataSource, Repository ,In} from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoryEntity } from './entity/category.entity';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { id } from 'date-fns/locale';

@Injectable()
export class CategoryService {
  constructor(private dataSource: DataSource
    ,@InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    ) {}

  async createCategory(
    categoryBody: CreateCategoryDto,
    updatedBy: string,
  ) {
    let category: CategoryEntity = null;
    
    category = await this.categoryRepository.save({
      ...categoryBody,
      updated_by: updatedBy,
    });
    return category;
  }

  async updateCategory(
    categoryBody: UpdateCategoryDto,
    categoryId: number,
    updatedBy: string,
  ) {
    let category = null;
    console.log(categoryBody)
    let existingCategory:CategoryEntity = null;

      existingCategory = await this.categoryRepository.findOneBy({ id : categoryId});
      existingCategory.name = categoryBody.name;
      await this.categoryRepository.save(existingCategory);
      return existingCategory;
//save and return
    }

  async getAllCategory() {
    const userRepository = this.dataSource.getRepository(CategoryEntity);
    return await userRepository.find({where:{is_active:true}});
  }

  async deleteCategory(categoryId: number) {
    const a = await this.categoryRepository.findOneBy({id:categoryId});
    a.is_active=false;
    await this.categoryRepository.save(a);
    return a;
    
  }
}