import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface IHeader {
  key: string;
  value: string;
}

export function ResponseHeaders({ headers }: { headers: IHeader[] }) {
  return (
    <>
      <div className="overflow-y-auto max-h-[30vh] border-y">
        <Table className="border-x">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {headers.map((header, index) => {
              return (
                <TableRow key={`${header.key}-${index}`}>
                  <TableCell className="font-medium">{header.key}</TableCell>
                  <TableCell className="font-medium">{header.value}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
