import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export function KeyValueTable({ data }: { data: Map<string, string> }) {
  return (
    <Table className="border rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from(data.entries()).map(([key, value], id) => (
          <TableRow key={id}>
            <TableCell>{key}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
