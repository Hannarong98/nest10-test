import { BadRequestException, Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { parse, unparse } from 'papaparse';

const sortFn = (current: string, next: string): number =>
    isNaN(Number(current))
        ? current.toLowerCase().localeCompare(next.toLowerCase())
        : Number(current) - Number(next);

@Injectable()
export class SortService {
    public async sortCsv(sortColumn: string) {
        const castedSortColumn = Number(sortColumn);

        const csv = readFileSync('files/to-sort.csv');

        const result = parse<string[]>(csv.toString(), {
            header: false,
            delimitersToGuess: [',', '\t', '|', ';'],
        });

        const header = result.data[0];

        if (isNaN(Number(sortColumn))) {
            throw new BadRequestException('sortColumn must be a number string');
        }

        if (castedSortColumn >= result.data[0].length) {
            throw new BadRequestException(
                `sortColumn cannot be higher than ${result.data[0].length - 1}`,
            );
        }

        const sorted = result.data
            .slice(1, result.data.length)
            .sort((current, next) =>
                sortFn(current[castedSortColumn], next[castedSortColumn]),
            );

        sorted.unshift(header);

        const unparsedData = unparse(sorted);

        writeFileSync(`files/sorted.csv`, unparsedData);
    }
}
