import {
    Controller,
    Param,
    Post,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { SortService } from './sort.service';

@Controller('sort')
export class SortController {
    constructor(private readonly sortService: SortService) {}

    @Post('/:sortColumn')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './files',
                filename: (_req, _file, cb) => {
                    return cb(null, 'to-sort.csv');
                },
            }),
        }),
    )
    public async sortCsv(
        @UploadedFile() file: Express.Multer.File,
        @Param('sortColumn') sortColumn: string,
    ) {
        await this.sortService.sortCsv(sortColumn);

        return new StreamableFile(createReadStream(
            join(process.cwd(), `files/sorted.csv`),
        ););
    }
}
