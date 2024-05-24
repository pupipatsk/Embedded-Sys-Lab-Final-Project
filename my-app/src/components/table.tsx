/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/iWfImqQvYbt
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

export function Table() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md">
        <div className="relative overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="w-[150px]">Time</TableHead>
                <TableHead className="w-[150px]">Elapsed Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>10:15 AM</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>10:20 AM</TableCell>
                <TableCell>5 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>10:25 AM</TableCell>
                <TableCell>5 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>10:30 AM</TableCell>
                <TableCell>5 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>10:35 AM</TableCell>
                <TableCell>5 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>10:40 AM</TableCell>
                <TableCell>5 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>10:45 AM</TableCell>
                <TableCell>5 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>10:50 AM</TableCell>
                <TableCell>5 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>10:55 AM</TableCell>
                <TableCell>5 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-05-24</TableCell>
                <TableCell>11:00 AM</TableCell>
                <TableCell>5 min</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
