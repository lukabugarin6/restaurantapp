import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { multerConfig } from '../../config/multer.config'; // Adjust the path as needed

@ApiTags('Menu Item')
@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        data: {
          type: 'string',
          description: 'JSON string of CreateMenuItemDto',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, // Image is optional
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }), // Allowed image types
        ],
      }),
    )
    image: Express.Multer.File,
    @Body('data') data: string,
  ): Promise<MenuItem> {
    if (!data) {
      throw new BadRequestException('Data is required');
    }

    const createMenuItemDto: CreateMenuItemDto = JSON.parse(data);
    const imageUrl = image ? `/uploads/images/${image.filename}` : null;

    return this.menuItemService.create(createMenuItemDto, imageUrl);
  }

  @Get()
  async findAll(): Promise<MenuItem[]> {
    return this.menuItemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MenuItem> {
    return this.menuItemService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        data: {
          type: 'string',
          description: 'JSON string of UpdateMenuItemDto',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, // Image is optional
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }), // Allowed image types
        ],
      }),
    )
    image: Express.Multer.File,
    @Body('data') data: string,
  ): Promise<MenuItem> {
    if (!data) {
      throw new BadRequestException('Data is required');
    }

    // Parse the data string into an object
    const updateData = JSON.parse(data);

    // If image is provided, use its URL. If image is null, pass null. If no image is provided, pass undefined.
    const imageUrl = image
      ? `/uploads/images/${image.filename}`
      : updateData.image === null // Check the parsed object, not the string
        ? null
        : undefined;

    const updateMenuItemDto: UpdateMenuItemDto = updateData;

    return this.menuItemService.update(id, updateMenuItemDto, imageUrl);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.menuItemService.remove(id);
  }
}