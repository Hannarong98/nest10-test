import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync, unlinkSync } from 'fs';
import { parse } from 'papaparse';
import path, { resolve } from 'path';
import { SortService } from './sort.service';

const extractFromResults = (
    sorted: any[],
    unsorted: any[],
): { a: string; b: string } => {
    const firstArray = sorted[0];
    const firstArrayContent = firstArray[0];

    const secondArray = unsorted[0];
    const secondArrayContent = secondArray[0];

    return { a: firstArrayContent, b: secondArrayContent };
};

const getFileContent = (filePath: string) => {
    const file = path.resolve(__dirname, filePath);

    return readFileSync(file);
};

describe('SortService', () => {
    let service: SortService;

    const parserConfig = {
        header: false,
        delimitersToGuess: [',', '\t', '|', ';'],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SortService],
        }).compile();

        service = module.get<SortService>(SortService);
    });

    afterAll(() => {
        try {
            unlinkSync(resolve(__dirname, '../../files/sorted.csv'));
        } catch (error) {
            console.warn(error);
        }
    });

    it('should be sorted comma', async () => {
        const sortColumn = '0';

        const unsortedFileContent = getFileContent(
            '../../files/tests/to-sort.csv',
        );

        await service.sortCsv(sortColumn);

        const sortedFileContent = getFileContent(`../../files/sorted.csv`);

        const unsortedParse = parse(
            unsortedFileContent.toString(),
            parserConfig,
        ).data;
        const sortedParse = parse(
            sortedFileContent.toString(),
            parserConfig,
        ).data;

        const unsortedContent = unsortedParse.slice(1, unsortedParse.length);
        const sortedContent = sortedParse.slice(1, sortedParse.length);

        const results = extractFromResults(sortedContent, unsortedContent);

        expect(results.a).toEqual('1');
        expect(results.b).toEqual('5');

        expect(results.a).not.toEqual(results.b);
        expect(unsortedFileContent).not.toEqual(sortedFileContent);
    });

    it('should be sorted semi colon', async () => {
        const sortColumn = '0';

        const unsortedFileContent = getFileContent(
            '../../files/tests/to-sort-semi-colon.csv',
        );

        await service.sortCsv(sortColumn);

        const sortedFileContent = getFileContent(`../../files/sorted.csv`);

        const unsortedParse = parse(unsortedFileContent.toString(), parserConfig).data;
        const sortedParse = parse(sortedFileContent.toString(), parserConfig).data;

        const unsortedContent = unsortedParse.slice(1, unsortedParse.length);
        const sortedContent = sortedParse.slice(1, sortedParse.length);

        const results = extractFromResults(sortedContent, unsortedContent);

        expect(results.a).toEqual('1');
        expect(results.b).toEqual('5');

        expect(results.a).not.toEqual(results.b);
        expect(unsortedFileContent).not.toEqual(sortedFileContent);
    });

    it('should be sorted tab', async () => {
        const sortColumn = '0';

        const unsortedFileContent = getFileContent(
            '../../files/tests/to-sort-tab.csv',
        );

        await service.sortCsv(sortColumn);

        const sortedFileContent = getFileContent(`../../files/sorted.csv`);

        const unsortedParse = parse(unsortedFileContent.toString(), parserConfig).data;
        const sortedParse = parse(sortedFileContent.toString(), parserConfig).data;

        const unsortedContent = unsortedParse.slice(1, unsortedParse.length);
        const sortedContent = sortedParse.slice(1, sortedParse.length);

        const results = extractFromResults(sortedContent, unsortedContent);

        expect(results.a).toEqual('1');
        expect(results.b).toEqual('5');

        expect(results.a).not.toEqual(results.b);
        expect(unsortedFileContent).not.toEqual(sortedFileContent);
    });
});