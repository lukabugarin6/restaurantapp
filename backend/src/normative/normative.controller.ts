import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { NormativeService } from './normative.service';
import { CreateNormativeDto } from './dto/create-normative.dto';
import { UpdateNormativeDto } from './dto/update-normative.dto';
import { Normative } from './entities/normative.entity';

@Controller('normatives')
export class NormativeController {
  constructor(private readonly normativeService: NormativeService) {}

  @Post()
  create(@Body() createNormativeDto: CreateNormativeDto): Promise<Normative> {
    return this.normativeService.create(createNormativeDto);
  }

  @Get()
  findAll(): Promise<Normative[]> {
    return this.normativeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Normative> {
    return this.normativeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateNormativeDto: UpdateNormativeDto,
  ): Promise<Normative> {
    return this.normativeService.update(id, updateNormativeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.normativeService.remove(id);
  }
}
