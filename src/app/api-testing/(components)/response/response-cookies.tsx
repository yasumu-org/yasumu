import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ICookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
}

export function ResponseCookies({ cookies }: { cookies: ICookie[] }) {
  return (
    <>
      <div className="overflow-y-auto max-h-[30vh] border-y">
        <Table className="border-x">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Http only</TableHead>
              <TableHead>Secure</TableHead>
              <TableHead>Same site</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cookies.map((cookie, index) => {
              return (
                <TableRow key={`${cookie.name}-${index}`}>
                  <TableCell className="font-medium">{cookie.name}</TableCell>
                  <TableCell className="font-medium">{cookie.value}</TableCell>
                  <TableCell className="font-medium">{cookie.domain}</TableCell>
                  <TableCell className="font-medium">{cookie.path}</TableCell>
                  <TableCell className="font-medium">
                    {String(cookie.expires)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {String(cookie.httpOnly)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {String(cookie.secure)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {cookie.sameSite}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
