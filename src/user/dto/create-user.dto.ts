import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateUserDto {
    @ApiPropertyOptional({
        description: 'phone number of the user',
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @Matches(/^[6-9]\d{9}$/)
    phone_number: string;
}
