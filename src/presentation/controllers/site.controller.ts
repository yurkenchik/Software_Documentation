import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { SiteService } from '@application/site/site.service';
import { CreateSiteRequestDto } from '@application/site/dto/request/create-site-request.dto';
import { UpdateSiteRequestDto } from '@application/site/dto/request/update-site-request.dto';
import { SiteResponseDto } from '@application/site/dto/response/site-response.dto';

@Controller('sites')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class SiteController {
    constructor(private readonly siteService: SiteService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateSiteRequestDto): Promise<SiteResponseDto> {
        return this.siteService.createSite(dto);
    }

    @Get()
    async list(): Promise<Array<SiteResponseDto>> {
        return this.siteService.listSites();
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<SiteResponseDto> {
        return this.siteService.getSiteById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateSiteRequestDto): Promise<SiteResponseDto> {
        return this.siteService.updateSite(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        await this.siteService.deleteSite(id);
    }
}
